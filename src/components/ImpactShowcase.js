import React from 'react';

const ImpactShowcase = () => {
  return (
    <section className="impact-showcase">
      <div className="container">
        <h2>Real Impact, Real Protection</h2>
        <p className="section-subtitle">
          See how CleanStream VA is making a difference across Virginia's waterways
        </p>

        <div className="impact-grid">
          <div className="impact-card highlight">
            <div className="impact-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="impact-number">23</div>
            <div className="impact-label">Early Warnings Issued</div>
            <div className="impact-description">
              Preventing recreational exposure to harmful algal blooms this month
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="impact-number">1,247</div>
            <div className="impact-label">Community Reports</div>
            <div className="impact-description">
              Citizens helping monitor water quality across Virginia
            </div>
          </div>

          <div className="impact-card">
            <div className="impact-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="impact-number">72hr</div>
            <div className="impact-label">Advance Warning</div>
            <div className="impact-description">
              Average lead time for harmful algal bloom predictions
            </div>
          </div>
        </div>

        <div className="recent-alerts">
          <h3>Recent Water Quality Updates</h3>
          <div className="alert-feed">
            <div className="alert-item safe">
              <div className="alert-dot"></div>
              <div className="alert-content">
                <div className="alert-location">Smith Mountain Lake</div>
                <div className="alert-status">All Clear - Safe for Recreation</div>
                <div className="alert-time">2 hours ago</div>
              </div>
            </div>

            <div className="alert-item caution">
              <div className="alert-dot"></div>
              <div className="alert-content">
                <div className="alert-location">Lake Anna (North Shore)</div>
                <div className="alert-status">Caution - Monitor Conditions</div>
                <div className="alert-time">4 hours ago</div>
              </div>
            </div>

            <div className="alert-item warning">
              <div className="alert-dot"></div>
              <div className="alert-content">
                <div className="alert-location">Chesapeake Bay (Norfolk)</div>
                <div className="alert-status">Advisory - Avoid Water Contact</div>
                <div className="alert-time">6 hours ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="community-highlight">
          <div className="highlight-content">
            <h3>Community Powered Protection</h3>
            <p>
              Every report matters. When citizens like you share water observations,
              we can protect entire communities from harmful algal blooms and water quality issues.
            </p>
            <div className="highlight-stats">
              <div className="stat-item">
                <span className="stat-number">94%</span>
                <span className="stat-label">Accuracy Rate</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15min</span>
                <span className="stat-label">Avg Response Time</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">8.8M</span>
                <span className="stat-label">Virginians Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactShowcase;
