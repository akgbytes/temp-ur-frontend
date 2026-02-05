"use client";
import React from 'react';
import Skeleton from './Skeleton';

const CitySkeleton = () => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="card h-100 shadow-sm border-0 bg-white overflow-hidden">
        {/* City image skeleton */}
        <div className="position-relative" style={{ height: "200px" }}>
          <Skeleton 
            width="100%" 
            height="100%" 
            className="skeleton-image"
          />
        </div>
        
        {/* City content skeleton */}
        <div className="card-body p-3">
          <Skeleton 
            width="80%" 
            height="20px" 
            className="skeleton-text mb-2"
          />
          <Skeleton 
            width="100%" 
            height="16px" 
            className="skeleton-text mb-1"
          />
          <Skeleton 
            width="60%" 
            height="16px" 
            className="skeleton-text"
          />
        </div>
      </div>
    </div>
  );
};

export default CitySkeleton;
