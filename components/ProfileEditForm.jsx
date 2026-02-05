"use client";

import React, { useState, useEffect } from 'react';
import { useAuth2Factor } from '../contexts/Auth2FactorContext.js';
import { citiesAPI } from '../lib/api.js';

const ProfileEditForm = ({ onCancel, onSave }) => {
  const { user, updateUserProfile } = useAuth2Factor();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    email: ''
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data and cities
  useEffect(() => {
    if (user) {
      // User data loaded in ProfileEditForm
      setFormData({
        name: user.name || '',
        city: user.city || '',
        email: user.email || ''
      });
    }

    const loadCities = async () => {
      try {
        // Loading cities...
        const { data, error } = await citiesAPI.getAll();
        // Cities API response received
        
        if (data) {
          // Backend returns cities directly as array, not wrapped in success object
          const citiesArray = Array.isArray(data) ? data : [];
          // Setting cities data
          setCities(citiesArray);
        } else {
          console.error('Failed to load cities:', error);
          setCities([]);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        setCities([]);
      }
    };

    loadCities();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    if (!formData.city || formData.city.trim() === '') {
      newErrors.city = 'City is required';
    }

    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors
    
    try {
      // Updating profile with form data
      await updateUserProfile(formData);
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific error messages from backend
      if (error.message.includes('Email address is already in use')) {
        setErrors({ email: 'This email address is already in use by another account.' });
      } else if (error.message.includes('HTTP error! status: 500')) {
        setErrors({ submit: 'Server error. Please try again later.' });
      } else if (error.message.includes('HTTP error! status: 400')) {
        setErrors({ submit: 'Invalid data. Please check your inputs and try again.' });
      } else {
        setErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            {/* Header with Urbanesta Logo */}
            <div 
              className="text-white p-4 text-center"
              style={{
                background: 'linear-gradient(135deg, #dc3545 0%, #c82333 50%, #a71e2a 100%)'
              }}
            >
              <div className="d-flex align-items-center justify-content-center mb-3">
                <img
                  src="/img/logo.jpg"
                  alt="Urbanesta Logo"
                  width={40}
                  height={40}
                  className="rounded-circle me-3"
                  style={{ objectFit: 'cover' }}
                />
                <h4 className="mb-0 fw-bold">Edit Your Profile</h4>
              </div>
              <p className="mb-0 opacity-75">Update your personal information</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    <i className="bi bi-person-fill me-2 text-danger"></i>
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="city" className="form-label fw-bold">
                    <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                    City <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select form-select-lg ${errors.city ? 'is-invalid' : ''}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{ borderRadius: '10px' }}
                  >
                    <option value="">Select your city</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}, {city.state}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {errors.city}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    <i className="bi bi-envelope-fill me-2 text-danger"></i>
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    style={{ borderRadius: '10px' }}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      {errors.email}
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{errors.submit}</div>
                  </div>
                )}

                <div className="d-grid gap-3">
                  <button
                    type="submit"
                    className="btn btn-danger btn-lg"
                    disabled={loading}
                    style={{ borderRadius: '10px', fontWeight: '600' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={onCancel}
                    disabled={loading}
                    style={{ borderRadius: '10px', fontWeight: '600' }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
