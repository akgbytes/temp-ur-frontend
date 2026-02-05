"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LazyImage from './LazyImage';
import { useImageCache } from '../contexts/ImageCacheContext';

// Dynamically import heavy components
const ImageLightbox = dynamic(() => import('./ImageLightbox'), { 
  ssr: false,
  loading: () => <div className="spinner-border" role="status" />
});

const DynamicImageGallery = ({ 
  images = [], 
  title = "Gallery",
  maxInitialLoad = 6,
  loadMoreCount = 6,
  className = "",
  showLightbox = true
}) => {
  const [visibleImages, setVisibleImages] = useState([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { preloadImages } = useImageCache();

  // Initialize with first batch of images
  useEffect(() => {
    const initialImages = images.slice(0, maxInitialLoad);
    setVisibleImages(initialImages);
    setLoadedCount(maxInitialLoad);
    
    // Preload next batch
    if (images.length > maxInitialLoad) {
      const nextBatch = images.slice(maxInitialLoad, maxInitialLoad + loadMoreCount);
      preloadImages(nextBatch.map(img => img.src || img));
    }
  }, [images, maxInitialLoad, loadMoreCount, preloadImages]);

  // Load more images
  const loadMoreImages = useCallback(async () => {
    if (isLoading || loadedCount >= images.length) return;
    
    setIsLoading(true);
    
    try {
      const nextBatch = images.slice(loadedCount, loadedCount + loadMoreCount);
      
      // Preload images before showing them
      await preloadImages(nextBatch.map(img => img.src || img));
      
      // Add delay for smooth loading
      setTimeout(() => {
        setVisibleImages(prev => [...prev, ...nextBatch]);
        setLoadedCount(prev => prev + loadMoreCount);
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.warn('Failed to load more images:', error);
      setIsLoading(false);
    }
  }, [isLoading, loadedCount, images.length, loadMoreCount, preloadImages]);

  // Handle image click for lightbox
  const handleImageClick = (image, index) => {
    if (showLightbox) {
      setSelectedImage({ image, index });
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const hasMoreImages = loadedCount < images.length;

  return (
    <div className={`dynamic-image-gallery ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">{title}</h3>
        <span className="text-muted small">
          {visibleImages.length} of {images.length} images
        </span>
      </div>

      {/* Image Grid */}
      <div className="row g-3">
        {visibleImages.map((image, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <div 
              className="position-relative overflow-hidden rounded shadow-sm"
              style={{ aspectRatio: '1/1', cursor: showLightbox ? 'pointer' : 'default' }}
              onClick={() => handleImageClick(image, index)}
            >
              <LazyImage
                src={image.src || image}
                alt={image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover"
                quality={85}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              
              {/* Overlay for lightbox indication */}
              {showLightbox && (
                <div className="position-absolute top-0 end-0 p-2">
                  <i className="bi bi-zoom-in text-white bg-dark bg-opacity-50 rounded-circle p-1"></i>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreImages && (
        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary"
            onClick={loadMoreImages}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Loading...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i>
                Load More ({images.length - loadedCount} remaining)
              </>
            )}
          </button>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && showLightbox && (
        <ImageLightbox
          images={images}
          currentIndex={selectedImage.index}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default DynamicImageGallery;
