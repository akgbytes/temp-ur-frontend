import { useEffect, useRef, useState } from 'react';
import { analyticsAPI, propertyViewsAPI } from '@/lib/api';

// ⚠️ ANALYTICS COMPLETELY DISABLED DUE TO 401 ERRORS ⚠️
// All hooks return immediately without making any API calls
// TODO: Fix backend authentication for analytics before re-enabling

// Hook for tracking general website visits - DISABLED
export function useAnalytics(pageUrl, pageTitle = '') {
  // Do nothing - analytics completely disabled
  return null;
}

// Hook for tracking property views - DISABLED
export function usePropertyViewTracking(propertyId) {
  // Do nothing - tracking completely disabled
  return null;
}

// Hook for getting property view count - DISABLED
export function usePropertyViewCount(propertyId) {
  // Return zero immediately - no API call
  return { viewCount: 0, loading: false };
}

// Utility function to track custom events - DISABLED
export function trackCustomEvent(eventName, eventData = {}) {
  // Do nothing - tracking completely disabled
  return null;
}

export default {
  useAnalytics,
  usePropertyViewTracking,
  usePropertyViewCount,
  trackCustomEvent
};
