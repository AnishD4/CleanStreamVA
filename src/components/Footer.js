import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CleanStream VA</h3>
            <p>Protecting Virginia's waterways through technology and community engagement.</p>
            <div style={{ marginTop: '1rem' }}>
              <i className="fas fa-envelope" style={{ marginRight: '10px' }}></i>
              <span>contact@cleanstreamva.org</span>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <i className="fas fa-phone" style={{ marginRight: '10px' }}></i>
              <span>(555) 123-4567</span>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/map">Water Map</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/report">Report Issue</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Water Safety Guidelines</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Algal Bloom Information</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Virginia DEQ Data</a></li>
              <li><a href="#" target="_blank" rel="noopener noreferrer">Emergency Contacts</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#bdc3c7', fontSize: '1.5rem' }}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#bdc3c7', fontSize: '1.5rem' }}>
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#bdc3c7', fontSize: '1.5rem' }}>
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: '#bdc3c7', fontSize: '1.5rem' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 CleanStream VA. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Built with React for the Virginia Environmental Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
