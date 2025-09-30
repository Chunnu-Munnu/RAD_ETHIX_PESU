import React from "react";

export default function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      <span className="progress-text">{progress}%</span>
    </div>
  );
}
