import React, { createContext, useContext, useReducer, useEffect } from 'react';

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
  pendingReports: [], // Reports waiting for verification
  verificationQueue: {} // Location-based report queues
};

const reportReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REPORT':
      const newReport = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        verified: false
      };

      // Add to pending reports
      const updatedPendingReports = [...state.pendingReports, newReport];
      
      // Update verification queue for this location
      const location = newReport.location;
      const locationReports = state.verificationQueue[location] || [];
      const updatedLocationReports = [...locationReports, newReport];
      
      // Check if we have enough reports to verify
      const threshold = VERIFICATION_THRESHOLDS[newReport.status] || 3;
      const recentReports = updatedLocationReports.filter(report => {
        const reportTime = new Date(report.timestamp);
        const now = new Date();
        const hoursDiff = (now - reportTime) / (1000 * 60 * 60);
        return hoursDiff <= VERIFICATION_WINDOW;
      });

      const statusCounts = recentReports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      // Find the status with the most reports
      const verifiedStatus = Object.keys(statusCounts).reduce((a, b) => 
        statusCounts[a] > statusCounts[b] ? a : b
      );

      // Check if we have enough reports to verify
      const shouldVerify = statusCounts[verifiedStatus] >= threshold;

      return {
        ...state,
        reports: [newReport, ...state.reports.slice(0, 9)], // Keep 10 most recent
        pendingReports: updatedPendingReports,
        verificationQueue: {
          ...state.verificationQueue,
          [location]: updatedLocationReports
        },
        verifiedStatuses: shouldVerify ? {
          ...state.verifiedStatuses,
          [location]: verifiedStatus
        } : state.verifiedStatuses
      };

    case 'CLEAR_OLD_REPORTS':
      const cutoffTime = new Date(Date.now() - VERIFICATION_WINDOW * 60 * 60 * 1000);
      
      const filteredPendingReports = state.pendingReports.filter(
        report => new Date(report.timestamp) > cutoffTime
      );

      const filteredVerificationQueue = Object.keys(state.verificationQueue).reduce((acc, location) => {
        acc[location] = state.verificationQueue[location].filter(
          report => new Date(report.timestamp) > cutoffTime
        );
        return acc;
      }, {});

      return {
        ...state,
        pendingReports: filteredPendingReports,
        verificationQueue: filteredVerificationQueue
      };

    default:
      return state;
  }
};

export const ReportProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reportReducer, initialState);

  // Clean up old reports every hour
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEAR_OLD_REPORTS' });
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  const addReport = (reportData) => {
    dispatch({
      type: 'ADD_REPORT',
      payload: reportData
    });
  };

  const getVerificationStatus = (location) => {
    const locationReports = state.verificationQueue[location] || [];
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
      totalReports,
      neededReports: threshold,
      mostCommonStatus,
      isVerified,
      statusCounts
    };
  };

  const value = {
    ...state,
    addReport,
    getVerificationStatus,
    VERIFICATION_THRESHOLDS
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
