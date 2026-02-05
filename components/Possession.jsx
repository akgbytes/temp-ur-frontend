"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProperties } from "@/contexts/PropertiesContext";

export default function Possession() {
  const router = useRouter();
  const { getPossessionStats, loading, error } = useProperties();
  const possessionStats = getPossessionStats();
  
  // Get only years that have properties from the database
  // Sort years in ascending order
  const years = Object.keys(possessionStats).sort((a, b) => parseInt(a) - parseInt(b));

  // Handle click on possession card
  const handlePossessionClick = (year) => {
    router.push(`/properties?possession=${year}`);
  };

  return (
    <section className="p-md-4 p-2 py-md-5 bg-light my-5">
      <div className="container px-3 px-md-0">
        <div className="text-center mb-4 mb-md-5">
          <h2 className="display-6 fw-bold text-dark mb-2">PROPERTIES BY POSSESSION</h2>
          <p className="text-muted mb-0">Find properties ready to move in by year</p>
        </div>

        {loading ? (
          <div
            className="d-flex"
            style={{
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="flex-shrink-0" style={{ width: '280px' }}>
                <div className="card" style={{ height: '200px' }}>
                  <div className="placeholder-glow">
                    <div className="card-body">
                      <div className="placeholder col-8 mb-2"></div>
                      <div className="placeholder col-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="text-danger">Failed to load possession data. Please try again later.</p>
          </div>
        ) : years.length > 0 ? (
          <div
            className="d-flex hide-scrollbar"
            style={{
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {years.map((year) => {
              const count = possessionStats[year] || 0;
              
              return (
                <div 
                  key={year} 
                  className="flex-shrink-0"
                  style={{ width: '280px' }}
                >
                  <div 
                    className="card h-100 border-0 shadow-sm hover-effect cursor-pointer"
                    onClick={() => handlePossessionClick(year)}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minHeight: '200px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-calendar-check-fill text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h5 className="fw-bold text-dark mb-2">Possession by {year}</h5>
                      <p className="text-muted mb-0">
                        <span className="badge bg-primary rounded-pill px-3 py-2">
                          {count} {count === 1 ? 'Property' : 'Properties'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No possession data available at the moment.</p>
          </div>
        )}

        {/* Optional: Add a "View All" button */}
        {!loading && !error && Object.keys(possessionStats).length > 0 && (
          <div className="text-center mt-4 mt-md-5">
            <Link 
              href="/properties" 
              className="btn btn-primary"
            >
              View All Properties
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

