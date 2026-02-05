'use client';

import { useAnalytics } from '@/hooks/useAnalyticsSimple';
import { usePathname } from 'next/navigation';

export default function GlobalAnalyticsTracker() {
  const pathname = usePathname();
  
  // Track general website visits for all pages
  // Pass empty string for pageTitle - the hook will get it from document.title safely
  useAnalytics(pathname, '');

  return null; // This component doesn't render anything
}
