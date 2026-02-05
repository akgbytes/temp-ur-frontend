import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import WatchlistButton from "@/components/WatchlistButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import Leadform from "@/components/Leadform";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import GetInTouchButton from "@/components/GetInTouchButton";
import ReadMoreDescription from "@/components/ReadMoreDescription";
import { LeadFormProvider } from "@/contexts/LeadFormContext";
import { propertiesAPI } from "@/lib/api";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ImageGalleryRow from "@/components/ImageGalleryRow";
import { formatPrice, formatPriceOnwards } from "@/utils/priceFormatter";
import PropertyCard from "@/components/PropertyCard";
import PhoneLink from "@/components/PhoneLink";
import UnitCard from "@/components/UnitCard";
import MasterPlanImage from "@/components/MasterPlanImage";

// Fetch builder's properties
async function getBuilderProperties(builderId, currentPropertyId) {
  try {
    const response = await propertiesAPI.getAll({ builder: builderId });
    
    if (response.error) {
      return [];
    }
    
    // Handle different response formats
    let properties = [];
    if (response.data && Array.isArray(response.data)) {
      properties = response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      properties = response.data.data;
    }
    
    // Filter out the current property and limit to 4 properties
    return properties
      .filter(prop => prop._id !== currentPropertyId)
      .slice(0, 4);
  } catch (error) {
    return [];
  }
}

