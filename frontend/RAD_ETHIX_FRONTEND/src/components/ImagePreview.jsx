import React from "react";

export default function ImagePreview({ imgSrc, heatmapSrc, onRemove, onAnalyze, canAnalyze }) {
  return (
    <div className="image-preview">
      <img src={imgSrc} alt="Preview" />
      {heatmapSrc && <img src={heatmapSrc} className="heatmap-overlay" alt="Heatmap" />}
      <div className="preview-actions">
        <button onClick={onRemove} className="btn btn-outline">Remove</button>
        <button onClick={onAnalyze} className="btn btn-primary" disabled={!canAnalyze}>Analyze X-ray</button>
      </div>
    </div>
  );
}
