'use client';

import { useAnalytics, usePropertyViewTracking } from '@/hooks/useAnalyticsSimple';

export default function AnalyticsTracker({ pageUrl, pageTitle, propertyId }) {
  // Track general website visit
  useAnalytics(pageUrl, pageTitle);
  
  // Track property view if propertyId is provided
  usePropertyViewTracking(propertyId);

  return null; // This component doesn't render anything
}
