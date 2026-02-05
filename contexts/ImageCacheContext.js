"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ImageCacheContext = createContext();

export function ImageCacheProvider({ children }) {
  const [imageCache, setImageCache] = useState(new Map());
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('imageCache');
      if (savedCache) {
        const parsedCache = JSON.parse(savedCache);
        const cacheMap = new Map(Object.entries(parsedCache));
        setImageCache(cacheMap);
      }
    } catch (error) {
      console.warn('Failed to load image cache from localStorage:', error);
    }
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    try {
      const cacheObject = Object.fromEntries(imageCache);
      localStorage.setItem('imageCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save image cache to localStorage:', error);
    }
  }, [imageCache]);

  // Check if image is cached
  const isImageCached = useCallback((src) => {
    return imageCache.has(src);
  }, [imageCache]);

  // Get cached image data
  const getCachedImage = useCallback((src) => {
    return imageCache.get(src);
  }, [imageCache]);

  // Set cached image data
  const setCachedImage = useCallback((src, data) => {
    setImageCache(prev => {
      const newCache = new Map(prev);
      newCache.set(src, {
        ...data,
        src,
        cachedAt: Date.now()
      });
      return newCache;
    });
  }, []);

  // Preload image
  const preloadImage = useCallback((src) => {
    if (preloadedImages.has(src)) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
        setCachedImage(src, { loaded: true, preloaded: true });
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [preloadedImages, setCachedImage]);

  // Batch preload images
  const preloadImages = useCallback(async (imageUrls) => {
    const preloadPromises = imageUrls.map(src => preloadImage(src));
    try {
      await Promise.allSettled(preloadPromises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    }
  }, [preloadImage]);

  // Clear cache
  const clearCache = useCallback(() => {
    setImageCache(new Map());
    setPreloadedImages(new Set());
    localStorage.removeItem('imageCache');
  }, []);

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return {
      totalCached: imageCache.size,
      preloaded: preloadedImages.size,
      cacheSize: JSON.stringify(Object.fromEntries(imageCache)).length
    };
  }, [imageCache, preloadedImages]);

  // Clean old cache entries (older than 7 days)
  const cleanOldCache = useCallback(() => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    setImageCache(prev => {
      const newCache = new Map();
      prev.forEach((value, key) => {
        if (value.cachedAt > sevenDaysAgo) {
          newCache.set(key, value);
        }
      });
      return newCache;
    });
  }, []);

  // Auto-clean cache every hour
  useEffect(() => {
    const interval = setInterval(cleanOldCache, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanOldCache]);

  const value = {
    imageCache,
    isImageCached,
    getCachedImage,
    setCachedImage,
    preloadImage,
    preloadImages,
    clearCache,
    getCacheStats,
    cleanOldCache
  };

  return (
    <ImageCacheContext.Provider value={value}>
      {children}
    </ImageCacheContext.Provider>
  );
}

export function useImageCache() {
  const context = useContext(ImageCacheContext);
  if (context === undefined) {
    throw new Error('useImageCache must be used within an ImageCacheProvider');
  }
  return context;
}
