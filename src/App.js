import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ReportProvider } from './context/ReportContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WaterMap from './components/WaterMap';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import About from './components/About';
import Footer from './components/Footer';
import Notification from './components/Notification';
import LocationAlert from './components/LocationAlert';
import SearchAndDirections from './components/SearchAndDirections';
import Information from './components/Information';
import CleaningParties from './components/CleaningParties';
import FirebaseTest from './components/FirebaseTest';
import CommunityEvents from './components/CommunityEvents';
import ImpactShowcase from './components/ImpactShowcase';
import WolframInsights from './components/WolframInsights';
import './App.css';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [showLocationAlert, setShowLocationAlert] = useState(false);
  const [showSearchDirections, setShowSearchDirections] = useState(false);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleLocationAlert = () => {
    setShowLocationAlert(true);
  };

  const handleSearchDirections = () => {
    setShowSearchDirections(true);
  };

  return (
    <AuthProvider>
      <ReportProvider>
        <Router>
          <div className="App">
            <Navbar
              onLocationAlert={handleLocationAlert}
              onSearchDirections={handleSearchDirections}
            />
            <main>
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero />
                    <WolframInsights />
                  </>
                } />
                <Route path="/map" element={<WaterMap />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/information" element={<Information />} />
                <Route path="/cleaning-parties" element={<CleaningParties />} />
                <Route path="/report" element={<ReportForm onReportSubmit={addNotification} />} />
                <Route path="/about" element={<About />} />
                <Route path="/firebase-test" element={<FirebaseTest />} />
                <Route path="/community-events" element={<CommunityEvents />} />
                <Route path="/impact-showcase" element={<ImpactShowcase />} />
                <Route path="/wolfram-insights" element={<WolframInsights />} />
              </Routes>
            </main>
            <Footer />
            <div className="notification-container">
              {notifications.map(notification => (
                <Notification
                  key={notification.id}
                  message={notification.message}
                  type={notification.type}
                  onClose={() => removeNotification(notification.id)}
                />
              ))}
            </div>

            {showLocationAlert && (
              <LocationAlert onClose={() => setShowLocationAlert(false)} />
            )}
            {showSearchDirections && (
              <SearchAndDirections onClose={() => setShowSearchDirections(false)} />
            )}
          </div>
        </Router>
      </ReportProvider>
    </AuthProvider>
  );
}

export default App;
