"use client";
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useImageCache } from '../contexts/ImageCacheContext';

const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className, 
  style, 
  priority = false,
  quality = 80,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fetchPriority,
  fetchpriority, // Handle lowercase version
  ...props 
}) => {
  // Use camelCase version, fallback to lowercase if provided
  const imgFetchPriority = fetchPriority || fetchpriority;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Use image cache context
  const { getCachedImage, setCachedImage, isImageCached } = useImageCache();
  
  const shouldLoad = priority || hasIntersected;
  const isCached = isImageCached(src);

  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  // Handle image load and cache it
  const handleImageLoad = () => {
    setImageLoaded(true);
    setCachedImage(src, { loaded: true, timestamp: Date.now() });
  };

  // Preload image if cached
  useEffect(() => {
    if (isCached && !imageLoaded) {
      const cachedData = getCachedImage(src);
      if (cachedData?.loaded) {
        setImageLoaded(true);
      }
    }
  }, [isCached, src, imageLoaded, getCachedImage]);

  // Handle aspect ratio warnings by ensuring both width and height are provided or using fill
  const imageStyle = {
    ...style,
    // Don't override width/height if they're explicitly set in style
    ...(width && height && !fill && !style?.width && !style?.height ? { width: 'auto', height: 'auto' } : {}),
  };

  return (
    <div ref={ref} className={`position-relative ${className}`} style={style}>
      {/* Loading placeholder with skeleton */}
      {!imageLoaded && shouldLoad && (
        <div 
          className="skeleton-loader position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            width: width || '100%', 
            height: height || '200px',
            zIndex: 1
          }}
        />
      )}
      
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            ...imageStyle,
            transition: 'opacity 0.3s ease-in-out',
            willChange: 'opacity'
          }}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={imgFetchPriority}
          decoding="async"
          onLoad={handleImageLoad}
          onError={(e) => {
            // Silently handle image errors - fallback will be handled by parent
            e.target.style.display = 'none';
            setImageLoaded(true);
          }}
          {...props}
        />
      ) : (
        <div 
          className="skeleton-loader d-flex align-items-center justify-content-center"
          style={{ 
            width: width || '100%', 
            height: height || '200px',
            ...style 
          }}
        >
          <div className="spinner-border text-secondary spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
