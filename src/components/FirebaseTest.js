import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { addWaterReport, getAllReports } from '../services/firebaseService';
import { signInAnonymous, logOut } from '../services/authService';
import { db, auth } from '../firebase/config';
import './FirebaseTest.css';

const FirebaseTest = () => {
  const [testResults, setTestResults] = useState({
    config: 'pending',
    auth: 'pending',
    firestore: 'pending',
    realTime: 'pending'
  });
  const [testReport, setTestReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Test Firebase Configuration
  const testFirebaseConfig = () => {
    try {
      if (!db || !auth) {
        throw new Error('Firebase services not initialized');
      }

      const config = {
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10) + '...',
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
      };

      if (!config.projectId || !config.apiKey || !config.authDomain) {
        throw new Error('Missing environment variables');
      }

      setTestResults(prev => ({ ...prev, config: 'success' }));
      return true;
    } catch (error) {
      console.error('Config test failed:', error);
      setTestResults(prev => ({ ...prev, config: `failed: ${error.message}` }));
      return false;
    }
  };

  // Test Authentication
  const testAuthentication = async () => {
    try {
      setLoading(true);

      if (currentUser) {
        await logOut();
      }

      // Test anonymous sign-in
      await signInAnonymous();
      setTestResults(prev => ({ ...prev, auth: 'success' }));
      return true;
    } catch (error) {
      console.error('Auth test failed:', error);
      let errorMessage = error.message;

      // Provide specific guidance for common auth errors
      if (error.code === 'auth/admin-restricted-operation') {
        errorMessage = 'Anonymous authentication not enabled in Firebase Console. Go to Authentication > Sign-in method and enable Anonymous provider.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Authentication method not allowed. Check Firebase Console Authentication settings.';
      } else if (error.code === 'auth/project-not-found') {
        errorMessage = 'Firebase project not found. Check your project ID in .env file.';
      }

      setTestResults(prev => ({ ...prev, auth: `failed: ${errorMessage}` }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Test Firestore Write/Read
  const testFirestore = async () => {
    try {
      setLoading(true);

      // Wait a moment for authentication to fully complete
      let attempts = 0;
      while (!currentUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }

      if (!currentUser) {
        throw new Error('User not authenticated - authentication test may have failed');
      }

      // Create a test report


      // Test write operation
      const newReport = await addWaterReport(testReportData);
      setTestReport(newReport);

      // Test read operation
      const allReports = await getAllReports(5);
      setReports(allReports);

      setTestResults(prev => ({ ...prev, firestore: 'success' }));
      return true;
    } catch (error) {
      console.error('Firestore test failed:', error);
      let errorMessage = error.message;

      // Provide specific guidance for common Firestore errors
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Check Firestore security rules allow writing with authentication.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firestore unavailable. Check if Firestore database is created in Firebase Console.';
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'User authentication failed. Make sure Anonymous auth is enabled and working.';
      }

      setTestResults(prev => ({ ...prev, firestore: `failed: ${errorMessage}` }));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Test Real-time Updates
  const testRealTime = async () => {
    try {
      const { subscribeToReports } = await import('../services/firebaseService');

      let updateReceived = false;

      const unsubscribe = subscribeToReports((reports) => {
        if (reports.length > 0) {
          updateReceived = true;
          setReports(reports.slice(0, 5));
          setTestResults(prev => ({ ...prev, realTime: 'success' }));
          unsubscribe();
        }
      });

      setTimeout(() => {
        if (!updateReceived) {
          setTestResults(prev => ({ ...prev, realTime: 'timeout - may still work' }));
        }
        unsubscribe();
      }, 3000);

      return true;
    } catch (error) {
      console.error('Real-time test failed:', error);
      setTestResults(prev => ({ ...prev, realTime: `failed: ${error.message}` }));
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults({
      config: 'pending',
      auth: 'pending',
      firestore: 'pending',
      realTime: 'pending'
    });

    const configOk = testFirebaseConfig();

    if (configOk) {
      const authOk = await testAuthentication();

      if (authOk) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const firestoreOk = await testFirestore();

        if (firestoreOk) {
          await testRealTime();
        }
      }
    }
  };

  // Auto-run config test on component mount
  useEffect(() => {
    testFirebaseConfig();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'success') return '✅';
    if (status === 'pending') return '⏳';
    if (status.includes('timeout')) return '⚠️';
    return '❌';
  };

  const getStatusClass = (status) => {
    if (status === 'success') return 'status-success';
    if (status === 'pending') return 'status-pending';
    if (status.includes('timeout')) return 'status-warning';
    return 'status-error';
  };

  return (
    <div className="firebase-test-container">
      <div className="firebase-test-header">
        <h2>🔥 Firebase Connection Test</h2>
        <p>Test your Firebase integration to make sure everything is working properly.</p>
      </div>

      <div className="test-controls">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="test-button primary"
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>

        {currentUser && (
          <div className="current-user">
            <span>Signed in as: {currentUser.isAnonymous ? 'Anonymous Guest' : currentUser.email}</span>
          </div>
        )}
      </div>

      <div className="test-results">
        <h3>Test Results:</h3>

        <div className="test-item">
          <div className={`test-status ${getStatusClass(testResults.config)}`}>
            {getStatusIcon(testResults.config)}
            <strong>Firebase Configuration:</strong>
            <span>{testResults.config}</span>
          </div>
          <p>Checks if environment variables are properly set and Firebase is initialized.</p>
        </div>

        <div className="test-item">
          <div className={`test-status ${getStatusClass(testResults.auth)}`}>
            {getStatusIcon(testResults.auth)}
            <strong>Authentication:</strong>
            <span>{testResults.auth}</span>
          </div>
          <p>Tests anonymous sign-in functionality.</p>
        </div>

        <div className="test-item">
          <div className={`test-status ${getStatusClass(testResults.firestore)}`}>
            {getStatusIcon(testResults.firestore)}
            <strong>Firestore Database:</strong>
            <span>{testResults.firestore}</span>
          </div>
          <p>Tests writing and reading data from Firestore.</p>
        </div>

        <div className="test-item">
          <div className={`test-status ${getStatusClass(testResults.realTime)}`}>
            {getStatusIcon(testResults.realTime)}
            <strong>Real-time Updates:</strong>
            <span>{testResults.realTime}</span>
          </div>
          <p>Tests real-time data synchronization.</p>
        </div>
      </div>

      {testReport && (
        <div className="test-data">
          <h4> Test Report Created:</h4>
          <pre>{JSON.stringify(testReport, null, 2)}</pre>
        </div>
      )}

      {reports.length > 0 && (
        <div className="test-data">
          <h4> Recent Reports ({reports.length}):</h4>
          <div className="reports-list">
            {reports.map((report, index) => (
              <div key={report.id || index} className="report-item">
                <strong>{report.location}</strong> - {report.status}
                <small>{report.timestamp ? report.timestamp.toLocaleString() : 'No timestamp'}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="test-instructions">
        <h4> If Tests Fail:</h4>
        <ul>
          <li><strong>Configuration fails:</strong> Check your .env file has correct Firebase credentials</li>
          <li><strong>Authentication fails:</strong> Enable Anonymous auth in Firebase Console</li>
          <li><strong>Firestore fails:</strong> Create Firestore database in Firebase Console</li>
          <li><strong>Real-time fails:</strong> Check Firestore security rules allow reading</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