// Builder Properties Section Component
async function BuilderPropertiesSection({ builderId, builderName, builderSlug, currentPropertyId }) {
  const properties = await getBuilderProperties(builderId, currentPropertyId);
  
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-5">
      <div className="container">
        {/* Builder Icon */}
        <div className="text-center mb-4">
          <div 
            className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto"
            style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#f39c12'
            }}
          >
            <i className="bi bi-building text-white" style={{ fontSize: '2.5rem' }}></i>
          </div>
        </div>

        {/* Label */}
        <div className="text-center mb-2">
          <span className="text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.875rem', color: '#f39c12' }}>
            RELATED PROJECTS
          </span>
        </div>

        {/* Heading */}
        <h2 className="h3 fw-bold text-center text-dark mb-5">
          Properties by {builderName}
        </h2>

        {/* Properties Grid */}
        <div className="row g-4 mb-5">
          {properties.map((property) => (
            <div key={property._id} className="col-lg-3 col-md-6">
              <PropertyCard property={property} showBuilder={false} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link 
            href={`/builder/${builderSlug}`}
            className="btn btn-lg fw-bold px-5 py-3 rounded-pill"
            style={{ 
              backgroundColor: '#f39c12',
              color: '#fff',
              border: 'none',
              transition: 'all 0.3s ease'
            }}
          >
            View All Projects
            <i className="bi bi-chevron-down ms-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Basic SEO metadata for property page
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);
  
  if (!property) {
    return {
      title: 'Property Not Found | Urbanesta',
      description: 'The property you are looking for could not be found.',
    };
  }

  const title = `${property.projectName || property.title} - ${property.city?.name || 'Property'} | Urbanesta`;
  const description = property.description || 
    `Find ${property.projectName || property.title} in ${property.city?.name || 'your preferred location'}. ${property.propertyAction || 'For Sale'} at Urbanesta.`;
  
  return {
    title,
    description,
  };
}

// Fetch property from API
async function getProperty(id) {
  try {
    // Use the propertiesAPI which handles environment configuration automatically
    const response = await propertiesAPI.getById(id);
    
    if (response.error) {
      return null;
    }
    
    // Handle different response formats
    if (response.data && response.data.success && response.data.data) {
      // Backend API response format: { success: true, data: {...} }
      return response.data.data;
    } else if (response.data && response.data._id) {
      // Direct property object in data
      return response.data;
    } else if (response._id) {
      // Direct property object
      return response;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Main property detail component
function PropertyDetailContent({ property }) {
  const isBuilder = property.type === 'builder';
  const isRegular = property.type === 'regular';

  // Regular property layout (simple)
  if (isRegular) {
    const mainImage = property.projectImages?.[0] || property.displayImage || '/img/heroImage.jpg';
    const otherImages = property.projectImages?.slice(1) || [];

    return (
      <>
        <Header />
        
        {/* Main Image Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="mb-4">
                  <Image
                    src={mainImage}
                    alt={property.title || 'Property Image'}
                    width={1200}
                    height={600}
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    priority
                  />
                </div>

                {/* Image Gallery Row */}
                <ImageGalleryRow 
                  images={otherImages} 
                  propertyTitle={property.title || 'Property'} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Property Details Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {/* Title */}
                <h1 className="display-5 fw-bold mb-4">{property.title}</h1>

                {/* Key Information */}
                <div className="row g-4 mb-5">
                  <div className="col-md-6">
                    <div className="border rounded-3 p-4">
                      <h6 className="fw-bold text-primary mb-2">Price</h6>
                      <p className="fs-4 fw-bold mb-0">{formatPrice(property.price)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded-3 p-4">
                      <h6 className="fw-bold text-primary mb-2">Property Type</h6>
                      <p className="mb-0">{property.category?.name || property.subcategoryName || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <div className="mb-5">
                    <h2 className="h4 fw-bold mb-3">Description</h2>
                    <ReadMoreDescription 
                      description={property.description} 
                      maxLines={10}
                    />
                  </div>
                )}

                {/* Location Details */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <div className="border rounded-3 p-3">
                      <h6 className="fw-bold text-primary mb-3">
                        <i className="bi bi-geo-alt-fill me-2"></i>Location Details
                      </h6>
                      <div>
                        {(() => {
                          const parts = [];
                          if (property.city?.name) {
                            parts.push(`City: ${property.city.name}`);
                          }
                          if (property.locality?.name) {
                            parts.push(`Locality: ${property.locality.name}`);
                          }
                          if (property.fullAddress) {
                            parts.push(property.fullAddress);
                          }
                          return parts.length > 0 ? (
                            <p className="mb-0">{parts.join(', ')}</p>
                          ) : (
                            <p className="text-muted mb-0">Location information not available</p>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                  {property.area && (
                    <div className="col-md-6">
                      <div className="border rounded-3 p-3">
                        <h6 className="fw-bold text-primary mb-2">Area</h6>
                        <p className="mb-0">{property.area}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-3 mb-5">
                  <GetInTouchButton />
                  <WatchlistButton 
                    propertyId={property._id}
                    className="btn btn-outline-primary"
                  />
                </div>

                {/* Lead Form */}
                <div className="border rounded-3 p-4 bg-light">
                  <h3 className="h5 fw-bold mb-3">Interested in this property?</h3>
                  <Leadform propertyId={property._id} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // Builder property layout (existing complex layout)
  return (
    <>
      <Header />
      
      {/* Hero Section - 100vh Wallpaper with Overlay */}
      <section 
        className="position-relative d-flex align-items-center justify-content-center"
        style={{ 
          height: '100vh',
          backgroundImage: `url(${property.wallpaperImage || property.projectImages?.[0] || '/img/heroImage.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay */}
        <div 
          className="position-absolute w-100 h-100"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1
          }}
        ></div>

        {/* Content Overlay */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-end mb-3 min-vh-100 ">
            <div className="checkred">
            <div className="col-lg-12 ">
              {/* Project Logo */}
              {property.projectLogo && (
                <div className="mb-4">
                  <Image
                    src={property.projectLogo}
                    alt={`${property.projectName || property.title} Logo`}
                    width={120}
                    height={60}
                    className="img-fluid"
                    style={{ maxHeight: '60px', objectFit: 'contain' }}
                  />
                </div>
              )}

              {/* Project Name */}
              <h1 className="display-4 fw-bold text-white mb-3">
                {isBuilder ? property.projectName : property.title}
              </h1>

              {/* Full Address - Below Project Name */}
              <div className="mb-5">
                <div className="d-flex align-items-center">
                  <i className="bi bi-geo-alt-fill me-2 fs-5 text-white"></i>
                  <p className="text-white mb-0 fs-5">{property.fullAddress}</p>
                </div>
              </div>

              {/* Combined Information Tile - Near Bottom */}
              <div className="mt-auto">
                <div 
                  className="rounded-4 p-4 mb-4"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Key Information Grid */}
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-warning">{formatPriceOnwards(property.price)}</div>
                        <small className="text-white-50">Starting Price</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-white">{property.possessionDate || 'TBA'}</div>
                        <small className="text-white-50">Possession Date</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="fs-6 fw-bold text-white">{property.reraNo || 'N/A'}</div>
                        <small className="text-white-50">RERA No</small>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-white">{property.about || 'N/A'}</div>
                        <small className="text-white-50">About</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Panel */}
            {/* <div className="col-lg-4">

              <div className="bg-white rounded-4 p-4 shadow-lg">
                <div className="d-flex align-items-center mb-3">
                  {property.builder?.name && (
                    <div className="me-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: '#000',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        {property.builder.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div>
                    <h6 className="fw-bold mb-1">{property.builder?.name || 'Builder'}</h6>
                    <p className="text-muted mb-0 small">Verified Builder</p>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button className="btn btn-warning btn-lg fw-bold">
                    <i className="bi bi-telephone me-2"></i>Contact Now
                  </button>
                  <WatchlistButton 
                    propertyId={property._id}
                    className="btn btn-outline-primary"
                  />
                </div>
              </div>
            </div> */}
            </div>
            {/* here it ends */}

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              {property.descriptionImage && (
                <Image
                  src={property.descriptionImage}
                  alt={`${property.projectName || property.title} Description`}
                  width={600}
                  height={400}
                  className="img-fluid rounded-3 shadow"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="col-lg-6">
              <h2 className="h3 fw-bold mb-4">About This Project</h2>
              <ReadMoreDescription 
                description={property.description || property.about || 'No description available for this project.'} 
                maxLines={12}
              />
              
              {/* Additional Details */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="border rounded-3 p-3">
                    <h6 className="fw-bold text-primary mb-1">Land Area</h6>
                    <p className="mb-0">{property.landArea || 'N/A'}</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="border rounded-3 p-3">
                    <h6 className="fw-bold text-primary mb-1">Property Type</h6>
                    <p className="mb-0">{property.category?.name || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Get in Touch Button */}
              <GetInTouchButton />
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="h3 fw-bold text-center mb-5">Project Gallery</h2>
          
          {property.projectImages && property.projectImages.length > 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div 
                  id="projectGalleryCarousel" 
                  className="carousel slide" 
                  data-bs-ride="carousel"
                  data-bs-interval="3000"
                >
                  {/* Carousel Indicators */}
                  <div className="carousel-indicators">
                    {property.projectImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target="#projectGalleryCarousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>

                  {/* Carousel Inner */}
                  <div className="carousel-inner rounded-3 shadow-lg overflow-hidden">
                    {property.projectImages.map((image, index) => (
                      <div 
                        key={index} 
                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                      >
                        <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                          <Image
                            src={image}
                            alt={`${property.projectName || property.title} - Image ${index + 1}`}
                            fill
                            className="d-block w-100"
                            style={{ objectFit: 'cover' }}
                            priority={index === 0}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Carousel Controls */}
                  <button 
                    className="carousel-control-prev" 
                    type="button" 
                    data-bs-target="#projectGalleryCarousel" 
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button 
                    className="carousel-control-next" 
                    type="button" 
                    data-bs-target="#projectGalleryCarousel" 
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>

                {/* Image Counter */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Showing {property.projectImages.length} images
                  </small>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-image display-1 text-muted"></i>
              <p className="text-muted mt-3">No images available for this project</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Highlights Section */}
      {property.highlights && property.highlights.length > 0 && (
        <section className="py-5">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Project Highlights</h2>
            <div className="row align-items-center">
              {/* Highlights List - Left Side */}
              <div className="col-lg-6">
                <div className="pe-lg-4">
                  {property.highlights.map((highlight, index) => (
                    <div key={index} className="d-flex align-items-start mb-4">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-2">
                          <i className="bi bi-star-fill text-primary fs-5"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">{highlight}</h6>
                        {/* <p className="text-muted small mb-0">
                          Experience this premium feature designed to enhance your lifestyle
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Highlight Image - Right Side */}
              <div className="col-lg-6">
                <div className="position-relative" style={{ minHeight: '400px' }}>
                  {property.highlightImage ? (
                    <Image
                      src={property.highlightImage}
                      alt="Project Highlights"
                      fill
                      className="img-fluid rounded-3 shadow-lg"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded-3">
                      <div className="text-center">
                        <i className="bi bi-image display-1 text-muted"></i>
                        <p className="text-muted mt-3">Highlight Image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Available Units Section */}
      {property.unitDetails && property.unitDetails.length > 0 && (
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Available Units</h2>
            <div className={`row g-4 ${property.unitDetails.length <= 2 ? 'justify-content-center' : ''}`}>
              {property.unitDetails.map((unit, index) => (
                <div key={index} className={property.unitDetails.length === 1 ? "col-lg-6 col-md-8" : "col-lg-4 col-md-6"}>
                  <UnitCard unit={unit} />
                </div>
              ))}
            </div>
            
            {/* Get in Touch Button */}
            <div className="mt-5">
              <GetInTouchButton />
            </div>
          </div>
        </section>
      )}

      {/* Amenities Section - Only for Residential Properties */}
      {property.category?.name?.toLowerCase() === 'residential' && (
      <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Amenities & Facilities</h2>
            <div className="row g-3">
            {/* Static Basic Amenities */}
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-shop text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Cafeteria / Food Court</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-battery-charging text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Power Backup</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-elevator text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Lift</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-shield-check text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Security</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-box-seam text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Service / Goods Lift</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-car-front text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Visitor Parking</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-trophy text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Gymnasium</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-droplet text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Rain Water Harvesting</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-snowflake text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Air Conditioned</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-shield-exclamation text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Earthquake Resistant</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-lock-fill text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Tier 3 Security System</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-rulers text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Large Open Space</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-door-open text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Grand Entrance Lobby</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-heart-fill text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Kid Play Area</h6>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                    <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-mic-fill text-warning fs-5"></i>
                      </div>
                    </div>
                    <div>
                  <h6 className="fw-bold mb-0">Event Space & Amphitheatre</h6>
                </div>
              </div>
                    </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center p-4 bg-white rounded-3 shadow-sm h-100 border border-warning border-2">
                <div className="flex-shrink-0 me-3">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-2">
                    <i className="bi bi-exclamation-circle text-warning fs-5"></i>
                  </div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Fire Fighting Equipment</h6>
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>
      )}

      {/* Connectivity & Location Section */}
      {(property.connectivityPoints && property.connectivityPoints.length > 0) || property.googleMapUrl ? (
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Connectivity & Location</h2>
            
            {/* Map Section */}
            {property.googleMapUrl && (
              <div className="row mb-5">
                <div className="col-12">
                  <div className="bg-white rounded-3 shadow-lg overflow-hidden">
                    <div className="p-4 border-bottom">
                      <h5 className="fw-bold mb-2">{property.fullAddress}</h5>
                      <p className="text-muted mb-0">Exact location and nearby landmarks</p>
                    </div>
                    <div style={{ height: '400px' }}>
                      <iframe
                        src={property.googleMapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`${property.projectName || property.title} Location Map`}
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connectivity Points */}
            {property.connectivityPoints && property.connectivityPoints.length > 0 && (
              <div className="row g-4">
                <div className="col-12">
                  <h4 className="h5 fw-bold mb-4">Key Connectivity Points</h4>
                </div>
                {property.connectivityPoints.map((point, index) => (
                  <div key={index} className="col-lg-6">
                    <div className="d-flex align-items-start p-4 bg-white rounded-3 shadow-sm h-100">
                      <div className="flex-shrink-0 me-3">
                        <div className="bg-success bg-opacity-10 rounded-circle p-2">
                          <i className="bi bi-geo-alt-fill text-success fs-5"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">{point}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Location Highlights Section */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* 24/7 Accessibility Card */}
            <div className="col-lg-4 col-md-6">
              <div className="h-100 p-4 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="mb-3">
                  <div 
                    className="rounded-3 d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#fff3cd',
                      border: '2px solid #ffc107'
                    }}
                  >
                    <i className="bi bi-clock-history text-warning fs-3"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">24/7 Accessibility</h5>
                <p className="text-muted mb-0">
                  Easy access to major highways and public transportation around the clock.
                </p>
              </div>
            </div>

            {/* Prime Location Card */}
            <div className="col-lg-4 col-md-6">
              <div className="h-100 p-4 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="mb-3">
                  <div 
                    className="rounded-3 d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#cfe2ff',
                      border: '2px solid #0d6efd'
                    }}
                  >
                    <i className="bi bi-geo-alt-fill text-primary fs-3"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">Prime Location</h5>
                <p className="text-muted mb-0">
                  Strategically positioned near key business districts and lifestyle destinations.
                </p>
              </div>
            </div>

            {/* Secure Neighborhood Card */}
            <div className="col-lg-4 col-md-6">
              <div className="h-100 p-4 rounded-3 border" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="mb-3">
                  <div 
                    className="rounded-3 d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: '#d1e7dd',
                      border: '2px solid #198754'
                    }}
                  >
                    <i className="bi bi-shield-check text-success fs-3"></i>
                  </div>
                </div>
                <h5 className="fw-bold mb-3">Secure Neighborhood</h5>
                <p className="text-muted mb-0">
                  Located in a safe and well-maintained community with 24/7 security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Plan Section */}
      {property.masterPlan && (
        <section className="py-5">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Master Plan</h2>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="bg-white rounded-3 shadow-lg p-4">
                  <MasterPlanImage 
                    masterPlan={property.masterPlan}
                    projectName={property.projectName || property.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Construction Details Section */}
      {property.constructionDetails && (
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="h3 fw-bold text-center mb-5">Construction Details</h2>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="bg-white rounded-3 shadow-sm p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="text-center p-3">
                        <h6 className="fw-bold text-primary mb-2">Construction Status</h6>
                        <span className="badge bg-warning fs-6 px-3 py-2">
                          {property.constructionDetails.status ? 
                            property.constructionDetails.status.charAt(0).toUpperCase() + 
                            property.constructionDetails.status.slice(1).replace('-', ' ') : 
                            'Under Construction'
                          }
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-center p-3">
                        <h6 className="fw-bold text-primary mb-2">RERA Registration</h6>
                        <p className="mb-0 small">{property.reraNo || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  {property.constructionDetails.reraDescription && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="fw-bold mb-2">RERA Information</h6>
                      <p className="mb-0 small text-muted">{property.constructionDetails.reraDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Get in Touch Button */}
            <div className="mt-5">
              <GetInTouchButton />
            </div>
          </div>
        </section>
      )}

      {/* About Builder Section */}
      {property.builder && (
        <section className="py-5 bg-light">
          <div className="container">
            {/* Builder Icon */}
            <div className="text-center mb-4">
              <div 
                className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto"
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#f39c12'
                }}
              >
                <i className="bi bi-building text-white" style={{ fontSize: '2.5rem' }}></i>
              </div>
            </div>

            {/* Developer Label */}
            <div className="text-center mb-2">
              <span className="text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.875rem', color: '#f39c12' }}>
                DEVELOPER
              </span>
            </div>

            {/* Builder Name */}
            <h2 className="h3 fw-bold text-center text-dark mb-5">
              About {property.builder?.name || 'Builder'}
            </h2>

            {/* Builder Description */}
            {property.builder?.description && (
              <div className="row justify-content-center mb-5">
                <div className="col-lg-10">
                  <div 
                    className="p-4 rounded-3 bg-white shadow-sm"
                    style={{ 
                      border: '1px solid #e9ecef'
                    }}
                  >
                    <p className="text-muted mb-0" style={{ lineHeight: '1.8' }}>
                      {property.builder.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Builder Features - 3 Column Grid */}
            <div className="row g-4">
              {/* Quality Assurance */}
              <div className="col-lg-4 col-md-6">
                <div 
                  className="text-center p-4 rounded-3 h-100 bg-white shadow-sm"
                  style={{ 
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div className="mb-3">
                    <div 
                      className="rounded-3 d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#3498db'
                      }}
                    >
                      <i className="bi bi-patch-check text-white" style={{ fontSize: '1.75rem' }}></i>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">Quality Assurance</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    Premium construction standards
                  </p>
                </div>
              </div>

              {/* Timely Delivery */}
              <div className="col-lg-4 col-md-6">
                <div 
                  className="text-center p-4 rounded-3 h-100 bg-white shadow-sm"
                  style={{ 
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div className="mb-3">
                    <div 
                      className="rounded-3 d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#2ecc71'
                      }}
                    >
                      <i className="bi bi-clock-history text-white" style={{ fontSize: '1.75rem' }}></i>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">Timely Delivery</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    On-time project completion
                  </p>
                </div>
              </div>

              {/* Customer Focus */}
              <div className="col-lg-4 col-md-6">
                <div 
                  className="text-center p-4 rounded-3 h-100 bg-white shadow-sm"
                  style={{ 
                    border: '1px solid #e9ecef'
                  }}
                >
                  <div className="mb-3">
                    <div 
                      className="rounded-3 d-inline-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        backgroundColor: '#9b59b6'
                      }}
                    >
                      <i className="bi bi-people text-white" style={{ fontSize: '1.75rem' }}></i>
                    </div>
                  </div>
                  <h5 className="fw-bold text-dark mb-3">Customer Focus</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    Dedicated customer service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects by Builder */}
      {property.builder && property.builder._id && (
        <BuilderPropertiesSection 
          builderId={property.builder._id} 
          builderName={property.builder.name}
          builderSlug={property.builder.slug}
          currentPropertyId={property._id}
        />
      )}

      {/* Still Have Questions & Enquire Now Section */}
      <section className="py-5 bg-light" style={{ paddingBottom: '0 !important' }}>
        <div className="container pb-5">
          {/* Still Have Questions Card */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div 
                className="d-flex flex-column flex-md-row align-items-center justify-content-between p-4 rounded-3 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex align-items-start mb-3 mb-md-0">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#f39c12'
                    }}
                  >
                    <i className="bi bi-chat-dots text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#f39c12' }}>Still Have Questions?</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      Our expert team is here to help you with any additional questions about {property.projectName || property.title}. Get personalized assistance and detailed project information.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <GetInTouchButton />
                </div>
              </div>
            </div>
          </div>

          {/* Trusted Badge */}
          <div className="text-center mb-4">
            <span 
              className="badge px-4 py-2 rounded-pill"
              style={{ 
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                border: '1px solid rgba(243, 156, 18, 0.3)',
                color: '#f39c12',
                fontSize: '0.875rem'
              }}
            >
              <i className="bi bi-star-fill me-2"></i>
              Trusted by 10,000+ Customers
            </span>
          </div>

          {/* Enquire Now Heading */}
          <h2 className="display-5 fw-bold text-dark text-center mb-5">
            Enquire Now
          </h2>

          {/* Phone Number Display */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6">
              <PhoneLink />
            </div>
          </div>

          {/* Features Grid - 2x2 */}
          <div className="row g-4 mb-5">
            {/* 100% Secure */}
            <div className="col-lg-3 col-md-6">
              <div 
                className="p-4 rounded-3 h-100 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#2ecc71'
                    }}
                  >
                    <i className="bi bi-shield-check text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-2">100% Secure</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                      Your data is protected with bank-level security
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div className="col-lg-3 col-md-6">
              <div 
                className="p-4 rounded-3 h-100 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#3498db'
                    }}
                  >
                    <i className="bi bi-clock-history text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-2">Quick Response</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                      Get callback within 5 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Guidance */}
            <div className="col-lg-3 col-md-6">
              <div 
                className="p-4 rounded-3 h-100 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#f39c12'
                    }}
                  >
                    <i className="bi bi-people-fill text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-2">Expert Guidance</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                      Certified property consultants
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Service */}
            <div className="col-lg-3 col-md-6">
              <div 
                className="p-4 rounded-3 h-100 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      backgroundColor: '#9b59b6'
                    }}
                  >
                    <i className="bi bi-star-fill text-white" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-2">Premium Service</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                      Exclusive property deals & insights
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div 
                className="p-4 rounded-3 bg-white shadow-sm"
                style={{ 
                  border: '1px solid #e9ecef'
                }}
              >
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem', lineHeight: '1.6' }}>
                  <strong className="text-dark">Disclaimer:</strong> The information provided on this project page is shared only for general awareness and user understanding. It does not represent any offer, commitment, warranty, or endorsement. Project details are gathered from publicly available sources such as State RERA websites, official builder portals, and documents shared by authorized channel partners, including brochures, price lists, and payment plans. The platform presents this information in a simplified format to help users with research and comparison. It does not own or control the content. Buyers are strongly advised to verify all project details, approvals, pricing, and terms directly with the builder or promoter before making any purchase decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Client-side components */}
      <PropertyDetailClient property={property} />
    </>
  );
}

// Main component that fetches data and renders the client component
export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return (
      <>
        <Header />
        <div className="container mt-5 pt-5 text-center">
          <h2>Property Not Found</h2>
          <Link href="/properties" className="btn btn-custom-primary mt-3">
            Back to Properties
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.projectName || property.title,
    "description": property.description || property.about,
    "url": `https://urbanesta.in/properties/${property._id}`,
    "image": property.wallpaperImage || property.projectImages?.[0] || 'https://urbanesta.in/img/heroImage.jpg',
    "price": property.price ? {
      "@type": "PriceSpecification",
      "price": property.price,
      "priceCurrency": "INR"
    } : undefined,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.fullAddress || property.location,
      "addressLocality": property.city?.name,
      "addressCountry": "IN"
    },
    "offers": {
      "@type": "Offer",
      "availability": property.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "price": property.price,
      "priceCurrency": "INR"
    },
    "floorSize": property.area ? {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "SQM"
    } : undefined,
    "numberOfRooms": property.unitDetails?.[0]?.unitType || undefined,
    "amenityFeature": property.highlights?.map(highlight => ({
      "@type": "LocationFeatureSpecification",
      "name": highlight
    })) || [],
    "geo": property.googleMapUrl ? {
      "@type": "GeoCoordinates",
      "url": property.googleMapUrl
    } : undefined
  };

  return (
    <LeadFormProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnalyticsTracker 
        pageUrl={`/properties/${property._id}`}
        pageTitle={`${property.projectName || property.title} - ${property.city?.name || 'Property'} | Urbanesta`}
        propertyId={property._id}
      />
      <PropertyDetailContent property={property} />
    </LeadFormProvider>
  );
}