"use client";
import React from 'react';
import Skeleton from './Skeleton';

const FeaturedSkeleton = () => {
  return (
    <div className="mb-5">
      {/* Builder header skeleton */}
      <div className="d-flex align-items-center mb-3">
        <Skeleton 
          width="60px" 
          height="60px" 
          className="skeleton-image me-3"
        />
        <Skeleton 
          width="200px" 
          height="24px" 
          className="skeleton-text"
        />
        <div className="ms-auto">
          <Skeleton 
            width="80px" 
            height="32px" 
            className="skeleton-button"
          />
        </div>
      </div>
      
      {/* Property cards skeleton */}
      <div className="d-flex gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-shrink-0" style={{ width: "320px" }}>
            <div className="card h-100 border-0 shadow-sm">
              {/* Property image skeleton */}
              <Skeleton 
                width="100%" 
                height="200px" 
                className="skeleton-image"
              />
              
              {/* Property content skeleton */}
              <div className="card-body p-3">
                <Skeleton 
                  width="100%" 
                  height="18px" 
                  className="skeleton-text mb-2"
                />
                <Skeleton 
                  width="80%" 
                  height="16px" 
                  className="skeleton-text mb-2"
                />
                <Skeleton 
                  width="60%" 
                  height="16px" 
                  className="skeleton-text mb-3"
                />
                
                {/* Price skeleton */}
                <div className="d-flex justify-content-between align-items-center">
                  <Skeleton 
                    width="100px" 
                    height="20px" 
                    className="skeleton-text"
                  />
                  <Skeleton 
                    width="60px" 
                    height="32px" 
                    className="skeleton-button"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSkeleton;
