"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth2Factor } from './Auth2FactorContext';
import { userAPI } from '../lib/api';

const WatchlistContext = createContext(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const { user } = useAuth2Factor();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);
  const lastFetchRef = useRef(0);
  const CACHE_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

  const loadWatchlist = useCallback(async (force = false) => {
    if (!user) {
      setWatchlist([]);
      return;
    }

    // Prevent multiple simultaneous calls
    if (loadingRef.current) {
      return;
    }

    // Use cache if recent (within 2 days) and not forcing refresh
    const now = Date.now();
    const cachedData = typeof window !== 'undefined' ? localStorage.getItem('watchlist_cache') : null;
    const cacheTimestamp = typeof window !== 'undefined' ? localStorage.getItem('watchlist_cache_timestamp') : null;
    
    if (!force && cachedData && cacheTimestamp) {
      const cacheAge = now - parseInt(cacheTimestamp, 10);
      if (cacheAge < CACHE_DURATION) {
        try {
          const cachedWatchlist = JSON.parse(cachedData);
          setWatchlist(cachedWatchlist);
          lastFetchRef.current = parseInt(cacheTimestamp, 10);
          return;
        } catch (error) {
          // If cache is corrupted, clear it and fetch fresh
          if (typeof window !== 'undefined') {
            localStorage.removeItem('watchlist_cache');
            localStorage.removeItem('watchlist_cache_timestamp');
          }
        }
      } else {
        // Cache expired, clear it
        if (typeof window !== 'undefined') {
          localStorage.removeItem('watchlist_cache');
          localStorage.removeItem('watchlist_cache_timestamp');
        }
      }
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      const { data, error } = await userAPI.getWatchlist();
      if (data && data.success) {
        const watchlistData = data.watchlist || [];
        const uniqueWatchlist = watchlistData.filter((property, index, self) => 
          property && property._id && index === self.findIndex(p => p._id === property._id)
        );
        setWatchlist(uniqueWatchlist);
        lastFetchRef.current = now;
        
        // Cache the watchlist for 2 days
        if (typeof window !== 'undefined') {
          localStorage.setItem('watchlist_cache', JSON.stringify(uniqueWatchlist));
          localStorage.setItem('watchlist_cache_timestamp', now.toString());
        }
      } else {
        setWatchlist([]);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('watchlist_cache');
          localStorage.removeItem('watchlist_cache_timestamp');
        }
      }
    } catch (error) {
      setWatchlist([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user]);

  // Load watchlist when user changes
  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('watchlist_cache');
        localStorage.removeItem('watchlist_cache_timestamp');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToWatchlist = useCallback(async (propertyId) => {
    try {
      const { data, error } = await userAPI.addToWatchlist(propertyId);
      if (data && data.success) {
        // Force refresh watchlist and clear cache
        if (typeof window !== 'undefined') {
          localStorage.removeItem('watchlist_cache');
          localStorage.removeItem('watchlist_cache_timestamp');
        }
        await loadWatchlist(true);
        return { success: true };
      }
      return { success: false, error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [loadWatchlist]);

  const removeFromWatchlist = useCallback(async (propertyId) => {
    try {
      const { data, error } = await userAPI.removeFromWatchlist(propertyId);
      if (data && data.success) {
        // Force refresh watchlist and clear cache
        if (typeof window !== 'undefined') {
          localStorage.removeItem('watchlist_cache');
          localStorage.removeItem('watchlist_cache_timestamp');
        }
        await loadWatchlist(true);
        return { success: true };
      }
      return { success: false, error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [loadWatchlist]);

  const isInWatchlist = useCallback((propertyId) => {
    return watchlist.some(item => item._id === propertyId);
  }, [watchlist]);

  const value = {
    watchlist,
    loading,
    loadWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

