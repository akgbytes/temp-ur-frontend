"use client";

import React from "react";

function PropertyTypesInfo() {
  return (
    <section className="py-5 my-4 bg-light">
      <div className="container px-3 px-md-4">
        <div className="text-center">
          {/* Main Heading */}
          <h2 className="display-5 fw-bold mb-4" style={{ color: '#C84C4E' }}>
            Best Residential and Commercial Properties for You
          </h2>
          
          {/* Description */}
          <p className="lead text-muted mb-5 mx-auto" style={{ maxWidth: '900px' }}>
            Explore verified properties, affordable homes, ready-to-move flats, under-construction 
            apartments, and new residential projects from leading builders in India.
          </p>
          
          {/* Features Icons */}
          <div className="row justify-content-center g-4">
            {/* Trusted Developers */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" 
                  style={{ width: '50px', height: '50px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="#C84C4E" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                </div>
                <span className="fs-5 text-dark">Trusted Developers</span>
              </div>
            </div>
            
            {/* Quality Assured */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" 
                  style={{ width: '50px', height: '50px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="#C84C4E" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8z"/>
                  </svg>
                </div>
                <span className="fs-5 text-dark">Quality Assured</span>
              </div>
            </div>
            
            {/* Fast Delivery */}
            <div className="col-12 col-md-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm" 
                  style={{ width: '50px', height: '50px' }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="#C84C4E" 
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                  </svg>
                </div>
                <span className="fs-5 text-dark">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PropertyTypesInfo;

