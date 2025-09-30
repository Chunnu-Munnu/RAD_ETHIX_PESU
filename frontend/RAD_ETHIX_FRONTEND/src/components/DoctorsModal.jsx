import React from "react";
const doctors = [
  // ... your doctor data as objects ...
];

export default function DoctorsModal({ show, onClose }) {
  if (!show) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>Specialist Doctors</h3>
        <div className="doctors-grid">
          {doctors.map(doc => (
            <div className="doctor-card" key={doc.phone}>
              <div>{doc.name} — {doc.speciality}</div>
              <div>{doc.desc}</div>
              <div>Phone: {doc.phone} | Fee: ₹{doc.fee}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
