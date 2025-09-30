import React, { useRef } from "react";

export default function UploadArea({ onFileSelect }) {
  const fileInput = useRef();

  const handleFileInput = evt => {
    const file = evt.target.files[0];
    if (file) onFileSelect(file);
  };
  return (
    <div className="upload-area" onClick={() => fileInput.current.click()}>
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        accept="image/*,.dcm"
        onChange={handleFileInput}
      />
      <span className="upload-icon">📤</span>
      <p>Click or drag to upload a chest X-ray (JPG, PNG, DICOM)</p>
    </div>
  );
}
