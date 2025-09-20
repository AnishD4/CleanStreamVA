import React from 'react';
import { useReports } from '../context/ReportContext';

const VerificationInfo = () => {
  const { VERIFICATION_THRESHOLDS } = useReports();

  return (
    <div className="verification-info">
      <h4>Report Verification System</h4>
      <p>Reports are verified based on community consensus within a 24-hour window:</p>
      <div className="verification-thresholds">
        <div className="threshold-item">
          <div className="status-indicator safe"></div>
          <span><strong>Safe:</strong> {VERIFICATION_THRESHOLDS.safe} reports needed</span>
        </div>
        <div className="threshold-item">
          <div className="status-indicator caution"></div>
          <span><strong>Caution:</strong> {VERIFICATION_THRESHOLDS.caution} reports needed</span>
        </div>
        <div className="threshold-item">
          <div className="status-indicator warning"></div>
          <span><strong>Warning:</strong> {VERIFICATION_THRESHOLDS.warning} reports needed</span>
        </div>
        <div className="threshold-item">
          <div className="status-indicator unsafe"></div>
          <span><strong>Unsafe:</strong> {VERIFICATION_THRESHOLDS.unsafe} report needed (safety first)</span>
        </div>
      </div>
      <p className="verification-note">
        <i className="fas fa-info-circle"></i>
        Reports older than 24 hours are not counted toward verification.
      </p>
    </div>
  );
};

export default VerificationInfo;
