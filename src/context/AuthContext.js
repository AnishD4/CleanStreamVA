import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getUserProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.warn('Firebase auth initialization took too long, proceeding without auth');
        setLoading(false);
        setError('Authentication service unavailable');
      }
    }, 5000);

    let unsubscribe;

    try {
      unsubscribe = onAuthStateChange(async (user) => {
        clearTimeout(loadingTimeout);
        if (user) {
          setCurrentUser(user);
          // Get additional user profile data from Firestore
          try {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error getting user profile:', error);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Firebase initialization error:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
      setError('Firebase initialization failed');
    }

    return () => {
      clearTimeout(loadingTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
