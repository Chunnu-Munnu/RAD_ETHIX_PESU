import React from "react";
import FindingsGrid from "./FindingsGrid";

export default function ResultsSection({ results, onContactDoctors }) {
  const { confidence, diagnosis, heatmap, src, findings } = results;
  return (
    <section className="results-section">
      <img src={src} alt="X-ray" />
      <img src={heatmap} className="heatmap-overlay" alt="Heatmap" />
      <div className="analysis-info">
        <h3>AI Confidence: <span>{confidence}</span></h3>
        <h4>{diagnosis.title}</h4>
        <p>{diagnosis.description}</p>
      </div>
      <FindingsGrid findings={findings} />
      <button className="btn btn-primary" onClick={onContactDoctors}>
        Contact Doctors
      </button>
    </section>
  );
}
