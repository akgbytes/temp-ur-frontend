"use client";
import React from 'react';
import Skeleton from './Skeleton';

const BuilderSkeleton = () => {
  return (
    <div className="flex-shrink-0 builder-card-link">
      <div className="card h-100 border-0 shadow-sm overflow-hidden">
        {/* Image skeleton */}
        <div className="position-relative" style={{ height: "250px" }}>
          <Skeleton 
            width="100%" 
            height="100%" 
            className="skeleton-image"
          />
        </div>
        
        {/* Content skeleton */}
        <div className="card-body p-3">
          <div className="d-flex align-items-center mb-3">
            {/* Logo skeleton */}
            <Skeleton 
              width="40px" 
              height="40px" 
              className="skeleton-avatar me-3"
            />
            {/* Name skeleton */}
            <Skeleton 
              width="150px" 
              height="20px" 
              className="skeleton-text"
            />
          </div>
          
          {/* Description skeleton */}
          <Skeleton 
            width="100%" 
            height="16px" 
            className="skeleton-text mb-2"
          />
          <Skeleton 
            width="80%" 
            height="16px" 
            className="skeleton-text"
          />
        </div>
      </div>
    </div>
  );
};

export default BuilderSkeleton;
