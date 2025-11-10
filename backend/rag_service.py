# backend/rag_service.py
"""
RAG Service for generating medical reports
Combines ML predictions with medical knowledge base
"""

from datetime import datetime
from medical_knowledge import get_pathology_info, MEDICAL_KNOWLEDGE


def generate_medical_report(patient_data, ml_predictions, top_n=3):
    """
    Generate a clean, doctor-style medical report
    
    Args:
        patient_data: dict with keys: name, age, gender, patient_id
        ml_predictions: list of dicts with keys: pathology, confidence, location_description
        top_n: number of top predictions to include
    
    Returns:
        dict with report_text and citations
    """
    
    # Sort predictions by confidence
    sorted_predictions = sorted(ml_predictions, key=lambda x: x['confidence'], reverse=True)
    top_predictions = sorted_predictions[:top_n]
    
    # Build report sections
    report_sections = []
    all_citations = []
    
    # Header
    header = f"""RADIOLOGY REPORT - CHEST X-RAY

Patient Name: {patient_data['name']}
Patient ID: {patient_data['patient_id']}
Age: {patient_data['age']} years
Gender: {patient_data['gender']}
Examination Date: {datetime.now().strftime('%B %d, %Y')}
Examination Type: Chest Radiograph (PA/Lateral)

"""
    report_sections.append(header)
    
    # Clinical Findings
    findings_section = "FINDINGS:\n\n"
    
    if not top_predictions or all(p['confidence'] < 0.3 for p in top_predictions):
        findings_section += "The chest radiograph demonstrates clear lung fields bilaterally with no acute cardiopulmonary abnormality. "
        findings_section += "Cardiac silhouette is within normal limits. Mediastinal contours are unremarkable. "
        findings_section += "No pleural effusion or pneumothorax identified.\n\n"
    else:
        for idx, pred in enumerate(top_predictions, 1):
            pathology = pred['pathology']
            confidence = pred['confidence']
            location = pred.get('location_description', '')
            
            # Get medical knowledge
            knowledge = get_pathology_info(pathology)
            
            if knowledge and confidence > 0.3:
                # Finding description
                findings_section += f"{idx}. "
                
                # Add location if available
                if location:
                    findings_section += f"{location}. "
                
                # Add key X-ray findings from knowledge base
                primary_finding = knowledge['xray_findings'][0]
                findings_section += f"{primary_finding}. "
                
                # Add clinical context
                findings_section += f"This is consistent with {pathology.lower()}. "
                
                # Confidence level
                if confidence > 0.8:
                    findings_section += "High confidence finding.\n\n"
                elif confidence > 0.5:
                    findings_section += "Moderate confidence finding.\n\n"
                else:
                    findings_section += "Low confidence finding, correlation with clinical symptoms recommended.\n\n"
                
                # Collect citations
                all_citations.extend(knowledge['citations'])
    
    report_sections.append(findings_section)
    
    # Impression
    impression_section = "IMPRESSION:\n\n"
    
    if not top_predictions or all(p['confidence'] < 0.3 for p in top_predictions):
        impression_section += "No acute cardiopulmonary disease.\n\n"
    else:
        significant_findings = [p for p in top_predictions if p['confidence'] > 0.3]
        
        for pred in significant_findings:
            pathology = pred['pathology']
            knowledge = get_pathology_info(pathology)
            
            if knowledge:
                impression_section += f"- {pathology}: {knowledge['clinical_significance']}\n"
        
        impression_section += "\n"
    
    report_sections.append(impression_section)
    
    # Recommendations
    recommendations_section = "RECOMMENDED ACTIONS:\n\n"
    
    if not top_predictions or all(p['confidence'] < 0.3 for p in top_predictions):
        recommendations_section += "- No immediate action required\n"
        recommendations_section += "- Routine follow-up as clinically indicated\n"
        recommendations_section += "- Correlate with patient symptoms\n\n"
    else:
        action_steps = set()
        
        for pred in top_predictions:
            if pred['confidence'] > 0.3:
                knowledge = get_pathology_info(pred['pathology'])
                if knowledge:
                    for step in knowledge['action_steps'][:2]:  # Top 2 steps per finding
                        action_steps.add(step)
        
        for idx, step in enumerate(action_steps, 1):
            recommendations_section += f"{idx}. {step}\n"
        
        recommendations_section += "\n"
    
    report_sections.append(recommendations_section)
    
    # Footer
    footer = """---
Report generated by RAD-ETHIX AI-Assisted Diagnostic System
This report should be reviewed by a licensed radiologist before clinical use
AI Confidence scores and findings are supplementary to clinical judgment
"""
    report_sections.append(footer)
    
    # Combine all sections
    final_report = "".join(report_sections)
    
    # Remove duplicate citations
    unique_citations = list(dict.fromkeys(all_citations))
    
    return {
        'report_text': final_report,
        'citations': unique_citations,
        'findings_count': len([p for p in top_predictions if p['confidence'] > 0.3]),
        'timestamp': datetime.now().isoformat()
    }


def format_citations(citations):
    """Format citations for display"""
    if not citations:
        return "No references cited for this report."
    
    formatted = "REFERENCES:\n\n"
    for idx, citation in enumerate(citations, 1):
        formatted += f"[{idx}] {citation}\n"
    
    return formatted