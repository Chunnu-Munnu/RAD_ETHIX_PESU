from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import torch
import torch.nn.functional as F
import torchvision.transforms
import torchxrayvision as xrv
import cv2
import numpy as np
from PIL import Image
import io
import base64
import logging
from typing import Dict, List, Any
import pandas as pd
import skimage
import skimage.io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="RAD-ETHIX API",
    description="AI-Powered Ethical X-ray Diagnosis using TorchXRayVision",
    version="2.0.0"
)

# Configure CORS - Added more localhost variations
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3001",  # Alternative React port
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
POSITIVE_THRESHOLD = 0.3
HIGH_CONFIDENCE_THRESHOLD = 0.7
DOCTOR_REVIEW_THRESHOLD = 0.6

# Global variables
model = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Disease descriptions for patient reports
DISEASE_DESCRIPTIONS = {
    'Atelectasis': 'Collapse or closure of lung tissue resulting in reduced gas exchange',
    'Consolidation': 'Areas of lung filled with liquid instead of air, often indicating pneumonia',
    'Infiltration': 'Abnormal substance in lung tissue, may indicate infection or inflammation',
    'Pneumothorax': 'Collapsed lung due to air leak - requires immediate medical attention',
    'Edema': 'Fluid accumulation in lung tissue, may indicate heart failure',
    'Emphysema': 'Lung condition causing shortness of breath due to damaged air sacs',
    'Fibrosis': 'Lung scarring that makes breathing difficult',
    'Effusion': 'Abnormal accumulation of fluid around the lungs',
    'Pneumonia': 'Lung infection causing inflammation - may need antibiotic treatment',
    'Pleural_Thickening': 'Scarring of the lining around the lungs',
    'Cardiomegaly': 'Enlarged heart, may indicate underlying heart disease',
    'Nodule': 'Small spots in lungs that need follow-up evaluation',
    'Mass': 'Larger abnormal growth requiring immediate medical evaluation',
    'Hernia': 'Protrusion of organs visible on chest X-ray',
    'Lung Lesion': 'Abnormal tissue in lungs requiring medical assessment',
    'Fracture': 'Bone break visible on chest X-ray',
    'Lung Opacity': 'Cloudy areas in lungs that may indicate disease',
    'Enlarged Cardiomediastinum': 'Enlargement of heart and surrounding structures'
}

class TorchXRayVisionGradCAM:
    """Grad-CAM implementation for TorchXRayVision models"""
    
    def __init__(self, model):
        self.model = model
        self.gradients = None
        self.activations = None
        
        # Hook the last convolutional layer
        self.hook_layers()
    
    def hook_layers(self):
        """Hook into the model's feature layers"""
        def forward_hook(module, input, output):
            self.activations = output
            
        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0]
        
        # For DenseNet in torchxrayvision - hook the final norm layer
        if hasattr(self.model, 'features') and hasattr(self.model.features, 'norm5'):
            target_layer = self.model.features.norm5
        elif hasattr(self.model, 'densenet121') and hasattr(self.model.densenet121.features, 'norm5'):
            target_layer = self.model.densenet121.features.norm5
        else:
            # Fallback - hook the last layer we can find
            target_layer = list(self.model.modules())[-3]
        
        target_layer.register_forward_hook(forward_hook)
        target_layer.register_backward_hook(backward_hook)
    
    def generate_cam(self, input_tensor, class_idx):
        """Generate Class Activation Map for specific disease"""
        self.model.eval()
        
        # Forward pass
        output = self.model(input_tensor)
        
        # Zero gradients
        self.model.zero_grad()
        
        # Backward pass
        class_score = output[0, class_idx]
        class_score.backward(retain_graph=True)
        
        if self.gradients is None or self.activations is None:
            return np.zeros((224, 224))
        
        # Calculate weights
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)
        
        # Generate CAM
        cam = torch.sum(weights * self.activations, dim=1).squeeze(0)
        cam = F.relu(cam)
        
        # Convert to numpy and normalize
        cam = cam.detach().cpu().numpy()
        if cam.max() > 0:
            cam = cam / cam.max()
        
        return cam

