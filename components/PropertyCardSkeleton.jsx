"use client";
import React from 'react';

const PropertyCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="card property-card shadow-sm border-0 rounded-3 h-100" style={{ 
          maxWidth: '350px',
          width: '100%',
          pointerEvents: 'none'
        }}>
          {/* Image Skeleton */}
          <div className="skeleton-loader" style={{ height: '250px', borderRadius: '12px 12px 0 0' }} />
          
          {/* Card Body */}
          <div className="card-body p-3 d-flex flex-column" style={{ flex: 1 }}>
            {/* Title Skeleton */}
            <div className="skeleton-loader mb-2" style={{ height: '24px', width: '80%', borderRadius: '4px' }} />
            <div className="skeleton-loader mb-3" style={{ height: '20px', width: '60%', borderRadius: '4px' }} />
            
            {/* Location Skeleton */}
            <div className="skeleton-loader mb-3" style={{ height: '16px', width: '90%', borderRadius: '4px' }} />
            
            {/* Configuration Skeleton */}
            <div className="skeleton-loader mb-3" style={{ height: '20px', width: '50%', borderRadius: '4px' }} />
            
            {/* Category Badge Skeleton */}
            <div className="skeleton-loader mb-3" style={{ height: '30px', width: '100px', borderRadius: '15px' }} />
            
            {/* Price Section Skeleton */}
            <div className="mt-auto pt-3 border-top">
              <div className="d-flex justify-content-between align-items-center">
                <div className="skeleton-loader" style={{ height: '28px', width: '120px', borderRadius: '4px' }} />
                <div className="skeleton-loader" style={{ height: '36px', width: '36px', borderRadius: '50%' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PropertyCardSkeleton;

