import { useEffect, useState } from 'react';

export const useServiceWorker = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      setIsSupported(true);
      
      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          // Service Worker registered successfully
          setRegistration(reg);
          setIsRegistered(true);
          
          // Handle updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  // New service worker available
                  // You can show a notification to the user here
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          setIsRegistered(false);
        });
    } else {
      // Service Workers not supported
      setIsSupported(false);
    }
  }, []);

  // Function to preload images
  const preloadImages = (imageUrls) => {
    if (registration && registration.active) {
      registration.active.postMessage({
        type: 'CACHE_IMAGES',
        images: imageUrls
      });
    }
  };

  // Function to clear cache
  const clearCache = () => {
    if (registration && registration.active) {
      registration.active.postMessage({
        type: 'CLEAR_CACHE'
      });
    }
  };

  // Function to update service worker
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    isSupported,
    isRegistered,
    registration,
    preloadImages,
    clearCache,
    updateServiceWorker
  };
};
