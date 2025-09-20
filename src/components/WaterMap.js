import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useReports } from '../context/ReportContext';

const WaterMap = () => {
  const { verifiedStatuses } = useReports();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Virginia center coordinates
    const virginiaCenter = [37.5407, -78.6569];
    
    // Initialize the map
    const map = L.map(mapRef.current).setView(virginiaCenter, 7);
    mapInstanceRef.current = map;
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Virginia water bodies data with status
    const waterBodies = [
      {
        name: "Lake Anna",
        coords: [38.0833, -77.9167],
        status: verifiedStatuses["Lake Anna"] || "warning",
        description: "Elevated algae levels detected. Avoid swimming in North Anna Branch."
      },
      {
        name: "Occoquan Reservoir",
        coords: [38.7500, -77.4167],
        status: verifiedStatuses["Occoquan Reservoir"] || "caution",
        description: "PFAS levels above EPA limits. Monitor for updates."
      },
      {
        name: "Chickahominy River",
        coords: [37.4167, -77.2500],
        status: verifiedStatuses["Chickahominy River"] || "caution",
        description: "Moderate risk of algal bloom. Monitor conditions."
      },
      {
        name: "James River",
        coords: [37.5333, -77.4333],
        status: verifiedStatuses["James River"] || "safe",
        description: "Water quality within normal parameters."
      },
      {
        name: "Potomac River",
        coords: [38.8000, -77.0500],
        status: verifiedStatuses["Potomac River"] || "safe",
        description: "Clear conditions, safe for recreation."
      },
      {
        name: "Shenandoah River",
        coords: [38.9167, -78.1833],
        status: verifiedStatuses["Shenandoah River"] || "safe",
        description: "Excellent water quality conditions."
      },
      {
        name: "Smith Mountain Lake",
        coords: [37.0833, -79.7500],
        status: verifiedStatuses["Smith Mountain Lake"] || "caution",
        description: "Seasonal monitoring in progress."
      },
      {
        name: "Kerr Reservoir",
        coords: [36.5833, -78.5833],
        status: verifiedStatuses["Kerr Reservoir"] || "safe",
        description: "All clear for water activities."
      },
      {
        name: "Claytor Lake",
        coords: [37.0833, -80.5833],
        status: verifiedStatuses["Claytor Lake"] || "safe",
        description: "Good water quality maintained."
      },
      {
        name: "Lake Gaston",
        coords: [36.5833, -78.0833],
        status: verifiedStatuses["Lake Gaston"] || "warning",
        description: "Recent reports of algae presence. Use caution."
      }
    ];
    
    // Status colors
    const statusColors = {
      safe: '#27ae60',
      caution: '#f39c12',
      warning: '#e74c3c',
      unsafe: '#8e44ad'
    };
    
    // Status icons
    const statusIcons = {
      safe: 'fas fa-check-circle',
      caution: 'fas fa-exclamation-triangle',
      warning: 'fas fa-exclamation-circle',
      unsafe: 'fas fa-times-circle'
    };
    
    // Add markers for each water body
    waterBodies.forEach(waterBody => {
      const marker = L.circleMarker(waterBody.coords, {
        radius: 12,
        fillColor: statusColors[waterBody.status],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      // Add popup with information
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${waterBody.name}</h3>
          <p style="margin: 0 0 10px 0; color: #666;">${waterBody.description}</p>
          <div style="display: flex; align-items: center; gap: 5px;">
            <i class="${statusIcons[waterBody.status]}" style="color: ${statusColors[waterBody.status]};"></i>
            <span style="text-transform: capitalize; font-weight: 600; color: ${statusColors[waterBody.status]};">${waterBody.status}</span>
          </div>
        </div>
      `);
      
      // Add click event to marker
      marker.on('click', function() {
        console.log(`Clicked on ${waterBody.name}`);
      });
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="map-section">
      <div className="container">
        <h2>Virginia Water Quality Map</h2>
        <p>Interactive map showing current water safety status across Virginia's major waterways</p>
        <div className="map-container">
          <div ref={mapRef} style={{ height: '500px', width: '100%' }}></div>
          <div className="map-legend">
            <h4>Water Safety Status</h4>
            <div className="legend-item">
              <div className="status-indicator safe"></div>
              <span>Safe</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator caution"></div>
              <span>Caution</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator warning"></div>
              <span>Warning</span>
            </div>
            <div className="legend-item">
              <div className="status-indicator unsafe"></div>
              <span>Unsafe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterMap;
