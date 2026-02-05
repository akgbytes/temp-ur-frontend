'use client';

import { useEffect, useRef, useState } from 'react';
import { analyticsAPI, propertyViewsAPI } from '@/lib/api';

// Hook for tracking general website visits
export function useAnalytics(pageUrl, pageTitle = '') {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Prevent duplicate tracking
    if (hasTracked.current) return;
    
    // Validate pageUrl
    if (!pageUrl || pageUrl === '') return;

    const trackVisit = async () => {
      try {
        const visitData = {
          pageUrl: pageUrl,
          pageTitle: pageTitle || document.title || '',
          referrer: document.referrer || '',
          sessionId: localStorage.getItem('session_id') || `session_${Date.now()}`,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
        };

        // Store session ID for tracking returning visitors
        if (!localStorage.getItem('session_id')) {
          localStorage.setItem('session_id', visitData.sessionId);
        }

        const response = await analyticsAPI.track(visitData);
        
        if (response.error) {
          // Silently handle errors - don't disrupt user experience
          console.debug('Analytics tracking failed:', response.error);
        }
        
        hasTracked.current = true;
      } catch (error) {
        // Silently handle errors
        console.debug('Analytics error:', error);
      }
    };

    trackVisit();
  }, [pageUrl, pageTitle]);

  return null;
}

// Hook for tracking property views
export function usePropertyViewTracking(propertyId) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Prevent duplicate tracking
    if (hasTracked.current) return;
    
    // Validate propertyId
    if (!propertyId) return;

    const trackView = async () => {
      try {
        const response = await propertyViewsAPI.track({ propertyId });
        
        if (response.error) {
          console.debug('Property view tracking failed:', response.error);
        }
        
        hasTracked.current = true;
      } catch (error) {
        console.debug('Property view tracking error:', error);
      }
    };

    // Delay tracking by 2 seconds to ensure real views (not bots)
    const timer = setTimeout(trackView, 2000);
    
    return () => clearTimeout(timer);
  }, [propertyId]);

  return null;
}

// Hook for getting property view count
export function usePropertyViewCount(propertyId) {
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const fetchViewCount = async () => {
      try {
        const response = await propertyViewsAPI.getCount(propertyId);
        
        if (response.data && typeof response.data.viewCount === 'number') {
          setViewCount(response.data.viewCount);
        }
      } catch (error) {
        console.debug('Failed to fetch view count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViewCount();
  }, [propertyId]);

  return { viewCount, loading };
}

// Utility function to track custom events
export function trackCustomEvent(eventName, eventData = {}) {
  if (typeof window === 'undefined') return;

  try {
    // Track custom events via analytics API
    analyticsAPI.track({
      pageUrl: window.location.pathname,
      pageTitle: `Event: ${eventName}`,
      referrer: document.referrer || '',
      sessionId: localStorage.getItem('session_id') || `session_${Date.now()}`,
      metadata: eventData
    }).catch(err => console.debug('Custom event tracking failed:', err));
  } catch (error) {
    console.debug('Failed to track custom event:', error);
  }
}

export default {
  useAnalytics,
  usePropertyViewTracking,
  usePropertyViewCount,
  trackCustomEvent
};
