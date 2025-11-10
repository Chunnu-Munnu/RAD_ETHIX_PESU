// frontend/RAD_ETHIX_FRONTEND/src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import jagoMascot from "./assets/JAGO.jpg";

// ==================== AUTH COMPONENTS ====================
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState('landing'); // landing, login, signup
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    patient_id: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id: formData.patient_id })
      });

      if (!response.ok) throw new Error('Patient ID not found');
      const userData = await response.json();
      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender
        })
      });

      if (!response.ok) throw new Error('Signup failed');
      const userData = await response.json();
      onLogin(userData);
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'landing') {
    return (
      <div className="auth-container">
        <div className="auth-card card">
          <img src={jagoMascot} alt="RAD-ETHIX Mascot" className="auth-mascot" />
          <h1 className="auth-logo">🩻 RAD-ETHIX</h1>
          <p className="auth-tagline">Ethical AI for Chest X-ray Diagnosis</p>
          
          <div className="auth-buttons">
            <button className="btn btn-primary" onClick={() => setMode('login')}>
              🔐 Login
            </button>
            <button className="btn btn-outline" onClick={() => setMode('signup')}>
              👤 Sign Up
            </button>
          </div>

          <div className="demo-credentials">
            <p className="demo-title">Demo Credentials:</p>
            <p className="demo-text">Patient ID: PES1UG24CS053</p>
            <p className="demo-subtitle">(Amogh, 19, Male)</p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'login') {
    return (
      <div className="auth-container">
        <div className="auth-card card">
          <button className="back-btn" onClick={() => setMode('landing')}>← Back</button>
          <h2 className="form-title">Login</h2>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                value={formData.patient_id}
                onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                placeholder="PES1UG24CS053"
                required
                autoFocus
              />
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (mode === 'signup') {
    return (
      <div className="auth-container">
        <div className="auth-card card">
          <button className="back-btn" onClick={() => setMode('landing')}>← Back</button>
          <h2 className="form-title">Sign Up</h2>
          
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="25"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

// ==================== MAIN APP COMPONENTS ====================
function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Switch theme">
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

function PatientHeader({ user, onLogout }) {
  return (
    <div className="patient-header">
      <div className="header-left">
        <h1 className="header-logo">🩻 RAD-ETHIX</h1>
        <span className="header-subtitle">AI-Powered Radiology</span>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-id">ID: {user.patient_id}</span>
        </div>
        <button className="btn btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function PatientCard({ user }) {
  return (
    <div className="patient-card card">
      <h3>Patient Portfolio</h3>
      <div className="patient-info-grid">
        <div className="info-item">
          <span className="info-label">Name:</span>
          <span className="info-value">{user.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Age:</span>
          <span className="info-value">{user.age} years</span>
        </div>
        <div className="info-item">
          <span className="info-label">Gender:</span>
          <span className="info-value">{user.gender}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Patient ID:</span>
          <span className="info-value">{user.patient_id}</span>
        </div>
      </div>
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

function ImagePreview({ previewURL, heatmapURL, onRemove, onAnalyze, onGenerateReport }) {
  return (
    <div className="image-preview card">
      {previewURL && <img src={previewURL} alt="Preview" />}
      {heatmapURL && <img src={heatmapURL} className="heatmap-overlay" alt="Heatmap" />}
      <div className="preview-actions">
        <button className="btn btn-outline" onClick={onRemove}>Remove</button>
        <button className="btn btn-primary" onClick={onAnalyze}>Analyze X-ray</button>
        {heatmapURL && (
          <button className="btn btn-success" onClick={onGenerateReport}>
            📄 Generate Report
          </button>
        )}
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
          <div>
            Confidence: {Math.round(f.confidence * 100)}% | 
            Severity: {f.severity}
            {f.critical ? " (Critical)" : ""}
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultsSection({ results, previewURL, heatmapURL, onContactDoctors }) {
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

function MedicalReport({ user, findings, onClose }) {
  const [report, setReport] = useState(null);
  const [editedReport, setEditedReport] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: user.name,
          patient_id: user.patient_id,
          age: user.age,
          gender: user.gender,
          predictions: findings.map(f => ({
            disease: f.disease,
            confidence: f.confidence,
            severity: f.severity,
            description: f.description,
            critical: f.critical || false
          }))
        })
      });

      if (!response.ok) throw new Error('Failed to generate report');
      const reportData = await response.json();
      setReport(reportData);
      setEditedReport(reportData.report_text);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Medical Report</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Courier New', monospace; padding: 40px; line-height: 1.6; }
        .report-content { white-space: pre-wrap; }
        .citations { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="report-content">');
    printWindow.document.write(editedReport.replace(/\n/g, '<br>'));
    printWindow.document.write('</div>');
    
    if (report?.citations?.length > 0) {
      printWindow.document.write('<div class="citations"><h3>REFERENCES:</h3>');
      report.citations.forEach((citation, idx) => {
        printWindow.document.write(`<p>[${idx + 1}] ${citation}</p>`);
      });
      printWindow.document.write('</div>');
    }
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    let fileContent = editedReport + '\n\n';
    
    if (report?.citations?.length > 0) {
      fileContent += '=== REFERENCES ===\n\n';
      report.citations.forEach((citation, idx) => {
        fileContent += `[${idx + 1}] ${citation}\n`;
      });
    }
    
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${user.patient_id}_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="modal">
        <div className="modal-content card">
          <div className="report-loading">
            <div className="spinner"></div>
            <p>Generating medical report with AI analysis...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal">
      <div className="modal-content card report-modal">
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h3>📄 Medical Report</h3>

        <div className="predictions-summary">
          <h4>🔍 Analysis Results</h4>
          <div className="predictions-grid">
            {findings.map((pred, idx) => (
              <div key={idx} className="prediction-card">
                <div className="prediction-header">
                  <span className="prediction-name">{pred.disease}</span>
                  <span className={`prediction-confidence ${
                    pred.confidence > 0.7 ? 'high' : 
                    pred.confidence > 0.4 ? 'medium' : 'low'
                  }`}>
                    {(pred.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="report-actions">
          {!isEditing ? (
            <>
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                ✏️ Edit Report
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                🖨️ Print
              </button>
              <button className="btn btn-primary" onClick={handleDownload}>
                💾 Download
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-success" onClick={() => setIsEditing(false)}>
                ✅ Save Changes
              </button>
              <button className="btn btn-outline" onClick={() => {
                setEditedReport(report.report_text);
                setIsEditing(false);
              }}>
                ❌ Cancel
              </button>
            </>
          )}
        </div>

        <div className="report-container">
          {!isEditing ? (
            <pre className="report-display">{editedReport}</pre>
          ) : (
            <textarea
              className="report-editor"
              value={editedReport}
              onChange={(e) => setEditedReport(e.target.value)}
              rows={20}
            />
          )}
        </div>

        {report?.citations?.length > 0 && (
          <div className="citations-section">
            <h4>📚 Medical Literature References</h4>
            <div className="citations-list">
              {report.citations.map((citation, idx) => (
                <div key={idx} className="citation-item">
                  <span className="citation-number">[{idx + 1}]</span>
                  <span className="citation-text">{citation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="report-disclaimer">
          <h4>⚠️ Important Disclaimer</h4>
          <p>
            This report is generated by an AI-assisted diagnostic system and should be reviewed 
            by a licensed radiologist or physician before clinical use.
          </p>
        </div>
      </div>
    </div>
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

// ==================== MAIN APP ====================
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Check localStorage for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('radethix_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('radethix_user');
      }
    }
    setIsLoadingSession(false);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('radethix_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('radethix_user');
    // Reset all state
    setSelectedFile(null);
    setPreviewURL(null);
    setResults(null);
    setHeatmapURL(null);
  };

  // Theme management
  const [theme, setTheme] = useState(localStorage.getItem('theme-mode') || 'dark');
  useEffect(() => {
    localStorage.setItem('theme-mode', theme);
    document.body.className = `${theme}-mode`;
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  // File and analysis state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [results, setResults] = useState(null);
  const [heatmapURL, setHeatmapURL] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleFileSelect = file => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = e => setPreviewURL(e.target.result);
    reader.readAsDataURL(file);
    // Reset results when new file is selected
    setResults(null);
    setHeatmapURL(null);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewURL(null);
    setResults(null);
    setHeatmapURL(null);
    setProgress(0);
    setShowProgress(false);
  };

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

  // Loading screen
  if (isLoadingSession) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading RAD-ETHIX...</p>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Main application
  return (
    <div className="app-outer">
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <PatientHeader user={currentUser} onLogout={handleLogout} />
      <PatientCard user={currentUser} />
      
      {!selectedFile && <UploadArea onFileSelect={handleFileSelect} />}
      
      {selectedFile && (
        <ImagePreview 
          previewURL={previewURL} 
          heatmapURL={heatmapURL} 
          onRemove={handleRemove} 
          onAnalyze={handleAnalyze}
          onGenerateReport={() => setShowReport(true)}
        />
      )}
      
      {showProgress && <ProgressBar progress={progress} />}
      
      {results && (
        <ResultsSection
          results={results}
          previewURL={previewURL}
          heatmapURL={heatmapURL}
          onContactDoctors={() => setShowDoctors(true)}
        />
      )}
      
      {showReport && results && (
        <MedicalReport 
          user={currentUser}
          findings={results.findings}
          onClose={() => setShowReport(false)}
        />
      )}
      
      <DoctorsModal show={showDoctors} onClose={() => setShowDoctors(false)} />
      <Toast message={toastMsg} show={showToastMsg} />
    </div>
  );
}