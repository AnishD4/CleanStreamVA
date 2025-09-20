import React from 'react';

const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <h2>About CleanStream VA</h2>
        <div className="about-content">
          <div className="about-text">
            <h3>Protecting Virginia's Waterways</h3>
            <p>
              CleanStream VA is a citizen-science platform that combines real-time monitoring, 
              predictive modeling, and community reporting to protect Virginia's waterways from 
              harmful algal blooms and water quality issues.
            </p>
            
            <h4>Our Mission</h4>
            <p>
              To provide early warning systems and real-time data to help protect public health, 
              support recreational users, and assist local governments in managing water quality 
              across Virginia's lakes, rivers, and reservoirs.
            </p>
            
            <h4>How It Works</h4>
            <ul>
              <li>
                <strong>Data Integration:</strong> We combine satellite imagery, weather data, 
                and state agency reports
              </li>
              <li>
                <strong>Predictive Modeling:</strong> Machine learning algorithms predict bloom 
                risk 3-7 days in advance
              </li>
              <li>
                <strong>Community Reporting:</strong> Citizens can report water conditions with 
                photos and GPS
              </li>
              <li>
                <strong>Real-time Alerts:</strong> SMS and email notifications for specific 
                water bodies
              </li>
            </ul>

            <h4>Key Features</h4>
            <ul>
              <li>Interactive water quality map with real-time status updates</li>
              <li>Predictive bloom risk assessment based on weather and historical data</li>
              <li>Citizen reporting system with photo upload capabilities</li>
              <li>Mobile-responsive design for on-the-go reporting</li>
              <li>Educational resources about water safety and algal blooms</li>
              <li>Integration with Virginia DEQ and Department of Health data</li>
            </ul>

            <h4>Impact</h4>
            <p>
              CleanStream VA helps protect nearly 1 million people by providing early warnings 
              about unsafe water conditions, supporting recreational users, and assisting local 
              governments in managing water quality across Virginia's waterways.
            </p>
          </div>
          
          <div className="about-stats">
            <div className="stat-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Public Health</h3>
              <p>Protecting nearly 1 million people from unsafe water conditions</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-users"></i>
              <h3>Community</h3>
              <p>Empowering citizens to participate in water quality monitoring</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-chart-line"></i>
              <h3>Prediction</h3>
              <p>Advanced modeling for early warning and prevention</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-map-marked-alt"></i>
              <h3>Coverage</h3>
              <p>Monitoring 47+ water bodies across Virginia</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-mobile-alt"></i>
              <h3>Accessibility</h3>
              <p>Mobile-friendly platform for easy reporting</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Education</h3>
              <p>Raising awareness about water safety and conservation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