def create_heatmap_overlay(original_image, heatmap, alpha=0.4):
    """Create heatmap overlay on original image"""
    # Resize heatmap to match image
    h, w = original_image.shape[:2]
    heatmap_resized = cv2.resize(heatmap, (w, h))
    
    # Convert to color
    heatmap_colored = cv2.applyColorMap(
        (heatmap_resized * 255).astype(np.uint8), 
        cv2.COLORMAP_JET
    )
    
    # Blend with original
    overlay = cv2.addWeighted(original_image, 1-alpha, heatmap_colored, alpha, 0)
    return overlay

def preprocess_xray_image(image_bytes):
    """Preprocess X-ray image using TorchXRayVision standards"""
    # Convert to PIL then numpy
    pil_image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = np.array(pil_image)
    
    # Convert to grayscale if needed
    if len(img.shape) > 2:
        img = img[:, :, 0]
    
    # Normalize using TorchXRayVision method
    img = xrv.datasets.normalize(img, 255)
    
    # Add channel dimension
    img = img[None, :, :]
    
    # Apply TorchXRayVision transforms
    transform = torchvision.transforms.Compose([
        xrv.datasets.XRayCenterCrop()
    ])
    img = transform(img)
    
    return img, np.array(pil_image)

@app.on_event("startup")
async def startup_event():
    """Initialize TorchXRayVision model"""
    global model
    
    logger.info("🚀 Starting RAD-ETHIX with TorchXRayVision...")
    logger.info(f"Device: {device}")
    
    try:
        # Load the CheXpert-trained model
        logger.info("📦 Loading DenseNet121 trained on CheXpert...")
        
        # Use the correct method without from_hf_hub parameter
        model = xrv.models.get_model("densenet121-res224-chex")
        model.to(device)
        model.eval()
        
        logger.info("✅ TorchXRayVision model loaded successfully!")
        logger.info(f"Model supports {len(xrv.datasets.default_pathologies)} pathologies")
        
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise e

