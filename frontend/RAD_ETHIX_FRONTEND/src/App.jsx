import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import jagoMascot from "./assets/JAGO.jpg"; // Make sure JAGO.jpg is in src/assets

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Switch theme">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

function MascotCard() {
  return (
    <div className="mascot-card card">
      <img src={jagoMascot} alt="Jago Mascot" className="mascot-img" />
      <div className="mascot-title">RAD-ETHIX</div>
      <div className="mascot-subtitle">Radiology — The Ethical Way</div>
    </div>
  );
}

function UploadArea({ onFileSelect }) {
  const fileInputRef = useRef();
  return (
    <div
      className="upload-area card"
      onClick={() => fileInputRef.current.click()}
      tabIndex={0}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*,.dcm"
        onChange={e => e.target.files[0] && onFileSelect(e.target.files[0])}
      />
      <span className="upload-icon">📤</span>
      <h3>Click or drag to upload</h3>
      <p>JPG, PNG, DICOM (confidential)</p>
    </div>
  );
}

function ImagePreview({ previewURL, heatmapURL, onRemove, onAnalyze }) {
  return (
    <div className="image-preview card">
      {previewURL && <img src={previewURL} alt="Preview" />}
      {heatmapURL && <img src={heatmapURL} className="heatmap-overlay" alt="Heatmap" />}
      <div className="preview-actions">
        <button className="btn btn-outline" onClick={onRemove}>Remove</button>
        <button className="btn btn-primary" onClick={onAnalyze}>Analyze X-ray</button>
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress-bar card">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
      <span className="progress-text">{progress}%</span>
    </div>
  );
}

function FindingsGrid({ findings }) {
  return (
    <div className="features-grid">
      {findings.map(f => (
        <div className="feature-card card" key={f.disease}>
          <div className="feature-title">{f.disease}</div>
          <div className="feature-desc">{f.description}</div>
          <div>Confidence: {Math.round(f.confidence * 100)}% | Severity: {f.severity}{f.critical ? " (Critical)" : ""}</div>
        </div>
      ))}
    </div>
  );
}

function ResultsSection({ results, previewURL, heatmapURL, onContactDoctors }) {
  // Gather diagnosis names, join with comma for title
  const findingNames = results?.findings?.map(f => f.disease) || [];
  const diagnosisTitle = findingNames.length
    ? `Findings: ${findingNames.join(", ")}`
    : "No findings";

  return (
    <section className="results-section card">
      <h3>AI Analysis</h3>
      <img src={previewURL} alt="Input X-ray" />
      {heatmapURL && <img src={heatmapURL} className="heatmap-overlay" alt="Heatmap" />}
      <div className="diagnosis-result">
        <h3>{diagnosisTitle}</h3>
        <p>
          {results?.findings?.length === 0
            ? "No significant findings detected."
            : results.findings.map(f =>
                `${f.disease}: ${f.description}${f.critical ? " (Critical)" : ""}`
              ).join('\n')}
        </p>
      </div>
      <div className="confidence-score">
        AI Confidence: <span className="confidence-value">{results?.confidenceValue}</span>
      </div>
      <FindingsGrid findings={results?.findings || []} />
      <button className="btn btn-primary" onClick={onContactDoctors}>
        Contact Doctors
      </button>
    </section>
  );
}

const doctors = [
  { name: "Dr. Siddharth Rao", speciality: "Pulmonology", desc: "Chest & respiratory specialist", phone: "+91-9022000110", fee: 400 },
  { name: "Dr. Leela Priya Kumar", speciality: "Radiology", desc: "Senior X-ray/Imaging consultant", phone: "+91-9099700512", fee: 350 },
  { name: "Dr. Rajat Agrawal", speciality: "General Physician", desc: "Internal Medicine, Diagnosis", phone: "+91-8866800124", fee: 300 },
  { name: "Dr. Reshma Suresh", speciality: "Cardiology", desc: "Heart & chest expert", phone: "+91-9977700566", fee: 700 }
];

function DoctorsModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="modal">
      <div className="modal-content card">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>PES University Doctors</h3>
        <div className="doctors-grid">
          {doctors.map(doc => (
            <div key={doc.phone} className="doctor-card">
              <div className="doctor-title">{doc.name} — {doc.speciality}</div>
              <div className="doctor-desc">{doc.desc}</div>
              <div className="doctor-contact">
                Phone: {doc.phone}<br />
                Fee: ₹{doc.fee}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, show }) {
  return (
    <div className={`toast${show ? " show" : ""}`}>
      {message}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme-mode') || 'dark');
  useEffect(() => {
    localStorage.setItem('theme-mode', theme);
    document.body.className = `${theme}-mode`;
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const handleFileSelect = file => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreviewURL(e.target.result);
    reader.readAsDataURL(file);
  };
  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setResults(null);
    setHeatmapURL(null);
    setProgress(0);
    setShowProgress(false);
  };
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [results, setResults] = useState(null);
  const [heatmapURL, setHeatmapURL] = useState(null);

  // Backend API handler
  const handleAnalyze = async () => {
    if (!selectedFile) return showToast("Please select an image first.");
    setShowProgress(true);
    setProgress(20);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const apiURL = 'http://localhost:8000/predict';
      const resp = await fetch(apiURL, {
        method: 'POST',
        body: formData,
      });
      setProgress(70);
      if (!resp.ok) throw new Error("Analysis failed.");
      const result = await resp.json();
      setShowProgress(false);
      setProgress(100);
      setHeatmapURL(result.combined_heatmap ? 'data:image/png;base64,' + result.combined_heatmap : null);

      // Show all findings in results.
      setResults({
        confidenceValue: Math.round(result.confidence_metrics.overall_confidence * 100) + '%',
        findings: result.findings || []
      });
      showToast("Analysis complete.");
    } catch (e) {
      setShowProgress(false);
      showToast("AI backend request failed.");
      console.error(e);
    }
  };

  // Doctors/toast
  const [showDoctors, setShowDoctors] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToastMsg, setShowToastMsg] = useState(false);
  const showToast = msg => { setToastMsg(msg); setShowToastMsg(true); };
  useEffect(() => {
    if (showToastMsg) {
      const timer = setTimeout(() => setShowToastMsg(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToastMsg]);

  return (
    <div className="app-outer">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <MascotCard />
      {!selectedFile && <UploadArea onFileSelect={handleFileSelect} />}
      {selectedFile && <ImagePreview previewURL={previewURL} heatmapURL={heatmapURL} onRemove={handleRemove} onAnalyze={handleAnalyze} />}
      {showProgress && <ProgressBar progress={progress} />}
      {results && (
        <ResultsSection
          results={results}
          previewURL={previewURL}
          heatmapURL={heatmapURL}
          onContactDoctors={() => setShowDoctors(true)}
        />
      )}
      <DoctorsModal show={showDoctors} onClose={() => setShowDoctors(false)} />
      <Toast message={toastMsg} show={showToastMsg} />
    </div>
  );
}
