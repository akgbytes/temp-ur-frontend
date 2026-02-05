"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect to homepage after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  return (
    <>
      <Header />
      <div 
        className="container-fluid d-flex align-items-center justify-content-center"
        style={{ 
          minHeight: '100vh', 
          marginTop: '80px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
        }}
      >
        <div className="container text-center py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                {/* Error Icon */}
                <div 
                  className="text-center py-5"
                  style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 50%, #a71e2a 100%)'
                  }}
                >
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '120px',
                      height: '120px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '4px solid rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <i className="bi bi-exclamation-triangle-fill text-white" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h1 className="display-1 fw-bold text-white mb-0">404</h1>
                </div>

                {/* Error Content */}
                <div className="card-body p-5">
                  <h2 className="fw-bold text-dark mb-3">Page Not Found</h2>
                  <p className="text-muted mb-4 fs-5">
                    Oops! The page you're looking for doesn't exist or has been moved.
                  </p>
                  
                  <div className="alert alert-info d-inline-block mb-4" role="alert">
                    <i className="bi bi-info-circle me-2"></i>
                    You will be redirected to the homepage in <strong>{countdown}</strong> {countdown === 1 ? 'second' : 'seconds'}...
                  </div>

                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                    <Link 
                      href="/" 
                      className="btn btn-danger btn-lg px-5"
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="bi bi-house-fill me-2"></i>
                      Go to Homepage
                    </Link>
                    <button 
                      onClick={() => router.back()} 
                      className="btn btn-outline-danger btn-lg px-5"
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>

                  {/* Quick Links */}
                  <div className="mt-5 pt-4 border-top">
                    <p className="text-muted small mb-3">Or explore our popular pages:</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <Link href="/properties" className="btn btn-sm btn-outline-primary">
                        Properties
                      </Link>
                      <Link href="/builder" className="btn btn-sm btn-outline-primary">
                        Builders
                      </Link>
                      <Link href="/city" className="btn btn-sm btn-outline-primary">
                        Cities
                      </Link>
                      <Link href="/about" className="btn btn-sm btn-outline-primary">
                        About Us
                      </Link>
                      <Link href="/contact-us" className="btn btn-sm btn-outline-primary">
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

