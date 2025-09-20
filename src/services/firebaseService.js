import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection names
const COLLECTIONS = {
  REPORTS: 'waterReports',
  LOCATIONS: 'waterLocations',
  VERIFICATION_QUEUE: 'verificationQueue'
};

// Add a new water quality report
export const addWaterReport = async (reportData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.REPORTS), {
      ...reportData,
      timestamp: Timestamp.fromDate(new Date()),
      verified: false,
      verificationCount: 0,
      createdAt: Timestamp.fromDate(new Date())
    });
    return { id: docRef.id, ...reportData };
  } catch (error) {
    console.error('Error adding report:', error);
    throw error;
  }
};

// Get reports for a specific location
export const getReportsByLocation = async (location, limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('location', '==', location),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error getting reports:', error);
    throw error;
  }
};

// Get all recent reports
export const getAllReports = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error getting all reports:', error);
    throw error;
  }
};

// Real-time listener for reports
export const subscribeToReports = (callback, location = null) => {
  let q = collection(db, COLLECTIONS.REPORTS);

  if (location) {
    q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('location', '==', location),
      orderBy('timestamp', 'desc')
    );
  } else {
    q = query(
      collection(db, COLLECTIONS.REPORTS),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
  }

  return onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
    callback(reports);
  });
};

// Update report verification status
export const updateReportVerification = async (reportId, verificationData) => {
  try {
    const reportRef = doc(db, COLLECTIONS.REPORTS, reportId);
    await updateDoc(reportRef, {
      verified: verificationData.verified,
      verificationCount: verificationData.verificationCount,
      verifiedAt: Timestamp.fromDate(new Date()),
      ...verificationData
    });
  } catch (error) {
    console.error('Error updating report verification:', error);
    throw error;
  }
};

// Delete a report
export const deleteReport = async (reportId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.REPORTS, reportId));
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

// Get reports by status
export const getReportsByStatus = async (status, limitCount = 50) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.REPORTS),
      where('status', '==', status),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Error getting reports by status:', error);
    throw error;
  }
};
