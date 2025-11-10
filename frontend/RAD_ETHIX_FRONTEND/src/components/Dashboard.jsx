// frontend/RAD_ETHIX_FRONTEND/src/components/Dashboard.jsx
import React, { useState } from 'react';
import XRayAnalyzer from './XRayAnalyzer';
import ReportGenerator from './ReportGenerator';
import '../styles/Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('analyze'); // analyze, report
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setActiveTab('report');
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-logo">🩻 RAD-ETHIX</h1>
          <span className="dashboard-subtitle">AI-Powered Radiology</span>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-id">ID: {user.patient_id}</span>
            </div>
          </div>
          <button className="btn btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Patient Info Card */}
      <div className="patient-card">
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

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          📤 Upload & Analyze
        </button>
        <button
          className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
          disabled={!analysisResults}
        >
          📄 Medical Report
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'analyze' && (
          <XRayAnalyzer
            user={user}
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {activeTab === 'report' && analysisResults && (
          <ReportGenerator
            user={user}
            analysisResults={analysisResults}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;