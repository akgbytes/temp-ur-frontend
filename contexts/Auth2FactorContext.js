"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, userAPI } from '../lib/api.js';

const Auth2FactorContext = createContext({});

export const useAuth2Factor = () => {
  const context = useContext(Auth2FactorContext);
  if (!context) {
    throw new Error('useAuth2Factor must be used within an Auth2FactorProvider');
  }
  return context;
};

export const Auth2FactorProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Check if user profile is complete
  const checkProfileComplete = (userData) => {
    return userData && 
           userData.name && 
           userData.name !== 'User' && 
           userData.city && 
           userData.city !== 'Delhi' && 
           userData.email && 
           userData.email.trim() !== '';
  };

  // Lazy check authentication - only check if user has previously signed in
  useEffect(() => {
    // Check if user has a session indicator (stored when they successfully sign in)
    const hasPreviousSession = typeof window !== 'undefined' && 
      (localStorage.getItem('hasSession') === 'true' || 
       sessionStorage.getItem('hasSession') === 'true');

    const checkAuth = async () => {
      // Only check auth if there's an indication of a previous session
      // This prevents unnecessary API calls on initial page load for unauthenticated users
      if (!hasPreviousSession) {
        setUser(null);
        setIsProfileComplete(false);
        setLoading(false);
        return;
      }

      try {
        // Use frontend API route to avoid mixed content issues
        // Relative URL automatically uses same protocol as current page
        const apiUrl = '/api/user/profile';
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success) {
            setUser(data.user);
            setIsProfileComplete(checkProfileComplete(data.user));
          } else {
            setUser(null);
            setIsProfileComplete(false);
            // Clear session indicator if auth failed
            if (typeof window !== 'undefined') {
              localStorage.removeItem('hasSession');
              sessionStorage.removeItem('hasSession');
            }
          }
        } else if (response.status === 401) {
          // Not authenticated - clear session indicator
          setUser(null);
          setIsProfileComplete(false);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('hasSession');
            sessionStorage.removeItem('hasSession');
          }
        } else {
          setUser(null);
          setIsProfileComplete(false);
        }
      } catch (error) {
        // Silently handle authentication errors
        setUser(null);
        setIsProfileComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const sendOTP = async (phoneNumber) => {
    try {
      const { data, error } = await authAPI.sendOTP(phoneNumber);
      if (error) {
        throw new Error(error);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTP = async (sessionId, otp) => {
    try {
      const { data, error, status } = await authAPI.verifyOTP(sessionId, otp);
      
      if (error) {
        // Handle specific error cases
        if (status === 409) {
          throw new Error('Phone number already exists. Please try logging in instead.');
        } else if (status === 400) {
          throw new Error(error || 'Invalid OTP. Please check and try again.');
        } else {
          throw new Error(error);
        }
      }
      
      if (data && data.success) {
        setUser(data.user);
        setIsProfileComplete(checkProfileComplete(data.user));
        // Set session indicator when user successfully signs in
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasSession', 'true');
          sessionStorage.setItem('hasSession', 'true');
        }
        return data;
      } else {
        throw new Error(data?.error || 'OTP verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (userData) => {
    try {
      const { data, error } = await userAPI.updateProfile(userData);
      if (error) {
        throw new Error(error);
      }
      
      if (data && data.success) {
        setUser(data.user);
        setIsProfileComplete(checkProfileComplete(data.user));
        return data;
      } else {
        throw new Error(data?.error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    try {
      const { data, error, status } = await userAPI.getProfile();
      
      // Handle 401 errors silently - this is expected for unauthenticated users
      if (status === 401 || error === 'Unauthorized') {
        setUser(null);
        setIsProfileComplete(false);
        throw new Error('User not authenticated');
      } else if (data && data.success) {
        setUser(data.user);
        setIsProfileComplete(checkProfileComplete(data.user));
        return data.user;
      } else {
        throw new Error(error || 'Failed to refresh profile');
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsProfileComplete(false);
      // Clear session indicator on sign out
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hasSession');
        sessionStorage.removeItem('hasSession');
      }
    } catch (error) {
      // Still clear local state even if logout fails
      setUser(null);
      setIsProfileComplete(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('hasSession');
        sessionStorage.removeItem('hasSession');
      }
    }
  };

  const value = {
    user,
    loading,
    isProfileComplete,
    sendOTP,
    verifyOTP,
    updateUserProfile,
    refreshUserProfile,
    signOut,
    checkProfileComplete
  };

  return (
    <Auth2FactorContext.Provider value={value}>
      {children}
    </Auth2FactorContext.Provider>
  );
};
