'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { citiesAPI, propertiesAPI } from "@/lib/api";

export default function CityDetailContent({ params }) {
  const [city, setCity] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [slug, setSlug] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 12;

  // Helper function to create slug from city name
  const createSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  // Fetch properties for the city
  const fetchCityProperties = async (cityName, page = 1) => {
    try {
      setPropertiesLoading(true);
      const response = await propertiesAPI.getAll({
        city: cityName,
        page: page,
        limit: propertiesPerPage
      });
      
      if (response.data) {
        setProperties(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalProperties(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching city properties:', error);
      setProperties([]);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);
        
        // Get slug from params
        const resolvedParams = await params;
        const currentSlug = resolvedParams.slug;
        setSlug(currentSlug);
        
        // Fetch cities
        const response = await citiesAPI.getAll();
        
        if (response.error) {
          console.error('Cities API error:', response.error);
          setCity(null);
        } else {
          const cities = response.data || [];
          
          // Find city by matching slug with city name
          let foundCity = null;
          
          if (Array.isArray(cities) && cities.length > 0) {
            foundCity = cities.find(city => createSlug(city.name) === currentSlug);
          }
          
          setCity(foundCity);
          
          // Fetch properties for this city
          if (foundCity) {
            await fetchCityProperties(foundCity.name, 1);
          }
        }
      } catch (error) {
        console.error('Error fetching city:', error);
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [params]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (city) {
      fetchCityProperties(city.name, page);
    }
    // Scroll to top of properties section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate smart pagination range (shows limited pages with ellipsis)
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    if (totalPages <= 1) return [1];
    
    // Generate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Build final range with dots
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="text-center py-5">
          <div className="spinner-border text-custom-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading city details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!city) {
    return (
      <div>
        <Header />
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="text-muted">City Not Found</h2>
          <p className="text-muted">The city you're looking for doesn't exist or has been removed.</p>
          <a href="/properties" className="btn btn-custom-primary">
            Browse All Properties
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      
      {/* Analytics Tracking */}
      <AnalyticsTracker 
        pageUrl={`/city/${slug}`}
        pageTitle={`Properties in ${city.name} | Urbanesta`}
      />
      
      {/* City Hero Section with Background */}
      <div className="city-hero-section position-relative" style={{ height: '75vh', minHeight: '500px' }}>
        <div className="city-hero-background position-absolute w-100 h-100">
          <Image 
            src={city.backgroundImage || city.citybackground} 
            alt={`${city.name} background`} 
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        
        {/* Dark overlay for better text readability */}
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))' 
        }}></div>
        
        {/* City Name Overlay - Bottom Left */}
        <div className="city-name-overlay position-absolute" style={{ 
          bottom: '2rem', 
          left: '2rem', 
          color: 'white',
          zIndex: 2
        }}>
          <h1 className="city-name display-3 fw-bold mb-3" style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontSize: 'clamp(2rem, 5vw, 4rem)'
          }}>
            {city.name}
          </h1>
          <p className="city-subtitle fs-5" style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)'
          }}>
            Discover the best properties in {city.name}
          </p>
        </div>
      </div>
      
      {/* Properties Section */}
      <div className="city-properties-section py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-5">Properties in {city.name}</h2>
              <p className="properties-description text-center mb-5">
                {totalProperties > 0 
                  ? `Discover ${totalProperties} premium properties in ${city.name}. Find your dream home or investment opportunity.`
                  : `Explore properties in ${city.name}. New listings are added regularly.`
                }
              </p>
              
              {/* Properties Grid */}
              {propertiesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-custom-primary" role="status">
                    <span className="visually-hidden">Loading properties...</span>
                  </div>
                  <p className="mt-2">Loading properties...</p>
                </div>
              ) : properties.length > 0 ? (
                <>
                  <div className="row g-3 g-md-4 mb-5">
                    {properties.map((property, index) => (
                      <div key={property._id || index} className="col-lg-4 col-md-6 col-12">
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Info */}
                  {totalPages > 1 && (
                    <div className="row mb-3">
                      <div className="col-12 text-center">
                        <p className="text-muted mb-0">
                          Showing page {currentPage} of {totalPages} 
                          ({totalProperties} properties total)
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center">
                      <nav aria-label="Properties pagination">
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          
                          {getPaginationRange().map((page, index) => (
                            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                              {page === '...' ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button 
                                  className="page-link" 
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}
                          
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-house-door text-muted" style={{ fontSize: '4rem' }}></i>
                  </div>
                  <h4 className="text-muted">No Properties Found</h4>
                  <p className="text-muted">
                    We don't have any properties listed in {city.name} at the moment. 
                    Check back soon for new listings!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
