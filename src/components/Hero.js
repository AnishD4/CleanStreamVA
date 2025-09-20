import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate('/map');
  };

  const handleReportClick = () => {
    navigate('/report');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Protecting Virginia's Waterways</h1>
        <p>
          Real-time monitoring and predictive alerts for harmful algal blooms 
          and water safety across Virginia's lakes, rivers, and reservoirs.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={handleMapClick}>
            View Water Map
          </button>
          <button className="btn btn-secondary" onClick={handleReportClick}>
            Report Water Issue
          </button>
        </div>
      </div>
      
      <div className="hero-stats">
        <div className="stat">
          <h3>150+</h3>
          <p>Virginia Water Bodies</p>
        </div>
        <div className="stat">
          <h3>8.8 M</h3>
          <p>Virginians being kept informed</p>
        </div>
        <div className="stat">
          <h3>24/7</h3>
          <p>Real-time Monitoring</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
