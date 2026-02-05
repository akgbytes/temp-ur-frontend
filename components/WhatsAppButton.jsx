"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

function WhatsAppButtonComponent({ property = null }) {
  const whatsappNumber = "918886589000"; // Urbanesta WhatsApp number
  const [currentProperty, setCurrentProperty] = useState(null);
  const [isPropertyPage, setIsPropertyPage] = useState(false);
  const pathname = usePathname();

  // Check if we're on a property page and fetch property data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const path = pathname || window.location.pathname;
    // Match property page URLs - support both ObjectId format and slug format
    const propertyMatch = path.match(/^\/properties\/([^/]+)$/);
    
    if (propertyMatch) {
      setIsPropertyPage(true);
      
      // Always fetch fresh property data when pathname changes
      // This ensures we get the current property, not a cached one
      const fetchPropertyData = async () => {
        try {
          const propertyId = propertyMatch[1];
          const response = await fetch(`/api/properties/${propertyId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setCurrentProperty(data.data);
            } else if (data.data && data.data._id) {
              // Handle case where data is directly in response
              setCurrentProperty(data.data);
            } else {
              // Clear property if fetch fails
              setCurrentProperty(null);
            }
          } else {
            setCurrentProperty(null);
          }
        } catch (error) {
          // Clear property on error
          setCurrentProperty(null);
        }
      };
      
      // Reset property data first, then fetch new one
      setCurrentProperty(null);
      fetchPropertyData();
    } else {
      setIsPropertyPage(false);
      setCurrentProperty(null); // Clear property when not on property page
    }
  }, [pathname]); // Only depend on pathname to trigger on route changes
  
  // Generate dynamic message based on property details - always use current page
  const generateMessage = async () => {
    // Always use current URL to get the property ID
    if (typeof window === 'undefined') {
      return "Hi! I'm interested in your properties in Gurgaon. Can you help me find the perfect home?";
    }
    
    const path = pathname || window.location.pathname;
    const propertyMatch = path.match(/^\/properties\/([^/]+)$/);
    
    if (!propertyMatch) {
      return "Hi! I'm interested in your properties in Gurgaon. Can you help me find the perfect home?";
    }
    
    const propertyId = propertyMatch[1];
    let propertyData = property || currentProperty;
    
    // If we don't have property data, fetch it now
    if (!propertyData) {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            propertyData = data.data;
          } else if (data.data && data.data._id) {
            propertyData = data.data;
          }
        }
      } catch (error) {
        // If fetch fails, use current URL
      }
    }
    
    // Use current page URL as fallback
    const propertyLink = window.location.href;
    const website = 'https://urbanesta.in';
    
    if (propertyData) {
      const propertyName = propertyData.projectName || propertyData.title || 'Property';
      const location = propertyData.fullAddress || propertyData.location || propertyData.city?.name || 'Gurgaon';
      
      return `Hi! I'm interested in your property:

 *${propertyName}*
 Location: ${location}
 Website: ${website}
 Property Link: ${propertyLink}

Can you help me with more details about this property?`;
    } else {
      // Fallback message with current URL
      return `Hi! I'm interested in a property I found on Urbanesta:

 Property Link: ${propertyLink}
 Website: ${website}

Can you help me with more details about this property?`;
    }
  };

  // Generate message on each click to ensure we have the latest property data
  const handleClick = async () => {
    const message = await generateMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Only show on property pages
  if (!isPropertyPage) {
    return null;
  }

  return (
    <div 
      className="position-fixed whatsapp-button-container"
      style={{
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
        title="Share property on WhatsApp"
      >
        <i className="bi bi-whatsapp"></i>
      </button>
    </div>
  );
}

// Export as dynamic component with no SSR to completely avoid hydration issues
const WhatsAppButton = dynamic(() => Promise.resolve(WhatsAppButtonComponent), {
  ssr: false,
  loading: () => null
});

export default WhatsAppButton;