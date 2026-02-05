"use client";
import { useEffect, useCallback, useRef, useState } from 'react';
import { rafThrottle, debounce, preventDoubleClick } from '@/utils/performanceUtils';

/**
 * Hook for optimized scroll event handling
 * @param {Function} callback - Callback to execute on scroll
 * @param {Object} options - Options for scroll handling
 * @returns {Object} Scroll state and utilities
 */
export function useOptimizedScroll(callback, options = {}) {
  const { throttleMs = 100, passive = true } = options;
  const scrollTimeoutRef = useRef(null);

  const optimizedCallback = useCallback(
    rafThrottle(() => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        callback();
      }, throttleMs);
    }),
    [callback, throttleMs]
  );

  useEffect(() => {
    const handleScroll = optimizedCallback;
    window.addEventListener('scroll', handleScroll, { passive });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [optimizedCallback, passive]);
}

/**
 * Hook for optimized click handling (prevents double-clicks)
 * @param {Function} callback - Callback to execute on click
 * @param {number} delay - Delay to prevent double clicks
 * @returns {Function} Optimized click handler
 */
export function useOptimizedClick(callback, delay = 1000) {
  return useCallback(preventDoubleClick(callback, delay), [callback, delay]);
}

/**
 * Hook for lazy loading content when visible
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isVisible, hasBeenVisible]
 */
export function useLazyLoad(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, hasBeenVisible]);

  return [ref, isVisible, hasBeenVisible];
}

/**
 * Hook for debounced search input
 * @param {string} value - Input value
 * @param {number} delay - Debounce delay
 * @returns {string} Debounced value
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for optimized resize handling
 * @param {Function} callback - Callback to execute on resize
 * @param {number} delay - Debounce delay
 */
export function useOptimizedResize(callback, delay = 200) {
  useEffect(() => {
    const debouncedCallback = debounce(callback, delay);
    window.addEventListener('resize', debouncedCallback);

    return () => {
      window.removeEventListener('resize', debouncedCallback);
    };
  }, [callback, delay]);
}

/**
 * Hook for preloading critical images
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {boolean} Loading state
 */
export function usePreloadImages(imageUrls) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const preload = async () => {
      try {
        await Promise.all(
          imageUrls.map(url => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => resolve(url); // Resolve even on error to not block
              img.src = url;
            });
          })
        );
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error preloading images:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    preload();

    return () => {
      mounted = false;
    };
  }, [imageUrls]);

  return loading;
}

/**
 * Hook for smooth scroll to top
 * @returns {Function} Scroll to top function
 */
export function useScrollToTop() {
  return useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
}

