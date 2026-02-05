'use client';

import React, { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { buildersAPI, propertiesAPI } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import BuilderSkeleton from "@/components/BuilderSkeleton";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default function BuilderDetailContent({ params }) {
  const [builder, setBuilder] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [slug, setSlug] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 12;

  // Fetch builder properties with pagination
  const fetchBuilderProperties = async (builderId, page = 1) => {
    try {
      setPropertiesLoading(true);
      
      // Fetch properties filtered by builder ID with pagination
      const propertiesResponse = await propertiesAPI.getAll({ 
        builder: builderId,
        page: page,
        limit: propertiesPerPage
      });
      
      if (propertiesResponse.error) {
        console.error('Properties API error:', propertiesResponse.error);
        setProperties([]);
        setTotalPages(1);
        setTotalProperties(0);
        return;
      }

      // Extract properties and pagination info from response
      const responseData = propertiesResponse.data;
      const propertiesList = responseData?.data || responseData || [];
      const safeProperties = Array.isArray(propertiesList) ? propertiesList : [];
      
      // Get pagination info from response
      const paginationInfo = responseData?.pagination || {};
      const totalCount = paginationInfo.total || safeProperties.length;
      const totalPagesCount = paginationInfo.pages || Math.ceil(totalCount / propertiesPerPage);

      setProperties(safeProperties);
      setTotalPages(totalPagesCount);
      setTotalProperties(totalCount);
      
      console.log(`✅ Fetched ${safeProperties.length} properties for builder ${builderId} (page ${page}/${totalPagesCount}, total: ${totalCount})`);
      
    } catch (error) {
      console.error('Error fetching builder properties:', error);
      setProperties([]);
      setTotalPages(1);
      setTotalProperties(0);
    } finally {
      setPropertiesLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get slug from params
        const resolvedParams = await params;
        const currentSlug = resolvedParams.slug;
        setSlug(currentSlug);
        
        // Fetch builder
        const builderResponse = await buildersAPI.getBySlug(currentSlug);
        
        if (builderResponse.error) {
          console.error('Builder API error:', builderResponse.error);
          setBuilder(null);
        } else {
          const builderData = builderResponse.data || builderResponse;
          setBuilder(builderData);
          
          // If builder found, fetch their properties with pagination
          if (builderData && builderData._id) {
            console.log('Fetching properties for builder:', builderData.name, 'ID:', builderData._id);
            setCurrentPage(1); // Reset to page 1 when loading builder
            await fetchBuilderProperties(builderData._id, 1);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setBuilder(null);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Validate page number
    
    setCurrentPage(page);
    if (builder) {
      fetchBuilderProperties(builder._id, page);
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
        <Header/>
        <div className="text-center py-5">
          <div className="spinner-border spinner-custom-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading builder details...</p>
        </div>
        <Footer/>
      </div>
    );
  }

  if (!builder) {
    return (
      <div>
        <Header/>
        <p className="text-center mt-5">Builder not found</p>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <Header/>
      
      {/* Analytics Tracking */}
      <AnalyticsTracker 
        pageUrl={`/builder/${slug}`}
        pageTitle={`Properties by ${builder.name} | Urbanesta`}
      />
      
      {/* Hero Section with Background - 75% Screen Height */}
      <div className="builder-hero-section position-relative">
        <div className="builder-hero-background">
          {builder.backgroundImage && (
            <Image 
              src={builder.backgroundImage} 
              alt={`${builder.name} background`} 
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority
            />
          )}
        </div>
        
        {/* Builder Info Card - Blur Card with Transparent Background */}
        <div className="builder-info-overlay">
          <div className="builder-info-card">
            {/* Builder Name and Logo Row */}
            <div className="builder-header d-flex align-items-center justify-content-between">
              <h1 className="builder-name mb-0">{builder.name}</h1>
              <div className="builder-logo">
                {builder.logo && (
                  <Image 
                    src={builder.logo} 
                    alt={`${builder.name} logo`}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain", borderRadius: "5px" }}
                  />
                )}
              </div>
            </div>
            
            {/* Dynamic Info Row */}
            <div className="builder-details">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="detail-item">
                    <span className="detail-value">📍 {builder.headquarters || 'India'}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="detail-item">
                    <span className="detail-value">🏡 Established {builder.establishedYear || 'N/A'}</span>
                  </div>
                </div>
                <div className="col-md-5">
                 {builder.website && (
                    <Link 
                      href={builder.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                     🌎 Visit Website
                    </Link>
                 )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Properties Section */}
      <div className="builder-properties-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title text-center mb-3">Properties by {builder.name}</h2>
              
             
              
              <p className="properties-description text-center mb-5">
                {builder.description || `Discover premium properties and developments by ${builder.name}, 
                one of India's leading real estate developers. Explore luxury homes, 
                commercial spaces, and innovative projects that redefine modern living.`}
              </p>
              
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
            </div>
          </div>
          
          {/* Properties Grid */}
          <div className="row">
            {propertiesLoading ? (
              // Loading skeleton for properties
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="col-lg-4 col-md-6 mb-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="position-relative" style={{ height: '250px' }}>
                        <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '8px' }}></div>
                      </div>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="skeleton" style={{ width: '60%', height: '16px' }}></div>
                          <div className="skeleton rounded-circle" style={{ width: '32px', height: '32px' }}></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="skeleton" style={{ width: '70%', height: '20px' }}></div>
                          <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }}></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="skeleton" style={{ width: '50%', height: '18px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : properties.length > 0 ? (
              <>
                <div className="row g-3 g-md-4">
                  {properties.map((property) => (
                    <div key={property._id} className="col-lg-4 col-md-6 col-12">
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="col-12">
                    <div className="d-flex justify-content-center mt-5">
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
                  </div>
                )}
              </>
            ) : (
              <div className="col-12">
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-house-door" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                  </div>
                  <h4 className="text-muted">No Properties Available</h4>
                  <p className="text-muted">
                    {builder.name} currently has no properties listed. 
                    Please check back later for new developments.
                  </p>
                  <Link href="/properties" className="btn btn-custom-primary mt-3">
                    Browse All Properties
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}
