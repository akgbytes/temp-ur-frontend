// Service Worker for Image Caching
const CACHE_NAME = 'urbanesta-images-v1';
const IMAGE_CACHE_NAME = 'urbanesta-image-cache-v1';

// Images to cache immediately
const STATIC_IMAGES = [
  '/img/logo.jpg',
  '/img/heroImage.jpg',
  '/img/placeholder.jpg'
];

// Install event - cache static images
self.addEventListener('install', (event) => {
  // Service Worker installing
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Caching static images
        return cache.addAll(STATIC_IMAGES);
      })
      .then(() => {
        // Static images cached successfully
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Service Worker activating
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME) {
            // Deleting old cache
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Service Worker activated
      return self.clients.claim();
    })
  );
});

// Fetch event - handle image requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle image requests
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i) ||
      url.hostname.includes('cloudfront.net') ||
      url.hostname.includes('s3.amazonaws.com')) {
    
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            // Serving image from cache
            return response;
          }

          // If not in cache, fetch and cache it
          return fetch(request).then((fetchResponse) => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              // Caching new image
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          }).catch((error) => {
            console.warn('Failed to fetch image:', url.pathname, error);
            // Return a placeholder image if available
            return caches.match('/img/placeholder.jpg');
          });
        });
      })
    );
  }
});

// Message handling for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_IMAGES') {
    const { images } = event.data;
    event.waitUntil(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return Promise.all(
          images.map((imageUrl) => {
            return fetch(imageUrl).then((response) => {
              if (response.ok) {
                return cache.put(imageUrl, response);
              }
            }).catch((error) => {
              console.warn('Failed to cache image:', imageUrl, error);
            });
          })
        );
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(IMAGE_CACHE_NAME).then(() => {
        // Image cache cleared
        return caches.open(IMAGE_CACHE_NAME);
      })
    );
  }
});

// Background sync for preloading images
self.addEventListener('sync', (event) => {
  if (event.tag === 'preload-images') {
    event.waitUntil(
      // Preload critical images in background
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        const criticalImages = [
          // Add critical image URLs here
        ];
        
        return Promise.all(
          criticalImages.map((imageUrl) => {
            return fetch(imageUrl).then((response) => {
              if (response.ok) {
                return cache.put(imageUrl, response);
              }
            }).catch((error) => {
              console.warn('Failed to preload image:', imageUrl, error);
            });
          })
        );
      })
    );
  }
});