@app.get("/", response_class=HTMLResponse)
async def root():
    """API root with simple web interface"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>RAD-ETHIX API</title>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
            .status { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .endpoint { background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 10px 0; }
            .method { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
            .get { background: #28a745; color: white; }
            .post { background: #dc3545; color: white; }
            code { background: #f1f1f1; padding: 2px 5px; border-radius: 3px; }
            .upload-section { background: #e9ecef; padding: 20px; border-radius: 5px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏥 RAD-ETHIX API v2.0</h1>
            <div class="status">
                ✅ <strong>API is running successfully!</strong><br>
                🤖 TorchXRayVision DenseNet121 (CheXpert-trained)<br>
                🖥️ Device: """ + str(device) + """<br>
                📊 Pathologies: """ + str(len(xrv.datasets.default_pathologies) if model else 0) + """
            </div>
            
            <h2>📚 Available Endpoints</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span> <code>/</code><br>
                <small>This page - API status and documentation</small>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <code>/health</code><br>
                <small>Detailed health check with model status</small>
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <code>/diseases</code><br>
                <small>List all supported diseases and descriptions</small>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span> <code>/predict</code><br>
                <small>Upload chest X-ray for AI analysis (multipart/form-data)</small>
            </div>
            
            <div class="upload-section">
                <h3>🔬 Test X-ray Upload</h3>
                <p>Use this form to test the X-ray analysis:</p>
                <form action="/predict" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" accept="image/*" required style="margin: 10px 0;">
                    <br>
                    <input type="submit" value="Analyze X-ray" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                </form>
                <p><small>Supported formats: JPG, PNG, DICOM</small></p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; text-align: center;">
                <p>🔬 Medical AI powered by TorchXRayVision | 🏥 For research and educational purposes</p>
            </div>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy" if model else "degraded",
        "model_loaded": model is not None,
        "device": str(device),
        "torch_version": torch.__version__,
        "pathologies": xrv.datasets.default_pathologies if model else [],
        "endpoints": {
            "root": "GET /",
            "health": "GET /health", 
            "diseases": "GET /diseases",
            "predict": "POST /predict"
        }
    }

@app.get("/diseases")
async def get_diseases():
    """Get supported diseases from the real model"""
    diseases = []
    for disease in xrv.datasets.default_pathologies:
        diseases.append({
            "name": disease,
            "description": DISEASE_DESCRIPTIONS.get(disease, f"Medical condition: {disease}")
        })
    
    return {
        "diseases": diseases,
        "total_count": len(diseases),
        "source": "CheXpert Dataset via TorchXRayVision"
    }

@app.post("/predict")
async def predict_chest_xray(file: UploadFile = File(...)):
    """
    Real medical X-ray prediction using TorchXRayVision CheXpert model
    """
    
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Please upload an image file")
    
    try:
        logger.info(f"🔬 Analyzing X-ray: {file.filename}")
        
        # Read and preprocess image
        contents = await file.read()
        processed_img, original_img = preprocess_xray_image(contents)
        
        # Convert to tensor
        img_tensor = torch.from_numpy(processed_img).unsqueeze(0).to(device)
        img_tensor.requires_grad_(True)
        
        # Get predictions from the real CheXpert model
        with torch.no_grad():
            predictions = model(img_tensor).cpu().numpy()[0]
        
        # Apply sigmoid for probabilities
        probabilities = torch.sigmoid(torch.from_numpy(predictions)).numpy()
        
        # Initialize Grad-CAM
        grad_cam = TorchXRayVisionGradCAM(model)
        
        # Process findings
        findings = []
        individual_heatmaps = {}
        
        for i, disease in enumerate(xrv.datasets.default_pathologies):
            confidence = float(probabilities[i])
            
            if confidence > POSITIVE_THRESHOLD:
                # Determine severity
                if disease in ['Pneumothorax', 'Mass', 'Pneumonia']:
                    if confidence >= 0.5:
                        severity = "Critical"
                    elif confidence >= 0.35:
                        severity = "High"
                    else:
                        severity = "Moderate"
                else:
                    if confidence >= HIGH_CONFIDENCE_THRESHOLD:
                        severity = "High"
                    elif confidence >= 0.5:
                        severity = "Moderate"
                    else:
                        severity = "Low"
                
                finding = {
                    "disease": disease,
                    "confidence": confidence,
                    "severity": severity,
                    "description": DISEASE_DESCRIPTIONS.get(disease, f"Medical condition: {disease}"),
                    "critical": disease in ['Pneumothorax', 'Mass', 'Pneumonia']
                }
                findings.append(finding)
                
                # Generate Grad-CAM heatmap
                try:
                    cam = grad_cam.generate_cam(img_tensor, i)
                    
                    # Create overlay (resize original image for overlay)
                    img_resized = cv2.resize(original_img, (224, 224))
                    if len(img_resized.shape) == 3:
                        img_gray = cv2.cvtColor(img_resized, cv2.COLOR_RGB2GRAY)
                        img_overlay = cv2.cvtColor(img_gray, cv2.COLOR_GRAY2RGB)
                    else:
                        img_overlay = cv2.cvtColor(img_resized, cv2.COLOR_GRAY2RGB)
                    
                    overlay = create_heatmap_overlay(img_overlay, cam)
                    
                    # Convert to base64
                    _, buffer = cv2.imencode('.png', overlay)
                    heatmap_b64 = base64.b64encode(buffer).decode()
                    individual_heatmaps[disease] = heatmap_b64
                    
                except Exception as e:
                    logger.warning(f"Failed to generate heatmap for {disease}: {e}")
        
        # Generate combined heatmap
        combined_heatmap_b64 = None
        if findings:
            try:
                max_idx = np.argmax(probabilities)
                combined_cam = grad_cam.generate_cam(img_tensor, max_idx)
                
                img_resized = cv2.resize(original_img, (224, 224))
                if len(img_resized.shape) == 3:
                    img_gray = cv2.cvtColor(img_resized, cv2.COLOR_RGB2GRAY)
                    img_overlay = cv2.cvtColor(img_gray, cv2.COLOR_GRAY2RGB)
                else:
                    img_overlay = cv2.cvtColor(img_resized, cv2.COLOR_GRAY2RGB)
                
                combined_overlay = create_heatmap_overlay(img_overlay, combined_cam)
                
                _, buffer = cv2.imencode('.png', combined_overlay)
                combined_heatmap_b64 = base64.b64encode(buffer).decode()
                
            except Exception as e:
                logger.warning(f"Failed to generate combined heatmap: {e}")
        
        # Calculate metrics
        overall_confidence = float(np.max(probabilities))
        needs_review = overall_confidence < DOCTOR_REVIEW_THRESHOLD or len(findings) > 2
        
        # Generate reports
        ai_report = generate_clinical_report(findings, overall_confidence)
        patient_report = generate_patient_report(findings)
        
        # Response
        response = {
            "status": "success",
            "timestamp": str(pd.Timestamp.now()),
            "findings": findings,
            "confidence_metrics": {
                "overall_confidence": overall_confidence,
                "average_confidence": float(np.mean([f["confidence"] for f in findings])) if findings else 0.0,
                "uncertainty": 1.0 - overall_confidence
            },
            "combined_heatmap": combined_heatmap_b64,
            "individual_heatmaps": individual_heatmaps,
            "ai_report": ai_report,
            "patient_report": patient_report,
            "needs_doctor_review": needs_review,
            "review_reason": "Low confidence" if overall_confidence < DOCTOR_REVIEW_THRESHOLD else "Multiple findings" if len(findings) > 2 else "Standard review",
            "model_info": {
                "name": "TorchXRayVision DenseNet121",
                "training_dataset": "CheXpert",
                "paper": "https://arxiv.org/abs/2111.00595",
                "pathologies_supported": len(xrv.datasets.default_pathologies)
            },
            "metadata": {
                "filename": file.filename,
                "model_version": "TorchXRayVision-v2.0",
                "device": str(device),
                "findings_count": len(findings),
                "detection_threshold": POSITIVE_THRESHOLD
            }
        }
        
        logger.info(f"✅ Analysis complete: {len(findings)} findings detected")
        return response
        
    except Exception as e:
        logger.error(f"❌ Prediction failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_clinical_report(findings, confidence):
    """Generate clinical report"""
    report = "CHEST X-RAY AI ANALYSIS REPORT\n"
    report += "=" * 50 + "\n\n"
    report += f"MODEL: TorchXRayVision DenseNet121 (CheXpert-trained)\n"
    report += f"ANALYSIS DATE: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
    
    if not findings:
        report += "FINDINGS: No significant pathological findings detected\n"
        report += "RECOMMENDATION: Normal chest radiograph\n"
    else:
        report += f"FINDINGS: {len(findings)} pathological conditions detected\n\n"
        for i, finding in enumerate(findings, 1):
            report += f"{i}. {finding['disease'].upper()}\n"
            report += f"   • Confidence: {finding['confidence']:.1%}\n"
            report += f"   • Severity: {finding['severity']}\n"
            report += f"   • Description: {finding['description']}\n\n"
    
    report += f"OVERALL CONFIDENCE: {confidence:.1%}\n"
    report += "NOTE: This analysis uses a validated model trained on CheXpert dataset\n"
    report += "Clinical correlation and physician review recommended\n"
    
    return report

def generate_patient_report(findings):
    """Generate patient-friendly report"""
    report = "Your Chest X-Ray Results\n"
    report += "=" * 30 + "\n\n"
    
    if not findings:
        report += "✅ GOOD NEWS: No concerning findings detected\n\n"
        report += "The AI analysis did not identify signs of disease in your chest X-ray.\n"
    else:
        report += f"📋 SUMMARY: {len(findings)} findings detected\n\n"
        report += "The AI has identified some areas that may need medical attention:\n\n"
        
        for i, finding in enumerate(findings, 1):
            report += f"{i}. {finding['disease']}\n"
            report += f"   • AI Confidence: {finding['confidence']:.0%}\n"
            report += f"   • What it means: {finding['description']}\n"
            if finding.get('critical'):
                report += f"   • ⚠️  IMPORTANT: Needs prompt medical attention\n"
            report += "\n"
    
    report += "NEXT STEPS:\n"
    report += "• Schedule appointment with your doctor\n"
    report += "• Discuss these results and your symptoms\n"
    report += "• Follow medical advice for treatment\n\n"
    
    report += "NOTE: This AI uses a medical-grade model trained on real hospital data\n"
    report += "Only qualified doctors can provide final diagnosis and treatment\n"
    
    return report

# FIXED: Use localhost instead of 0.0.0.0 for local development
if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting RAD-ETHIX API server...")
    uvicorn.run(
        "main:app", 
        host="127.0.0.1",  # Changed from 0.0.0.0 to 127.0.0.1
        port=8000, 
        reload=True,
        log_level="info"
    )