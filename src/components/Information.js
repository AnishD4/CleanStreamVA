import React, { useState } from 'react';

const Information = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fas fa-info-circle' },
    { id: 'algal-blooms', label: 'Algal Blooms', icon: 'fas fa-exclamation-triangle' },
    { id: 'water-safety', label: 'Water Safety', icon: 'fas fa-shield-alt' },
    { id: 'prevention', label: 'Prevention', icon: 'fas fa-leaf' },
    { id: 'resources', label: 'Resources', icon: 'fas fa-book' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="info-content">
            <h2> Water Quality Monitoring in Virginia</h2>
            <p>
              Virginia's waterways are vital to our ecosystem, economy, and quality of life. 
              However, they face increasing threats from harmful algal blooms, pollution, and 
              climate change. CleanStream VA provides real-time monitoring and community 
              engagement to protect these precious resources.
            </p>
            
            <div className="info-grid">
              <div className="info-card">
                <i className="fas fa-water"></i>
                <h3>47+ Water Bodies</h3>
                <p>Monitored across Virginia including lakes, rivers, and reservoirs</p>
              </div>
              <div className="info-card">
                <i className="fas fa-users"></i>
                <h3>Community Driven</h3>
                <p>Citizen scientists report water conditions in real-time</p>
              </div>
              <div className="info-card">
                <i className="fas fa-chart-line"></i>
                <h3>Predictive Analytics</h3>
                <p>AI-powered predictions help prevent harmful blooms</p>
              </div>
              <div className="info-card">
                <i className="fas fa-mobile-alt"></i>
                <h3>Mobile First</h3>
                <p>Access information and report issues from anywhere</p>
              </div>
            </div>

            <div className="highlight-box">
              <h3> Our Mission</h3>
              <p>
                To protect Virginia's waterways through technology, community engagement, 
                and real-time monitoring, ensuring safe water for recreation, wildlife, 
                and future generations.
              </p>
            </div>
          </div>
        );

      case 'algal-blooms':
        return (
          <div className="info-content">
            <h2> Understanding Harmful Algal Blooms (HABs)</h2>
            
            <div className="info-section">
              <h3>What are Algal Blooms?</h3>
              <p>
                Algal blooms occur when algae grow rapidly and accumulate in water bodies. 
                While some blooms are harmless, others produce toxins that can be dangerous 
                to humans, animals, and aquatic life.
              </p>
            </div>

            <div className="info-section">
              <h3>Common Types in Virginia</h3>
              <div className="bloom-types">
                <div className="bloom-type">
                  <h4> Blue-Green Algae (Cyanobacteria)</h4>
                  <p>Most common and potentially toxic. Can cause skin irritation, nausea, and liver damage.</p>
                </div>
                <div className="bloom-type">
                  <h4> Green Algae</h4>
                  <p>Generally less harmful but can indicate nutrient pollution and oxygen depletion.</p>
                </div>
                <div className="bloom-type">
                  <h4> Golden Algae</h4>
                  <p>Can produce toxins harmful to fish and other aquatic life.</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Warning Signs</h3>
              <ul className="warning-signs">
                <li>Water appears green, blue-green, or brown</li>
                <li>Thick, paint-like scum on water surface</li>
                <li>Foul odor (earthy, musty, or fishy smell)</li>
                <li>Dead fish or other aquatic life</li>
                <li>Foam or froth on water surface</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>Health Effects</h3>
              <div className="health-effects">
                <div className="effect-category">
                  <h4>Mild Exposure</h4>
                  <ul>
                    <li>Skin irritation and rashes</li>
                    <li>Eye irritation</li>
                    <li>Nausea and vomiting</li>
                  </ul>
                </div>
                <div className="effect-category">
                  <h4>Severe Exposure</h4>
                  <ul>
                    <li>Liver damage</li>
                    <li>Neurological problems</li>
                    <li>Respiratory issues</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'water-safety':
        return (
          <div className="info-content">
            <h2>️ Water Safety Guidelines</h2>
            
            <div className="safety-levels">
              <div className="safety-level safe">
                <div className="level-header">
                  <i className="fas fa-check-circle"></i>
                  <h3>Safe - Green</h3>
                </div>
                <p>Water quality is excellent. All recreational activities are safe.</p>
                <ul>
                  <li>Swimming is safe and encouraged</li>
                  <li>Boating and kayaking are safe</li>
                  <li>Fishing is safe</li>
                  <li>Pets can safely enter the water</li>
                </ul>
              </div>

              <div className="safety-level caution">
                <div className="level-header">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h3>Caution - Yellow</h3>
                </div>
                <p>Water quality is fair. Some activities may be restricted.</p>
                <ul>
                  <li>Avoid swimming and wading</li>
                  <li>Boating is generally safe</li>
                  <li>Fishing is safe but avoid contact with water</li>
                  <li>Keep pets away from water</li>
                </ul>
              </div>

              <div className="safety-level warning">
                <div className="level-header">
                  <i className="fas fa-exclamation-circle"></i>
                  <h3>Warning - Orange</h3>
                </div>
                <p>Water quality is poor. Most activities are not recommended.</p>
                <ul>
                  <li>Do not swim or wade</li>
                  <li>Boating is safe but avoid water contact</li>
                  <li>Fishing is safe but avoid water contact</li>
                  <li>Keep pets and children away from water</li>
                </ul>
              </div>

              <div className="safety-level unsafe">
                <div className="level-header">
                  <i className="fas fa-times-circle"></i>
                  <h3>Unsafe - Red</h3>
                </div>
                <p>Water quality is dangerous. All water activities are prohibited.</p>
                <ul>
                  <li>Do not enter the water for any reason</li>
                  <li>Do not boat or kayak</li>
                  <li>Do not fish</li>
                  <li>Keep all people and pets away from water</li>
                </ul>
              </div>
            </div>

            <div className="info-section">
              <h3>General Safety Tips</h3>
              <ul className="safety-tips">
                <li>Always check water quality before entering</li>
                <li>Never drink untreated water from natural sources</li>
                <li>Shower after swimming in natural waters</li>
                <li>Report any unusual water conditions immediately</li>
                <li>Keep children and pets supervised near water</li>
              </ul>
            </div>
          </div>
        );

      case 'prevention':
        return (
          <div className="info-content">
            <h2> Preventing Water Pollution</h2>
            
            <div className="info-section">
              <h3>What Causes Algal Blooms?</h3>
              <div className="causes-grid">
                <div className="cause-item">
                  <i className="fas fa-seedling"></i>
                  <h4>Nutrient Pollution</h4>
                  <p>Excess nitrogen and phosphorus from fertilizers, sewage, and runoff</p>
                </div>
                <div className="cause-item">
                  <i className="fas fa-thermometer-half"></i>
                  <h4>Warm Temperatures</h4>
                  <p>Climate change and seasonal warming create ideal conditions</p>
                </div>
                <div className="cause-item">
                  <i className="fas fa-tint"></i>
                  <h4>Stagnant Water</h4>
                  <p>Low water flow and circulation allow algae to accumulate</p>
                </div>
                <div className="cause-item">
                  <i className="fas fa-industry"></i>
                  <h4>Industrial Runoff</h4>
                  <p>Chemicals and pollutants from industrial activities</p>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>What You Can Do</h3>
              <div className="action-categories">
                <div className="action-category">
                  <h4> At Home</h4>
                  <ul>
                    <li>Use phosphate-free detergents and cleaners</li>
                    <li>Properly dispose of household chemicals</li>
                    <li>Maintain septic systems regularly</li>
                    <li>Conserve water to reduce runoff</li>
                    <li>Plant native vegetation to filter runoff</li>
                  </ul>
                </div>
                <div className="action-category">
                  <h4> In Your Yard</h4>
                  <ul>
                    <li>Use fertilizers sparingly and only when needed</li>
                    <li>Choose native plants that require less water</li>
                    <li>Create rain gardens to capture runoff</li>
                    <li>Keep grass clippings out of storm drains</li>
                    <li>Use organic lawn care methods</li>
                  </ul>
                </div>
                <div className="action-category">
                  <h4> In Your Community</h4>
                  <ul>
                    <li>Participate in local clean-up events</li>
                    <li>Support water quality monitoring programs</li>
                    <li>Advocate for environmental protection policies</li>
                    <li>Educate others about water conservation</li>
                    <li>Report pollution and illegal dumping</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="highlight-box">
              <h3> Pro Tip</h3>
              <p>
                The best way to prevent algal blooms is to reduce nutrient pollution. 
                Every small action adds up to make a big difference for Virginia's waterways!
              </p>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="info-content">
            <h2> Additional Resources</h2>
            
            <div className="resources-grid">
              <div className="resource-category">
                <h3>🏛️ Government Agencies</h3>
                <ul>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Virginia Department of Environmental Quality</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Virginia Department of Health</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Environmental Protection Agency</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">U.S. Geological Survey</a></li>
                </ul>
              </div>

              <div className="resource-category">
                <h3> Environmental Organizations</h3>
                <ul>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Chesapeake Bay Foundation</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Virginia Conservation Network</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Sierra Club Virginia</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Nature Conservancy</a></li>
                </ul>
              </div>

              <div className="resource-category">
                <h3> Mobile Apps</h3>
                <ul>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Cyanobacteria Monitoring App</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Water Quality Reporter</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Environmental Data Explorer</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Weather & Water Conditions</a></li>
                </ul>
              </div>

              <div className="resource-category">
                <h3> Educational Materials</h3>
                <ul>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Understanding Water Quality</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Citizen Science Guide</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Water Conservation Tips</a></li>
                  <li><a href="#" target="_blank" rel="noopener noreferrer">Environmental Impact Assessment</a></li>
                </ul>
              </div>
            </div>

            <div className="info-section">
              <h3> Emergency Contacts</h3>
              <div className="emergency-contacts">
                <div className="contact-item">
                  <strong>Environmental Emergency Hotline:</strong>
                  <span>1-800-468-8892</span>
                </div>
                <div className="contact-item">
                  <strong>Virginia DEQ Emergency:</strong>
                  <span>1-804-698-4000</span>
                </div>
                <div className="contact-item">
                  <strong>Poison Control:</strong>
                  <span>1-800-222-1222</span>
                </div>
              </div>
            </div>

            <div className="highlight-box">
              <h3> Get Involved</h3>
              <p>
                Join our community of water quality advocates! Participate in clean-up events, 
                report water conditions, and help protect Virginia's waterways for future generations.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="information-section">
      <div className="container">
        <div className="information-header">
          <h1> Water Quality Information Center</h1>
          <p>Learn about water quality, safety, and how to protect Virginia's waterways</p>
        </div>

        <div className="information-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="information-content">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default Information;
