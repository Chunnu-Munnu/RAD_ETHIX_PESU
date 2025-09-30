import React from "react";

export default function FindingsGrid({ findings }) {
  return (
    <div className="findings-grid">
      {findings.map(finding => (
        <div className="feature-card" key={finding.disease}>
          <div className="feature-title">{finding.disease}</div>
          <div className="feature-desc">{finding.description}</div>
          <div>Confidence: {Math.round(finding.confidence * 100)}% | Severity: {finding.severity}</div>
        </div>
      ))}
    </div>
  );
}
