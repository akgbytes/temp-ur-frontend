'use client';

import React, { useState, memo, useCallback } from "react";
import Link from "next/link";
import LazyImage from "./LazyImage";
import WatchlistButton from "./WatchlistButton";
import { formatPrice, formatPriceOnwards } from "@/utils/priceFormatter";

const PropertyCard = memo(({ property, className = "", showBuilder = true }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!property) return null;

  // Determine display values based on property type
  const displayPrice = property.type === 'builder' 
    ? formatPriceOnwards(property.price)
    : formatPrice(property.price);

  const displayImage = property.type === 'builder' 
    ? property.wallpaperImage || property.displayImage || property.projectImages?.[0] || '/img/heroImage.jpg'
    : property.displayImage || property.projectImages?.[0] || '/img/heroImage.jpg';

  const displayTitle = property.type === 'builder' 
    ? property.projectName || property.title
    : property.title;

  // Helper function to check if a value is an ObjectId (MongoDB ID format)
  const isObjectId = (value) => {
    if (!value || typeof value !== 'string') return false;
    // ObjectId is 24 character hex string
    return /^[0-9a-fA-F]{24}$/.test(value);
  };

  // Full address construction - check multiple fields
  const getFullAddress = () => {
    // If fullAddress exists and is not an ObjectId, use it
    if (property.fullAddress && !isObjectId(property.fullAddress)) {
      return property.fullAddress;
    }
    
    // Otherwise, build from city, locality, location
    const addressParts = [];
    
    // Check locality - only if it has a name property or is a valid string (not ObjectId)
    if (property.locality?.name) {
      addressParts.push(property.locality.name);
    } else if (property.locality && typeof property.locality === 'string' && !isObjectId(property.locality)) {
      addressParts.push(property.locality);
    }
    
    // Check location - only if it's a valid string (not ObjectId)
    if (property.location && typeof property.location === 'string' && !isObjectId(property.location)) {
      addressParts.push(property.location);
    }
    
    // Check city - only if it has a name property or is a valid string (not ObjectId)
    if (property.city?.name) {
      addressParts.push(property.city.name);
    } else if (property.city && typeof property.city === 'string' && !isObjectId(property.city)) {
      addressParts.push(property.city);
    }
    
    return addressParts.length > 0 ? addressParts.join(', ') : null;
  };

  const fullAddress = getFullAddress();

  // Property status from API
  const propertyStatus = property.constructionDetails?.status || 'AVAILABLE';

  // Configuration display from selectedConfigurations array
  const getConfiguration = () => {
    if (!property.selectedConfigurations || !Array.isArray(property.selectedConfigurations)) {
      return null;
    }
    
    // Filter only enabled configurations
    const enabledConfigs = property.selectedConfigurations
      .filter(config => config.isEnabled === true)
      .map(config => config.type);
    
    // Return null if no configurations available
    if (enabledConfigs.length === 0) {
      return null;
    }
    
    // Format as "3 BHK | 4 BHk"
    return enabledConfigs.join(' | ');
  };

  const configuration = getConfiguration();

  // Get subcategory name for display when no configuration
  const getSubcategoryName = () => {
    if (property.subcategoryName && typeof property.subcategoryName === 'string') {
      return property.subcategoryName;
    }
    return null;
  };

  const subcategoryName = getSubcategoryName();

  // Get category name
  const getCategoryName = () => {
    if (property.category?.name) {
      return property.category.name;
    }
    if (property.category && typeof property.category === 'string' && !isObjectId(property.category)) {
      return property.category;
    }
    if (property.subcategoryName && typeof property.subcategoryName === 'string') {
      return property.subcategoryName;
    }
    return null;
  };

  const categoryName = getCategoryName();

  // Handle favorite toggle
  const handleFavoriteToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you can add API call to update wishlist
  }, [isFavorite]);

  // Optimize mouse event handlers
  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
  }, []);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '';
  }, []);

  return (
    <Link href={`/properties/${property._id}`} className={`text-decoration-none ${className}`}>
      <div className="card property-card shadow-sm border-0 rounded-3 h-100 hover-effect d-flex flex-column" style={{ 
        maxWidth: '350px',
        width: '100%'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
        {/* Large Image Section - Fixed Height */}
        <div className="position-relative overflow-hidden" style={{ height: '250px', flexShrink: 0 }}>
          <LazyImage 
            src={displayImage} 
            className="card-img-top rounded-top-3 property-image" 
            alt={displayTitle}
            width={400}
            height={250}
            style={{ 
              objectFit: 'cover', 
              width: '100%', 
              height: '100%',
              display: 'block'
            }}
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Property Status overlay on image - top right - Only for builder properties */}
          {property.type === 'builder' && (
            <div className="position-absolute top-0 end-0 m-3">
              <span className="badge bg-primary text-white rounded-pill px-2 py-1" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                <i className="bi bi-star-fill" style={{ fontSize: '0.6rem' }}></i>
                <span className="ms-1">{propertyStatus}</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Content Section - Fixed Height with Flexbox */}
        <div className="card-body p-3 d-flex flex-column" style={{ 
          minHeight: '180px',
          flexGrow: 1
        }}>
          {/* Location and Watchlist Button - Fixed Height */}
          <div className="d-flex justify-content-between align-items-start mb-2" style={{ minHeight: '40px' }}>
            {fullAddress ? (
              <small className="text-muted fw-medium" style={{ 
                fontSize: '0.875rem',
                lineHeight: '1.4',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                flex: 1,
                marginRight: '8px'
              }}>
                {fullAddress}
              </small>
            ) : (
              <div style={{ flex: 1 }}></div>
            )}
            <WatchlistButton 
              propertyId={property._id}
              className="btn-sm"
              size="sm"
              style={{ flexShrink: 0 }}
            />
          </div>

          {/* Property Title - Fixed Height */}
          <div className="mb-2" style={{ minHeight: '32px' }}>
            <h6 className="fs-5 fw-bold text-dark mb-0" style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.4',
              minHeight: '32px'
            }}>
              {displayTitle}
            </h6>
          </div>

          {/* Configuration or Subcategory - Fixed Height (always reserves space) */}
          <div className="mb-2" style={{ minHeight: '24px' }}>
            {configuration ? (
              <small className="text-muted fw-medium" style={{ 
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block'
              }}>
                {configuration}
              </small>
            ) : subcategoryName ? (
              <small className="text-muted fw-medium" style={{ 
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                fontStyle: 'italic'
              }}>
                {subcategoryName}
              </small>
            ) : (
              <div style={{ height: '24px' }}></div>
            )}
          </div>

          {/* Category Badge - Below Configuration */}
          {categoryName && (
            <div className="mb-3">
              <span className="badge rounded-pill px-3 py-1" style={{
                backgroundColor: '#e7f3ff',
                color: '#0046be',
                fontSize: '0.75rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                border: '1px solid #b3d9ff'
              }}>
                {categoryName}
              </span>
            </div>
          )}

          {/* Price - Fixed at Bottom */}
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div className="text-primary fw-bold" style={{ fontSize: '1.25rem' }}>
              {displayPrice}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if property ID or className changes
  return prevProps.property?._id === nextProps.property?._id && 
         prevProps.className === nextProps.className &&
         prevProps.showBuilder === nextProps.showBuilder;
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
