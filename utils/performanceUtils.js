/**
 * Performance Utilities for optimizing user interactions
 */

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - limits execution to once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Request Animation Frame throttle for smooth animations
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF throttled function
 */
export function rafThrottle(func) {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
    // Fallback to regular throttle on server
    return throttle(func, 16); // ~60fps
  }
  
  let rafId = null;
  return function throttled(...args) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * Prevent double-click execution
 * @param {Function} func - Function to protect
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Protected function
 */
export function preventDoubleClick(func, delay = 1000) {
  let isExecuting = false;
  return function executedFunction(...args) {
    if (!isExecuting) {
      isExecuting = true;
      func(...args);
      setTimeout(() => {
        isExecuting = false;
      }, delay);
    }
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Is in viewport
 */
export function isInViewport(element) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Element or selector to scroll to
 * @param {Object} options - Scroll options
 */
export function smoothScrollTo(target, options = {}) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };

  element.scrollIntoView(defaultOptions);
}

/**
 * Preload images for better performance
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise<void[]>} Promise that resolves when all images are loaded
 */
export function preloadImages(imageUrls) {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    })
  );
}

/**
 * Get optimal image loading strategy based on connection
 * @returns {string} Loading strategy - 'eager' or 'lazy'
 */
export function getImageLoadingStrategy() {
  if (typeof navigator === 'undefined') return 'lazy';
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return 'lazy';

  const slowConnections = ['slow-2g', '2g', '3g'];
  return slowConnections.includes(connection.effectiveType) ? 'lazy' : 'eager';
}

/**
 * Measure performance of a function
 * @param {Function} func - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Function} Wrapped function that measures performance
 */
export function measurePerformance(func, label) {
  return async function measured(...args) {
    const start = performance.now();
    const result = await func(...args);
    const end = performance.now();
    console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

/**
 * Request Idle Callback wrapper with fallback
 * @param {Function} callback - Function to execute when idle
 * @param {Object} options - Options for requestIdleCallback
 */
export function runWhenIdle(callback, options = {}) {
  if (typeof window === 'undefined') {
    callback();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} User prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

