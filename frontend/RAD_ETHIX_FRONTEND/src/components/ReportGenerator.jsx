// frontend/RAD_ETHIX_FRONTEND/src/components/ReportGenerator.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/ReportGenerator.css';

const API_BASE = 'http://localhost:8000';

function ReportGenerator({ user, analysisResults }) {
  const [report, setReport] = useState(null);
  const [editedReport, setEditedReport] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  useEffect(() => {
    generateReport();
  }, [analysisResults]);

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: user.name,
          patient_id: user.patient_id,
          age: user.age,
          gender: user.gender,
          predictions: analysisResults.predictions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const reportData = await response.json();
      setReport(reportData);
      setEditedReport(reportData.report_text);
    } catch (err) {
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Update the report text
    setReport({
      ...report,
      report_text: editedReport
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedReport(report.report_text);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Medical Report</title>');
    printWindow.document.write(`
      <style>
        body { font-family: 'Courier New', monospace; padding: 40px; line-height: 1.6; }
        h1 { border-bottom: 2px solid #000; padding-bottom: 10px; }
        .report-content { white-space: pre-wrap; }
        .citations { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
        .citation-item { margin: 10px 0; font-size: 12px; }
        @media print {
          body { padding: 20px; }
        }
      </style>
    `);
    printWindow.document.write('</head><body>');
    printWindow.document.write('<div class="report-content">');
    printWindow.document.write(editedReport.replace(/\n/g, '<br>'));
    printWindow.document.write('</div>');
    
    if (report.citations && report.citations.length > 0) {
      printWindow.document.write('<div class="citations">');
      printWindow.document.write('<h3>REFERENCES:</h3>');
      report.citations.forEach((citation, idx) => {
        printWindow.document.write(`<div class="citation-item">[${idx + 1}] ${citation}</div>`);
      });
      printWindow.document.write('</div>');
    }
    
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const fileContent = editedReport + '\n\n' + formatCitations();
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${user.patient_id}_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatCitations = () => {
    if (!report || !report.citations || report.citations.length === 0) {
      return '';
    }

    let citationsText = '\n\n=== REFERENCES ===\n\n';
    report.citations.forEach((citation, idx) => {
      citationsText += `[${idx + 1}] ${citation}\n`;
    });
    return citationsText;
  };

  if (loading) {
    return (
      <div className="report-loading">
        <div className="spinner"></div>
        <p>Generating medical report with AI analysis...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="report-error">
        <p>Failed to generate report. Please try again.</p>
        <button className="btn btn-primary" onClick={generateReport}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="report-generator">
      {/* Predictions Summary */}
      {/* Predictions Summary */}
<div className="predictions-summary">
  <h3>🔍 Analysis Results</h3>
  <div className="predictions-grid">
    {analysisResults.predictions.map((pred, idx) => (
      <div key={idx} className="prediction-card">
        <div className="prediction-header">
          <span className="prediction-name">{pred.pathology || pred.disease}</span>
          <span className={`prediction-confidence ${
            pred.confidence > 0.7 ? 'high' : 
            pred.confidence > 0.4 ? 'medium' : 'low'
          }`}>
            {(pred.confidence * 100).toFixed(1)}%
          </span>
        </div>

        {/* Location / Description */}
        {pred.location_description && (
          <p className="prediction-location">{pred.location_description}</p>
        )}

        {/* Model breakdown */}
        {pred.model_breakdown && (
          <div className="model-breakdown">
            <p className="model-header">Model Confidence:</p>
            <ul>
              <li>🧬 DenseNet121: {(pred.model_breakdown.densenet121 * 100).toFixed(1)}%</li>
              <li>🧠 ResNet50: {(pred.model_breakdown.resnet50 * 100).toFixed(1)}%</li>
              <li>⚙️ EfficientNet: {(pred.model_breakdown.efficientnet * 100).toFixed(1)}%</li>
            </ul>
          </div>
        )}

        {/* Agreement score */}
        {pred.agreement && (
          <p className="agreement-score">
            🤝 Model Agreement: {(pred.agreement * 100).toFixed(1)}%
          </p>
        )}
      </div>
    ))}
  </div>
</div>


      {/* Action Buttons */}
      <div className="report-actions">
        {!isEditing ? (
          <>
            <button className="btn btn-secondary" onClick={handleEdit}>
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
            <button className="btn btn-success" onClick={handleSave}>
              ✅ Save Changes
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              ❌ Cancel
            </button>
          </>
        )}
      </div>

      {/* Report Content */}
      <div className="report-container" ref={reportRef}>
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

      {/* Citations */}
      {report.citations && report.citations.length > 0 && (
        <div className="citations-section">
          <h3>📚 Medical Literature References</h3>
          <div className="citations-list">
            {report.citations.map((citation, idx) => (
              <div key={idx} className="citation-item">
                <span className="citation-number">[{idx + 1}]</span>
                <span className="citation-text">{citation}</span>
              </div>
            ))}
          </div>
          <p className="citations-note">
            These references were retrieved from the medical knowledge base and support the findings in this report.
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="report-disclaimer">
        <h4>⚠️ Important Disclaimer</h4>
        <p>
          This report is generated by an AI-assisted diagnostic system and should be reviewed by a licensed radiologist or physician before clinical use. The findings, confidence scores, and recommendations are supplementary to clinical judgment and should not replace professional medical evaluation.
        </p>
      </div>
    </div>
  );
}

export default ReportGenerator;