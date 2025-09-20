import React, { useState, useEffect } from 'react';
import { useReports } from '../context/ReportContext';
import { locationService } from '../services/locationService';

const SearchAndDirections = ({ onClose }) => {
  const { verifiedStatuses } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedWaterBody, setSelectedWaterBody] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);

  // Virginia water bodies data
  const waterBodies = [
    {
      name: "Lake Anna",
      coords: [38.0833, -77.9167],
      type: "Lake",
      address: "Lake Anna, Spotsylvania County, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"],
      description: "A large reservoir popular for recreational activities and fishing."
    },
    {
      name: "Occoquan Reservoir",
      coords: [38.7500, -77.4167],
      type: "Reservoir",
      address: "Occoquan Reservoir, Fairfax County, VA",
      activities: ["Boating", "Fishing", "Kayaking"],
      description: "A major water supply reservoir with recreational opportunities."
    },
    {
      name: "Chickahominy River",
      coords: [37.4167, -77.2500],
      type: "River",
      address: "Chickahominy River, James City County, VA",
      activities: ["Fishing", "Kayaking", "Boating"],
      description: "A scenic river perfect for fishing and paddling."
    },
    {
      name: "James River",
      coords: [37.5333, -77.4333],
      type: "River",
      address: "James River, Richmond, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking", "Tubing"],
      description: "Virginia's largest river with diverse recreational opportunities."
    },
    {
      name: "Potomac River",
      coords: [38.8000, -77.0500],
      type: "River",
      address: "Potomac River, Northern Virginia",
      activities: ["Boating", "Fishing", "Kayaking"],
      description: "A major river forming the border between Virginia and Maryland."
    },
    {
      name: "Shenandoah River",
      coords: [38.9167, -78.1833],
      type: "River",
      address: "Shenandoah River, Shenandoah Valley, VA",
      activities: ["Swimming", "Fishing", "Kayaking", "Tubing"],
      description: "A beautiful mountain river known for its scenic beauty."
    },
    {
      name: "Smith Mountain Lake",
      coords: [37.0833, -79.7500],
      type: "Lake",
      address: "Smith Mountain Lake, Franklin County, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"],
      description: "A large lake popular for water sports and fishing."
    },
    {
      name: "Kerr Reservoir",
      coords: [36.5833, -78.5833],
      type: "Reservoir",
      address: "Kerr Reservoir, Mecklenburg County, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"],
      description: "A large reservoir with excellent fishing and boating opportunities."
    },
    {
      name: "Claytor Lake",
      coords: [37.0833, -80.5833],
      type: "Lake",
      address: "Claytor Lake, Pulaski County, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"],
      description: "A scenic lake surrounded by mountains."
    },
    {
      name: "Lake Gaston",
      coords: [36.5833, -78.0833],
      type: "Lake",
      address: "Lake Gaston, Brunswick County, VA",
      activities: ["Swimming", "Boating", "Fishing", "Kayaking"],
      description: "A large lake popular for fishing and water recreation."
    }
  ];

  useEffect(() => {
    // Get user location for directions
    const getUserLocation = async () => {
      try {
        const location = await locationService.getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.error('Could not get user location:', error);
      }
    };
    getUserLocation();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = waterBodies
      .map(waterBody => ({
        ...waterBody,
        status: verifiedStatuses[waterBody.name] || 'safe'
      }))
      .filter(waterBody => 
        waterBody.name.toLowerCase().includes(term.toLowerCase()) ||
        waterBody.type.toLowerCase().includes(term.toLowerCase()) ||
        waterBody.address.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results

    setSearchResults(results);
  };

  const handleWaterBodySelect = (waterBody) => {
    setSelectedWaterBody(waterBody);
    setSearchResults([]);
    setSearchTerm(waterBody.name);
  };

  const getDirections = async () => {
    if (!selectedWaterBody || !userLocation) return;

    setLoading(true);
    try {
      // Calculate distance and direction
      const distance = locationService.calculateDistance(
        userLocation.lat,
        userLocation.lng,
        selectedWaterBody.coords[0],
        selectedWaterBody.coords[1]
      );

      const directions = {
        distance: distance,
        estimatedTime: Math.round(distance * 2), // Rough estimate: 2 minutes per mile
        destination: selectedWaterBody,
        userLocation: userLocation
      };

      setDirections(directions);
    } catch (error) {
      console.error('Error calculating directions:', error);
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (!selectedWaterBody) return;
    
    const { coords, name } = selectedWaterBody;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  const getActivityRecommendations = (status) => {
    return locationService.getActivityRecommendations(status);
  };

  const getSafetyTips = (status) => {
    return locationService.getSafetyTips(status);
  };

  return (
    <div className="search-directions-modal">
      <div className="search-directions-content">
        <div className="search-directions-header">
          <h3>
            <i className="fas fa-search"></i>
            Search & Directions
          </h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="search-section">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search water bodies..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((waterBody, index) => (
                <div
                  key={index}
                  className="search-result-item"
                  onClick={() => handleWaterBodySelect(waterBody)}
                >
                  <div className="result-info">
                    <h4>{waterBody.name}</h4>
                    <p>{waterBody.type} • {waterBody.address}</p>
                  </div>
                  <div className={`status-badge ${waterBody.status}`}>
                    {waterBody.status.charAt(0).toUpperCase() + waterBody.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedWaterBody && (
          <div className="water-body-details">
            <div className="water-body-header">
              <h4>{selectedWaterBody.name}</h4>
              <div className={`status-badge ${selectedWaterBody.status}`}>
                {selectedWaterBody.status.charAt(0).toUpperCase() + selectedWaterBody.status.slice(1)}
              </div>
            </div>

            <div className="water-body-info">
              <p><strong>Type:</strong> {selectedWaterBody.type}</p>
              <p><strong>Address:</strong> {selectedWaterBody.address}</p>
              <p><strong>Description:</strong> {selectedWaterBody.description}</p>
            </div>

            <div className="activities-section">
              <h5>Activities</h5>
              <div className="activities-grid">
                {Object.entries(getActivityRecommendations(selectedWaterBody.status)).map(([activity, info]) => (
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
                {getSafetyTips(selectedWaterBody.status).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>

            {userLocation && (
              <div className="directions-section">
                <h5>Directions</h5>
                <button 
                  onClick={getDirections} 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Calculating...' : 'Get Directions'}
                </button>
                
                {directions && (
                  <div className="directions-info">
                    <p><strong>Distance:</strong> {directions.distance.toFixed(1)} miles</p>
                    <p><strong>Estimated Time:</strong> {directions.estimatedTime} minutes</p>
                    <button onClick={openInMaps} className="btn btn-secondary">
                      <i className="fas fa-external-link-alt"></i>
                      Open in Maps
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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

export default SearchAndDirections;
