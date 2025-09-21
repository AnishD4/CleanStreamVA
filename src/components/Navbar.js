import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLocationAlert, onSearchDirections }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <i className="fas fa-water"></i>
          <span>CleanStream VA</span>
        </Link>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/map" onClick={closeMenu}> Map</Link></li>
          <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/information" onClick={closeMenu}>Information</Link></li>
          <li><Link to="/cleaning-parties" onClick={closeMenu}>Community</Link></li>
          <li><Link to="/report" onClick={closeMenu}>Report</Link></li>
          <li><Link to="/wolfram-insights" onClick={closeMenu} className="wolfram-nav-link">
            <i className="fas fa-brain"></i> Wolfram Insights
          </Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        </ul>

        <div className="nav-actions">
          <button 
            className="nav-btn" 
            onClick={onLocationAlert}
            title="Find nearby water bodies"
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Near Me</span>
          </button>
          <button 
            className="nav-btn" 
            onClick={onSearchDirections}
            title="Search and get directions"
          >
            <i className="fas fa-search"></i>
            <span>Search</span>
          </button>
        </div>
        
        <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
