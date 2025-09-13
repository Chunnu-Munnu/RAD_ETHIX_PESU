# RAD-ETHIX: Ethical and Explainable AI Platform for Chest X-ray Diagnosis

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Motivation](#motivation)  
- [Dataset and Preparation](#dataset-and-preparation)  
- [Model Architecture and Training](#model-architecture-and-training)  
- [Explainability with Grad-CAM](#explainability-with-grad-cam)  
- [System Architecture](#system-architecture)  
- [Frontend and User Experience](#frontend-and-user-experience)  
- [Installation and Setup](#installation-and-setup)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License and Disclaimer](#license-and-disclaimer)  
- [References](#references)  

---

## Project Overview

RAD-ETHIX is an AI-powered platform designed to assist radiologists and healthcare practitioners by automating the analysis of chest X-ray images.  
It uses a DenseNet121 deep learning model pretrained on the Stanford CheXpert dataset to detect 18 key thoracic pathologies with high accuracy.  
The platform emphasizes ethical AI via explainability by generating Grad-CAM heatmaps that highlight image regions influencing the AI's predictions, enhancing clinical trust and interpretability.

---

## Motivation

The growing workload on radiologists coupled with the need for rapid and accurate chest X-ray diagnosis necessitates AI solutions that are not only powerful but transparent.  
Many existing AI diagnostic tools lack interpretability, limiting clinical adoption.  
RAD-ETHIX addresses these challenges by combining state-of-the-art AI with clear, visual explanations and patient-centric reporting workflows.

---

## Dataset and Preparation

- **Dataset:** Stanford CheXpert chest X-ray dataset (~224,000 images with 18 labeled pathologies).  
- **Compression:** The original DICOM images were compressed to approximately 9 GB by preprocessing to 224x224 pixels resolution, normalized and center-cropped, maintaining diagnostic features while reducing data size.  
- **Data Splits:** The dataset was divided into training and validation sets represented by `train.csv` and `valid.csv`, which list the filenames and pathology labels for each image.  
- **Loading:** CSV manifests facilitate efficient dataset loading and batching during training and evaluation.

---

## Model Architecture and Training

- **Model:** DenseNet121 convolutional neural network architecture, selected for its efficient feature reuse and high performance in medical image tasks.  
- **Training:** Fine-tuned on the CheXpert dataset using multi-label classification paradigm through the TorchXRayVision library.  
- **Output:** The model predicts probabilities for 18 key thoracic diseases from a given chest X-ray image.  
- **Performance:** Optimized for fast inference suitable for clinical environments requiring immediate feedback.

---

## Explainability with Grad-CAM

- **Overview:** Grad-CAM (Gradient-weighted Class Activation Mapping) is used to generate heatmaps highlighting which areas of the chest X-ray influenced each diagnosis.
- **Mechanism:** It uses gradients of predicted class scores relative to the last convolutional layers to produce spatial importance maps for each pathology.  
- **Benefits:** Improves transparency and interpretability of the AI model, allowing clinicians to verify that AI focuses on medically relevant regions.  
- **Implementation:** Custom PyTorch hooks capture feature activations and gradients during inference for on-demand heatmap generation.

---

## System Architecture

- **Backend:** FastAPI REST API serves endpoints for model prediction, data queries, and health checks, implemented in Python.  
- **AI and Data Stack:** Utilizes PyTorch, TorchXRayVision for deep learning and model handling, OpenCV and PIL for image processing, and Pandas/NumPy for data management.  
- **Frontend:** Responsive web UI built with HTML, CSS, and JavaScript featuring drag-and-drop uploads, progress visualization, neon branding mascot, heatmap overlays, and doctor contact modal.  
- **Security:** CORS configured for safe frontend-backend communication; data processing complies with privacy best practices.  
- **Visualization:** Seaborn and Matplotlib added for extensions into statistical analysis and reporting.

---

## Frontend and User Experience

- Intuitive drag-and-drop or file browsing for chest X-ray uploads supporting JPG, PNG, and DICOM formats.  
- Real-time upload progress bar and immediate AI analysis.  
- Results display includes top 2 highest-confidence non-critical diseases plus pneumonia if detected with confidence, combined with clear heatmap overlays.  
- Patient-friendly and clinical language reports generated instantly.  
- Embedded doctor contact functionality within UI for easy clinical follow-up.

---
git clone https://github.com/YOURUSERNAME/VisionX_Gradient_Ascent_1.0
pip install -r requirements.txt
uvicorn main:app --reload


Open `index.html` in your browser or serve frontend via HTTP server to run the full app.

---

## Usage

1. Upload a chest X-ray through the web interface.  
2. The backend preprocesses, predicts, and generates heatmaps using the pretrained DenseNet121 model.  
3. The frontend displays the top findings with confidence scores and heatmap overlays.  
4. Connect with a recommended doctor via built-in contact modal if desired.  
5. View detailed AI and patient reports for assessment.

---

## Contributing

Contributions to improve datasets, models, UI design, and clinical validation are welcome. Please fork, modify, and submit pull requests.

---

## License and Disclaimer

RAD-ETHIX is provided under the MIT License for educational and research purposes only. It is not certified for clinical use. Always consult licensed medical professionals prior to making healthcare decisions.

---

## References

- [CheXpert Dataset](https://stanfordmlgroup.github.io/competitions/chexpert/)  
- [TorchXRayVision Library](https://github.com/mlmed/torchxrayvision)  
- Selvaraju et al., Grad-CAM: Visual Explanations from Deep Networks (2017)  
- FastAPI Documentation  
- Seaborn and Matplotlib for Data Visualization

---

*RAD-ETHIX combines cutting-edge AI, transparent explainability, and an ethical approach to empowering radiologists in chest X-ray diagnosis.*



## Installation and Setup

