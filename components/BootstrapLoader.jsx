'use client';

import { useEffect } from 'react';

export default function BootstrapLoader() {
  useEffect(() => {
    // Bootstrap is now loaded locally via layout.js
    // This component can be used for any Bootstrap-related initialization if needed
  }, []);

  return null; // This component doesn't render anything
}