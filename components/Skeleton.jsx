"use client";
import React from 'react';

const Skeleton = ({ 
  width = "100%", 
  height = "20px", 
  borderRadius = "4px", 
  className = "",
  ...props 
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...props.style
      }}
      {...props}
    />
  );
};

export default Skeleton;
