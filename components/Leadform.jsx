"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth2Factor } from '@/contexts/Auth2FactorContext';

const Leadform = ({ property = null, onClose, autoShow = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: 'abc@gmail.com',
    city: '',
    propertyInterest: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const router = useRouter();
  const { user } = useAuth2Factor();

  // Show form after 10 seconds (only if autoShow is true)
  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    } else {
      // If not autoShow, show immediately when component mounts
      setIsVisible(true);
    }
  }, [autoShow]);

  // Auto-fill city if property data is available
  useEffect(() => {
    if (property?.city?.name) {
      setFormData(prev => ({
        ...prev,
        city: property.city.name,
        propertyInterest: property.projectName || property.title || ''
      }));
    }
  }, [property]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        city: user.city || prev.city
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.city) {
        setSubmitStatus('error');
        return;
      }

      // Submit lead data directly
      const leadData = {
        ...formData,
        propertyId: property?._id || null,
        propertyName: property?.projectName || property?.title || '',
        propertyUrl: (typeof window !== 'undefined' && window.location) ? window.location.href : '',
        source: 'property_page_popup',
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Lead submitted successfully:', responseData);
        setSubmitStatus('success');
        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        // Log the error but don't show it to user
        console.log('Lead submission failed, trying fallback without property URL');
        
        // Try to save without property URL if the main request fails
        const fallbackData = {
          ...formData,
          propertyId: property?._id || null,
          propertyName: property?.projectName || property?.title || '',
          // Remove propertyUrl from fallback
          source: 'property_page_popup',
          timestamp: new Date().toISOString()
        };

        try {
          const fallbackResponse = await fetch('/api/leads', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fallbackData),
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            console.log('✅ Lead submitted successfully (fallback):', fallbackData);
            setSubmitStatus('success');
            // Auto close after 3 seconds
            setTimeout(() => {
              handleClose();
            }, 3000);
          } else {
            setSubmitStatus('error');
          }
        } catch (fallbackError) {
          console.error('Fallback lead submission also failed:', fallbackError);
          setSubmitStatus('error');
        }
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10000,
        backdropFilter: 'blur(5px)'
      }}
    >
      <div 
        className="bg-white rounded-4 shadow-lg position-relative"
        style={{
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="btn btn-link position-absolute top-0 end-0 p-3"
          style={{ zIndex: 1 }}
        >
          <i className="bi bi-x-lg fs-4 text-muted"></i>
        </button>

        {/* Header */}
        <div className="p-4 pb-0">
          <div className="text-center mb-4">
            <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              <i className="bi bi-house-heart fs-3 text-white"></i>
            </div>
            <h4 className="fw-bold mb-2">Interested in This Property?</h4>
            <p className="text-muted mb-0">Get exclusive updates and personalized assistance</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          {submitStatus === 'success' ? (
            <div className="text-center py-4">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '60px', height: '60px' }}>
                <i className="bi bi-check-lg fs-3 text-white"></i>
              </div>
              <h5 className="fw-bold text-success mb-2">Thank You!</h5>
              <p className="text-muted">We'll get back to you within 24 hours with exclusive details about this property.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                {/* City */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your city"
                    required
                  />
                </div>

                {/* Property Interest */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Property Interest</label>
                  <input
                    type="text"
                    name="propertyInterest"
                    value={formData.propertyInterest}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Property name"
                    readOnly={!!property}
                  />
                </div>


                {/* Submit Button */}
                <div className="col-12">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-warning w-100 py-3 fw-bold"
                    style={{ fontSize: '16px' }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Get Property Details
                      </>
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="col-12">
                    <div className="alert alert-danger mb-0">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Something went wrong. Please try again or contact us directly.
                    </div>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="text-center">
            <small className="text-muted">
              <i className="bi bi-shield-check me-1"></i>
              Your information is secure and will not be shared with third parties.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leadform;