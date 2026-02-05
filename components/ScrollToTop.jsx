"use client";
import React, { useState, useEffect } from 'react';
import { rafThrottle } from '@/utils/performanceUtils';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Throttled scroll handler for performance
    const handleScroll = rafThrottle(() => {
      // Show button when user scrolls down 300px
      if (typeof window !== 'undefined') {
        setIsVisible(window.scrollY > 300);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMounted]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Don't render on server or if not visible
  if (!isMounted || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="btn btn-primary rounded-circle shadow-lg position-fixed"
      style={{
        bottom: '100px',
        right: '20px',
        width: '50px',
        height: '50px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.8)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      aria-label="Scroll to top"
      title="Back to top"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 70, 190, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <i className="bi bi-arrow-up fs-5"></i>
    </button>
  );
};

export default ScrollToTop;

