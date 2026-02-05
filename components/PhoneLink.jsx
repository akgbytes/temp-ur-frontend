'use client';

import React from 'react';

const PhoneLink = () => {
  return (
    <>
      <style jsx>{`
        .phone-link-hover {
          background-color: #fff;
          border: 1px solid #e9ecef;
          transition: all 0.3s ease;
        }
        .phone-link-hover:hover {
          background-color: #f8f9fa;
          border-color: #f39c12;
          box-shadow: 0 4px 12px rgba(243, 156, 18, 0.15);
        }
      `}</style>
      <a 
        href="tel:8886589000"
        className="phone-link-hover d-flex align-items-center justify-content-center p-4 rounded-3 text-decoration-none shadow-sm"
      >
        <div 
          className="rounded-circle d-flex align-items-center justify-content-center me-3"
          style={{ 
            width: '50px', 
            height: '50px', 
            backgroundColor: '#f39c12'
          }}
        >
          <i className="bi bi-telephone-fill text-white" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <span className="fw-bold" style={{ fontSize: '2rem', color: '#f39c12' }}>
          88865 89000
        </span>
      </a>
    </>
  );
};

export default PhoneLink;

