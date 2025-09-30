# RAD_ETHIX_PESU
Radiology the Ethical way
RAD-ETHIX: Ethical & Explainable AI for Chest X-ray Diagnosis
Table of Contents

Project Overview

Motivation

Dataset and Preparation

Model Architecture & Training

Explainability with Grad-CAM

System Architecture

Frontend & User Experience

Project Structure

Installation and Setup

Backend Setup (Python & FastAPI)

Frontend Setup (React)

Usage

Contributing

License & Disclaimer

References

Project Overview
RAD-ETHIX is a modern, ethical AI platform for transparent automated chest X-ray diagnosis.
Built atop DenseNet121 pretrained with the CheXpert dataset, it detects 18 thoracic pathologies, generating confidence scores and explainable Grad-CAM heatmaps for every diagnosis.

The full-stack application features:

Medical-grade inference (FastAPI, PyTorch, TorchXRayVision)

Visual explanations (real-time Grad-CAMs)

Clean, rapid frontend (React) optimized for doctors, clinicians, and patients

Downloadable reports, patient-friendly results, and easy doctor connect

Motivation
Rapid, explainable diagnostics are crucial for clinical adoption of AI in radiology.
Many black-box models give results that are hard to trust and verify.
RAD-ETHIX bridges this gap with true explainability, doctor-friendly workflows, and privacy-aware deployment.

Dataset and Preparation
Dataset: Stanford CheXpert (~224k X-ray images, 18 labeled findings).

Preprocessing: DICOM compressed/cropped to 224x224px, normalized.

Splits: train.csv and valid.csv for batch pipelines.

Usage: Dataloaders and transforms via TorchXRayVision.

Model Architecture & Training
Base: DenseNet121 (PyTorch, feature reuse, high accuracy)

Training: Multi-label classification on CheXpert via TorchXRayVision

Inference: Fast, clinic-ready, batch-optimized for low-latency REST API calls

Explainability with Grad-CAM
Why Grad-CAM: Gives spatial "reason for prediction" overlays for each diagnosis

How: Custom hooks extract gradients and conv activations for heatmap blending

Result: Every AI finding comes with a transparent, reviewable heatmap—directly on the patient upload

System Architecture
Backend: FastAPI (prediction, health check, report gen)

AI stack: PyTorch, TorchXRayVision, OpenCV, Pillow, Pandas, NumPy

Frontend: React (modern, responsive, secure)

Features: Drag/drop upload, progress bar, neon mascot, modal doctor contacts

Downloadable report, transparent diagnosis workflow

Security & Privacy: CORS config, no permanent file storage, zero patient data retention

Frontend & User Experience
Responsive React SPA (single page app) with modern Perplexity-style layout

Easy drag-and-drop or file browse for uploading X-rays (JPG/PNG/DICOM)

Clear "Analyze" action, instant visual feedback, heatmap overlays for findings

Best 3 disease predictions (“critical” pneumonia always shown if flagged)

Downloadable patient report button

Modal to contact listed doctors directly

Toggleable light (muted beige/gray) and dark starglow modes

Project Structure
text
RAD-ETHIX/
  backend/
    main.py
    requirements.txt
    ... (other backend scripts and helpers)
  frontend/
    src/
      App.jsx
      App.css
      index.css
      assets/
        JAGO.jpg
      ... (all frontend components)
    package.json
    ... (other frontend configs)
  README.md
Installation and Setup
Backend Setup (Python & FastAPI)
bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
# Or, for clean setup:
pip install fastapi uvicorn[standard] torch torchvision torchxrayvision opencv-python pillow numpy python-multipart scikit-learn matplotlib seaborn pandas

# Run local API server
uvicorn main:app --reload
Frontend Setup (React/Vite)
bash
cd frontend
# If Node.js and npm are not installed, install those first

npm install
# To start development server:
npm run dev
By default, the front end connects to the backend at localhost:8000.

Usage
Start backend:
Run uvicorn main:app --reload in the backend directory.

Start frontend:
Run npm run dev in the frontend directory.

Open the app:
Open localhost:5173 (or your Vite/React port) in your browser.

Upload a chest X-ray image:
Drag and drop or use the file picker.

Analyze:
Click "Analyze X-ray" to trigger AI diagnosis and Grad-CAM results.

Review findings:
Top 3 most likely disease results are displayed, with their confidence scores and a heatmap overlay. "Critical" pneumonia will always be shown if detected.

Get your report:
Download a plain-text report with findings, confidence scores, and explanations.

Contact doctors (optional):
Use the in-app modal to view suggested specialist contacts.

Contributing
Bug reports, feature requests, new doctor templates, and clinical feedback are welcome!

Fork this repo, create a feature branch, push, and open a pull request.

License & Disclaimer
This platform is distributed under the MIT license for research and educational purposes only.
It is not certified for clinical use—final diagnosis and intervention must always be performed by a licensed medical professional.

References
CheXpert

TorchXRayVision

Grad-CAM Visual Explanations Paper

FastAPI

React

Seaborn

Matplotlib

Empowering ethical, explainable, and accessible radiology with AI.
