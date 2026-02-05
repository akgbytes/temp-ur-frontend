"use client";
import React, { useState, useEffect, useCallback } from 'react';
import LazyImage from './LazyImage';

const ImageLightbox = ({ images, currentIndex = 0, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const goToPrevious = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex];

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ 
        zIndex: 9999, 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(5px)'
      }}
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        className="btn btn-outline-light position-absolute top-0 end-0 m-3"
        onClick={onClose}
        style={{ zIndex: 10000 }}
      >
        <i className="bi bi-x-lg"></i>
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            className="btn btn-outline-light position-absolute start-0 top-50 translate-middle-y ms-3"
            onClick={goToPrevious}
            style={{ zIndex: 10000 }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <button
            className="btn btn-outline-light position-absolute end-0 top-50 translate-middle-y me-3"
            onClick={goToNext}
            style={{ zIndex: 10000 }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="position-relative" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
        <LazyImage
          src={currentImage.src || currentImage}
          alt={currentImage.alt || `Gallery image ${activeIndex + 1}`}
          width={800}
          height={600}
          className="img-fluid rounded shadow-lg"
          priority
          quality={95}
        />
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div 
          className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
          style={{ zIndex: 10000 }}
        >
          <span className="badge bg-dark bg-opacity-75 fs-6">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div 
          className="position-absolute bottom-0 start-0 w-100 p-3"
          style={{ 
            zIndex: 10000,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
          }}
        >
          <div className="d-flex justify-content-center gap-2 overflow-auto">
            {images.slice(0, 10).map((image, index) => (
              <div
                key={index}
                className={`position-relative overflow-hidden rounded ${
                  index === activeIndex ? 'border border-light' : ''
                }`}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                onClick={() => setActiveIndex(index)}
              >
                <LazyImage
                  src={image.src || image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  quality={60}
                  sizes="60px"
                />
              </div>
            ))}
            {images.length > 10 && (
              <div className="d-flex align-items-center text-light small">
                +{images.length - 10} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
