"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MobileNav() {
  const router = useRouter();

  const handleSearchClick = () => {
    // Direct redirect to properties page
    router.push("/properties");
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="d-none d-lg-none fixed-bottom bg-white border-top shadow-lg" style={{ zIndex: 1000 }}>
        <div className="container-fluid px-0">
          <div className="row g-0">
            {/* Home Button */}
            <div className="col-3">
              <Link 
                href="/" 
                className="btn btn-link w-100 py-3 d-flex flex-column align-items-center text-decoration-none"
                style={{ 
                  color: '#6c757d',
                  border: 'none',
                  borderRadius: 0
                }}
              >
                <i className="bi bi-house-fill" style={{ fontSize: '20px' }}></i>
                <small className="mt-1" style={{ fontSize: '10px' }}>Home</small>
              </Link>
            </div>

            {/* Search Button */}
            <div className="col-3">
              <button 
                className="btn btn-link w-100 py-3 d-flex flex-column align-items-center text-decoration-none"
                onClick={handleSearchClick}
                style={{ 
                  color: '#6c757d',
                  border: 'none',
                  borderRadius: 0
                }}
              >
                <i className="bi bi-search" style={{ fontSize: '20px' }}></i>
                <small className="mt-1" style={{ fontSize: '10px' }}>Search</small>
              </button>
            </div>

            {/* Post Property Button */}
            <div className="col-3">
              <Link 
                href="/postaproperty" 
                className="btn btn-link w-100 py-3 d-flex flex-column align-items-center text-decoration-none"
                style={{ 
                  color: '#6c757d',
                  border: 'none',
                  borderRadius: 0
                }}
              >
                <i className="bi bi-plus-circle-fill" style={{ fontSize: '20px' }}></i>
                <small className="mt-1" style={{ fontSize: '10px' }}>Post</small>
              </Link>
            </div>

            {/* Profile Button */}
            <div className="col-3">
              <Link 
                href="/user" 
                className="btn btn-link w-100 py-3 d-flex flex-column align-items-center text-decoration-none"
                style={{ 
                  color: '#6c757d',
                  border: 'none',
                  borderRadius: 0
                }}
              >
                <i className="bi bi-person-fill" style={{ fontSize: '20px' }}></i>
                <small className="mt-1" style={{ fontSize: '10px' }}>Profile</small>
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* Add bottom padding to body to prevent content from being hidden behind mobile nav */}
      <style jsx global>{`
        @media (max-width: 991.98px) {
          /* Remove body padding to prevent white space below footer */
          body {
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          
          /* Add padding to main content area instead of body */
          main, #__next > div:first-child {
            padding-bottom: 80px !important;
          }
          
          /* Ensure footer has no extra space and sits at bottom */
          footer {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
            position: relative;
            z-index: 1;
          }
          
          /* Ensure no white space after footer */
          footer::after {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
