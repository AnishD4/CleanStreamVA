import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { addWaterReport, getAllReports, subscribeToReports } from '../services/firebaseService';
import { useAuth } from './AuthContext';

const ReportContext = createContext();

// Verification thresholds
const VERIFICATION_THRESHOLDS = {
  safe: 2,        // Need 2 reports to verify safe status
  caution: 3,     // Need 3 reports to verify caution status
  warning: 2,     // Need 2 reports to verify warning status
  unsafe: 1       // Need only 1 report to verify unsafe status (safety first)
};

// Time window for report verification (in hours)
const VERIFICATION_WINDOW = 24;

const initialState = {
  reports: [],
  verifiedStatuses: {
    "Lake Anna": "warning",
    "Occoquan Reservoir": "caution", 
    "Chickahominy River": "caution",
    "James River": "safe",
    "Potomac River": "safe",
    "Shenandoah River": "safe",
    "Smith Mountain Lake": "caution",
    "Kerr Reservoir": "safe",
    "Claytor Lake": "safe",
    "Lake Gaston": "warning"
  },
  pendingReports: [],
  verificationQueue: {},
  loading: false,
  error: null
};

const reportReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_REPORTS':
      return { ...state, reports: action.payload, loading: false, error: null };

    case 'ADD_REPORT_SUCCESS':
      return {
        ...state,
        reports: [action.payload, ...state.reports.slice(0, 49)], // Keep 50 most recent
        loading: false,
        error: null
      };

    case 'UPDATE_VERIFICATION_STATUSES':
      return { ...state, verifiedStatuses: { ...state.verifiedStatuses, ...action.payload } };

    default:
      return state;
  }
};

export const ReportProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportReducer, initialState);
  const { currentUser } = useAuth();
  const [unsubscribe, setUnsubscribe] = useState(null);

  // Subscribe to real-time reports from Firebase
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const unsubscribeFromReports = subscribeToReports((reports) => {
      dispatch({ type: 'SET_REPORTS', payload: reports });

      // Update verification statuses based on reports
      updateVerificationStatuses(reports);
    });

    setUnsubscribe(() => unsubscribeFromReports);

    return () => {
      if (unsubscribeFromReports) {
        unsubscribeFromReports();
      }
    };
  }, []);

  const updateVerificationStatuses = (reports) => {
    const statusUpdates = {};

    // Group reports by location
    const reportsByLocation = reports.reduce((acc, report) => {
      if (!acc[report.location]) acc[report.location] = [];
      acc[report.location].push(report);
      return acc;
    }, {});

    // Calculate verification status for each location
    Object.keys(reportsByLocation).forEach(location => {
      const locationReports = reportsByLocation[location];
      const recentReports = locationReports.filter(report => {
        const reportTime = new Date(report.timestamp);
        const now = new Date();
        const hoursDiff = (now - reportTime) / (1000 * 60 * 60);
        return hoursDiff <= VERIFICATION_WINDOW;
      });

      const statusCounts = recentReports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      if (Object.keys(statusCounts).length > 0) {
        const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) =>
          statusCounts[a] > statusCounts[b] ? a : b
        );

        const threshold = VERIFICATION_THRESHOLDS[mostCommonStatus] || 3;
        if (statusCounts[mostCommonStatus] >= threshold) {
          statusUpdates[location] = mostCommonStatus;
        }
      }
    });

    if (Object.keys(statusUpdates).length > 0) {
      dispatch({ type: 'UPDATE_VERIFICATION_STATUSES', payload: statusUpdates });
    }
  };

  const addReport = async (reportData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Add user information to the report
      const reportWithUser = {
        ...reportData,
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        isAnonymous: currentUser?.isAnonymous || false
      };

      const newReport = await addWaterReport(reportWithUser);
      dispatch({ type: 'ADD_REPORT_SUCCESS', payload: newReport });

      return newReport;
    } catch (error) {
      console.error('Error adding report:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getVerificationStatus = (location) => {
    const locationReports = state.reports.filter(report => report.location === location);
    const recentReports = locationReports.filter(report => {
      const reportTime = new Date(report.timestamp);
      const now = new Date();
      const hoursDiff = (now - reportTime) / (1000 * 60 * 60);
      return hoursDiff <= VERIFICATION_WINDOW;
    });

    const statusCounts = recentReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {});

    const totalReports = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const mostCommonStatus = Object.keys(statusCounts).reduce((a, b) => 
      statusCounts[a] > statusCounts[b] ? a : b, 'safe'
    );

    const threshold = VERIFICATION_THRESHOLDS[mostCommonStatus] || 3;
    const isVerified = statusCounts[mostCommonStatus] >= threshold;

    return {
      status: state.verifiedStatuses[location] || 'safe',
      isVerified,
      reportCount: totalReports,
      statusBreakdown: statusCounts,
      threshold,
      recentReports: recentReports.length
    };
  };

  const getReportsByLocation = (location) => {
    return state.reports.filter(report => report.location === location);
  };

  const value = {
    ...state,
    addReport,
    getVerificationStatus,
    getReportsByLocation,
    VERIFICATION_THRESHOLDS,
    VERIFICATION_WINDOW
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
