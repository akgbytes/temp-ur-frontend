"use client";

import React, { useState, useEffect } from 'react';
import { useAuth2Factor } from '../contexts/Auth2FactorContext.js';
import { citiesAPI } from '../lib/api.js';

const ProfileCompletionForm = ({ onComplete, onSkip }) => {
  const { user, updateUserProfile } = useAuth2Factor();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    city: user?.city || 'Delhi',
    email: user?.email || ''
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load cities from database
  useEffect(() => {
    const loadCities = async () => {
      try {
        const { data, error } = await citiesAPI.getAll();
        console.log('Cities API response:', { data, error });
        
        if (data && Array.isArray(data)) {
          // Backend returns array directly
          setCities(data);
        } else if (data && data.success && Array.isArray(data.cities)) {
          // Backend returns wrapped response
          setCities(data.cities);
        } else {
          console.warn('No cities data received, using fallback cities');
          // Fallback cities if API fails
          setCities([
            { _id: 'default-gurgaon', name: 'Gurgaon', state: 'Haryana' },
            { _id: 'default-noida', name: 'Noida', state: 'Uttar Pradesh' },
            { _id: 'default-delhi', name: 'Delhi', state: 'New Delhi' },
            { _id: 'default-mumbai', name: 'Mumbai', state: 'Maharashtra' }
          ]);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
        // Fallback cities if API fails
        setCities([
          { _id: 'default-gurgaon', name: 'Gurgaon', state: 'Haryana' },
          { _id: 'default-noida', name: 'Noida', state: 'Uttar Pradesh' },
          { _id: 'default-delhi', name: 'Delhi', state: 'New Delhi' },
          { _id: 'default-mumbai', name: 'Mumbai', state: 'Maharashtra' }
        ]);
      }
    };

    loadCities();
  }, []);

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

    if (!formData.name || formData.name.trim() === '' || formData.name === 'User') {
      newErrors.name = 'Please enter your full name';
    }

    if (!formData.city || formData.city === 'Delhi') {
      newErrors.city = 'Please select your city';
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
    try {
      await updateUserProfile(formData);
      onComplete();
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">Complete Your Profile</h4>
              <p className="mb-0 small">Help us personalize your experience</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="Delhi">Select your city</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city.name}>
                        {city.name}, {city.state}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    {errors.submit}
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Complete Profile'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleSkip}
                    disabled={loading}
                  >
                    Skip for now
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

export default ProfileCompletionForm;
