import React, { useState, useEffect } from 'react';
import { useReports } from '../context/ReportContext';

const Dashboard = () => {
  const { reports, verifiedStatuses, getVerificationStatus } = useReports();
  const [weatherData, setWeatherData] = useState({
    temperature: 78,
    rainfall: 0.2,
    windSpeed: 5
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateWeatherData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateWeatherData = () => {
    // Simulate weather data updates
    const temperature = Math.floor(Math.random() * 10) + 75; // 75-85°F
    const rainfall = (Math.random() * 0.5).toFixed(1); // 0-0.5 inches
    const windSpeed = Math.floor(Math.random() * 10) + 3; // 3-13 mph
    
    setWeatherData({
      temperature,
      rainfall: parseFloat(rainfall),
      windSpeed
    });
  };

  // Helper function to format time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const reportTime = new Date(timestamp);
    const diffInHours = Math.floor((now - reportTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  const getBloomRisk = () => {
    const { temperature, rainfall, windSpeed } = weatherData;
    let riskLevel = 'low';
    let riskPercentage = 25;
    
    if (temperature > 80 && rainfall > 0.3) {
      riskLevel = 'high';
      riskPercentage = 75;
    } else if (temperature > 78 || rainfall > 0.2) {
      riskLevel = 'medium';
      riskPercentage = 50;
    }
    
    if (windSpeed > 10) {
      riskPercentage = Math.max(25, riskPercentage - 15); // Wind helps reduce risk
    }
    
    return { riskLevel, riskPercentage };
  };

  const { riskLevel, riskPercentage } = getBloomRisk();

  return (
    <section className="dashboard-section">
      <div className="container">
        <h2>Water Quality Dashboard</h2>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Current Alerts</h3>
            <div className="alert-list">
              <div className="alert-item warning">
                <i className="fas fa-exclamation-triangle"></i>
                <div>
                  <strong>Lake Anna - North Anna Branch</strong>
                  <p>Elevated algae levels detected. Avoid swimming.</p>
                </div>
              </div>
              <div className="alert-item caution">
                <i className="fas fa-info-circle"></i>
                <div>
                  <strong>Chickahominy River</strong>
                  <p>Moderate risk of algal bloom. Monitor conditions.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3>Recent Reports</h3>
            <div className="reports-list">
              {reports.slice(0, 5).map(report => {
                const verificationStatus = getVerificationStatus(report.location);
                return (
                  <div key={report.id} className="report-item">
                    <div className="report-header">
                      <span className="report-location">{report.location}</span>
                      <span className="report-time">{getTimeAgo(report.timestamp)}</span>
                    </div>
                    <p>{report.description || report.waterCondition}</p>
                    <div className="report-status-container">
                      <div className={`report-status ${report.status}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </div>
                      {!verificationStatus.isVerified && (
                        <div className="verification-status">
                          <i className="fas fa-clock"></i>
                          <span>{verificationStatus.totalReports}/{verificationStatus.neededReports} reports</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Weather Impact</h3>
            <div className="weather-info">
              <div className="weather-item">
                <i className="fas fa-thermometer-half"></i>
                <span>Temperature: {weatherData.temperature}°F</span>
              </div>
              <div className="weather-item">
                <i className="fas fa-cloud-rain"></i>
                <span>Rainfall: {weatherData.rainfall}" (24h)</span>
              </div>
              <div className="weather-item">
                <i className="fas fa-wind"></i>
                <span>Wind: {weatherData.windSpeed} mph SW</span>
              </div>
            </div>
            <div className="bloom-risk">
              <h4>Bloom Risk Level</h4>
              <div className="risk-meter">
                <div className="risk-bar">
                  <div 
                    className={`risk-fill ${riskLevel}`}
                    style={{ width: `${riskPercentage}%` }}
                  ></div>
                </div>
                <span>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
