import React, { useState, useEffect } from 'react';
import { useReports } from '../context/ReportContext';
import { locationService } from '../services/locationService';

const LocationAlert = ({ onClose }) => {
  const { verifiedStatuses } = useReports();
  const [nearbyWaterBodies, setNearbyWaterBodies] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Virginia water bodies data
  const waterBodies = [
    {
      name: "Lake Anna",
      coords: [38.0833, -77.9167],
      type: "Lake",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Occoquan Reservoir",
      coords: [38.7500, -77.4167],
      type: "Reservoir",
      activities: ["Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Chickahominy River",
      coords: [37.4167, -77.2500],
      type: "River",
      activities: ["Fishing", "Kayaking", "Boating"]
    },
    {
      name: "James River",
      coords: [37.5333, -77.4333],
      type: "River",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking", "Tubing"]
    },
    {
      name: "Potomac River",
      coords: [38.8000, -77.0500],
      type: "River",
      activities: ["Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Shenandoah River",
      coords: [38.9167, -78.1833],
      type: "River",
      activities: ["Swimming", "Fishing", "Kayaking", "Tubing"]
    },
    {
      name: "Smith Mountain Lake",
      coords: [37.0833, -79.7500],
      type: "Lake",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Kerr Reservoir",
      coords: [36.5833, -78.5833],
      type: "Reservoir",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Claytor Lake",
      coords: [37.0833, -80.5833],
      type: "Lake",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"]
    },
    {
      name: "Lake Gaston",
      coords: [36.5833, -78.0833],
      type: "Lake",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"]
    }
  ];

  useEffect(() => {
    const checkNearbyWaterBodies = async () => {
      try {
        setLoading(true);
        const location = await locationService.getCurrentLocation();
        setUserLocation(location);
        
        const waterBodiesWithStatus = waterBodies.map(waterBody => ({
          ...waterBody,
          status: verifiedStatuses[waterBody.name] || 'safe'
        }));
        
        const nearby = locationService.findNearbyWaterBodies(
          waterBodiesWithStatus,
          location.lat,
          location.lng,
          5
        );
        
        setNearbyWaterBodies(nearby);
      } catch (err) {
        setError('Unable to get your location. Please enable location services.');
        console.error('Location error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkNearbyWaterBodies();
  }, [verifiedStatuses]);

  const getActivityRecommendations = (status) => {
    return locationService.getActivityRecommendations(status);
  };

  const getSafetyTips = (status) => {
    return locationService.getSafetyTips(status);
  };

  if (loading) {
    return (
      <div className="location-alert">
        <div className="location-alert-content">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Getting your location...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="location-alert">
        <div className="location-alert-content">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={onClose} className="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (nearbyWaterBodies.length === 0) {
    return (
      <div className="location-alert">
        <div className="location-alert-content">
          <div className="no-nearby-water">
            <i className="fas fa-map-marker-alt"></i>
            <h3>No Water Bodies Nearby</h3>
            <p>No water bodies found within 15 miles of your location.</p>
            <button onClick={onClose} className="btn btn-primary">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="location-alert">
      <div className="location-alert-content">
        <div className="location-alert-header">
          <h3>
            <i className="fas fa-map-marker-alt"></i>
            Water Bodies Near You
          </h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="nearby-water-list">
          {nearbyWaterBodies.map((waterBody, index) => {
            const activities = getActivityRecommendations(waterBody.status);
            const safetyTips = getSafetyTips(waterBody.status);
            
            return (
              <div key={index} className="water-body-card">
                <div className="water-body-header">
                  <h4>{waterBody.name}</h4>
                  <div className="water-body-info">
                    <span className="water-type">{waterBody.type}</span>
                    <span className="distance">{waterBody.distance.toFixed(1)} miles away</span>
                  </div>
                  <div className={`status-badge ${waterBody.status}`}>
                    {waterBody.status.charAt(0).toUpperCase() + waterBody.status.slice(1)}
                  </div>
                </div>
                
                <div className="activities-section">
                  <h5>Activities</h5>
                  <div className="activities-grid">
                    {Object.entries(activities).map(([activity, info]) => (
                      <div key={activity} className={`activity-item ${info.allowed ? 'allowed' : 'not-allowed'}`}>
                        <i className={`fas fa-${getActivityIcon(activity)}`}></i>
                        <span className="activity-name">{activity.charAt(0).toUpperCase() + activity.slice(1)}</span>
                        <span className="activity-status">
                          {info.allowed ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="safety-tips">
                  <h5>Safety Tips</h5>
                  <ul>
                    {safetyTips.map((tip, tipIndex) => (
                      <li key={tipIndex}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getActivityIcon = (activity) => {
  const icons = {
    swimming: 'swimmer',
    boating: 'ship',
    fishing: 'fish',
    kayaking: 'water',
    wading: 'walking',
    tubing: 'life-ring'
  };
  return icons[activity] || 'question';
};

export default LocationAlert;
