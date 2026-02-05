"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth2Factor } from '@/contexts/Auth2FactorContext';

const LeadFormWithOTP = ({ property = null, onClose, autoShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    propertyInterest: ''
  });
  const [sessionId, setSessionId] = useState(null); // Store 2Factor sessionId
  const [otp, setOtp] = useState(['', '', '', '']); // 4-digit OTP for Urbanesta_Realtors template
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null); // Store verified user data
  const [isReturningUser, setIsReturningUser] = useState(false); // Track if user existed before
  const router = useRouter();
  const { user } = useAuth2Factor(); // Get logged-in user

  // Show form after 10 seconds (only if autoShow is true)
  useEffect(() => {
    if (autoShow) {
      const delayTimer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(delayTimer);
    } else {
      setIsVisible(true);
    }
  }, [autoShow]);

  // Auto-fill property data
  useEffect(() => {
    if (property) {
      setFormData(prev => ({
        ...prev,
        city: property.city?.name || prev.city,
        propertyInterest: property.projectName || property.title || ''
      }));
    }
  }, [property]);

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => {
        // Extract 10-digit phone number from phoneNumber (which may include country code like +91)
        let phoneNumber = prev.phone;
        if (user.phoneNumber) {
          // Remove country code and extract last 10 digits
          const digitsOnly = user.phoneNumber.replace(/\D/g, '');
          phoneNumber = digitsOnly.slice(-10); // Get last 10 digits
        }
        
        return {
          ...prev,
          name: user.name || prev.name,
          phone: phoneNumber,
          city: user.city || prev.city || property?.city?.name || ''
        };
      });
    }
  }, [user, property]);

  // OTP Timer
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [step, timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phone: value }));
      setError(null);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0]; // Only one digit
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input (4-digit OTP, so index < 3)
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(4).fill('')).slice(0, 4);
    setOtp(newOtp);

    // Focus last filled input (4-digit OTP, so max index is 3)
    const lastIndex = Math.min(pastedData.length - 1, 3);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    if (lastInput) lastInput.focus();
  };

  const sendOTP = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate phone number
      if (formData.phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        setIsSubmitting(false);
        return;
      }

      // Send OTP via API
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          name: formData.name,
          city: formData.city,
          propertyId: property?._id || null,
          propertyName: property?.projectName || property?.title || '',
          propertyUrl: typeof window !== 'undefined' ? window.location.href : ''
        })
      });
      
      console.log('🔄 Sending OTP request for phone:', formData.phone);

      const data = await response.json();
      
      console.log('📥 OTP Response:', { status: response.status, data });

      if (response.ok && data.success) {
        setSessionId(data.sessionId); // Store sessionId from 2Factor
        setStep(2); // Move to OTP verification step
        setTimer(60);
        setCanResend(false);
        console.log('✅ OTP sent successfully, sessionId:', data.sessionId);
      } else {
        console.error('❌ OTP Send Failed:', data);
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error sending OTP:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.city) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    // If user is logged in, skip OTP and directly submit lead
    if (user) {
      await submitLeadDirectly();
      return;
    }

    // Otherwise, proceed with OTP verification
    await sendOTP();
  };

  // Directly submit lead for logged-in users (skip OTP)
  const submitLeadDirectly = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Format phone number for validation (backend expects format that passes isMobilePhone validation)
      // Keep the 10-digit format as the backend Lead model stores it as string
      const phoneNumber = formData.phone.replace(/\D/g, ''); // Ensure only digits

      const leadData = {
        name: formData.name.trim(),
        phone: phoneNumber, // 10-digit phone number
        city: formData.city.trim(),
        propertyId: property?._id || null,
        propertyName: property?.projectName || property?.title || formData.propertyInterest || '',
        propertyUrl: typeof window !== 'undefined' ? window.location.href : '',
        propertyInterest: formData.propertyInterest || property?.projectName || property?.title || '',
        source: 'property_page_popup', // Use existing enum value
        email: user?.email || null
      };

      console.log('🔄 Submitting lead directly (logged-in user):', leadData);

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ Failed to parse response:', text);
        setError('Failed to submit lead. Please try again.');
        return;
      }
      
      console.log('📥 Lead submission response:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('✅ Lead submitted successfully (logged-in user)');
        setVerifiedUser(user);
        setIsReturningUser(true);
        setStep(3); // Show success message

        // Auto close after 3 seconds
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        console.error('❌ Lead submission failed:', data);
        const errorMessage = data.error || data.message || 'Failed to submit lead. Please try again.';
        setError(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error submitting lead:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const otpCode = otp.join('');
      if (otpCode.length !== 4) {
        setError('Please enter complete 4-digit OTP');
        setIsSubmitting(false);
        return;
      }
      
      console.log('🔄 Verifying OTP:', otpCode, 'SessionId:', sessionId);

      // Verify OTP and create user + lead
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId, // Use 2Factor sessionId
          otp: otpCode,
          name: formData.name,
          city: formData.city,
          propertyId: property?._id || null,
          propertyName: formData.propertyInterest,
          propertyUrl: typeof window !== 'undefined' ? window.location.href : '',
          source: 'get_in_touch_otp'
        })
      });

      const data = await response.json();
      
      console.log('📥 Verify OTP Response:', { status: response.status, data });

      if (response.ok && data.success) {
        console.log('✅ OTP verified successfully');
        console.log('✅ User logged in:', data.user);
        if (data.lead) {
          console.log('✅ Lead created:', data.lead);
        } else {
          console.warn('⚠️ Lead creation skipped, but user is logged in');
        }
        
        // Store user data
        setVerifiedUser(data.user);
        
        // Check if this was a returning user (backend sends this flag)
        const isReturning = data.user?.isReturning === true;
        setIsReturningUser(isReturning);
        
        console.log(isReturning ? '🎉 Returning user logged in!' : '✨ New user account created!');
        
        // Store in localStorage AND set session indicators for Auth context
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('auth_token', data.token || '');
          
          // CRITICAL: Set session indicators so Auth context knows user is logged in
          localStorage.setItem('hasSession', 'true');
          sessionStorage.setItem('hasSession', 'true');
          
          console.log('✅ Session indicators set - user will stay logged in');
        }

        setStep(3); // Show success message

        // Auto close and refresh after 3 seconds (give more time to read)
        setTimeout(() => {
          handleClose();
          if (data.user) {
            // Refresh page to update auth state
            window.location.reload();
          }
        }, 3000);
      } else {
        console.error('❌ OTP Verification Failed:', data);
        
        // Show user-friendly error messages
        let errorMessage = 'Invalid OTP. Please try again.';
        
        if (data.message) {
          // Use the error message from backend
          errorMessage = data.message;
          
          // Make timeout errors more user-friendly
          if (data.message.includes('timeout') || data.message.includes('connection')) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
          } else if (data.message.includes('Invalid OTP')) {
            errorMessage = data.message; // Keep the backend message which includes attempts remaining
          }
        }
        
        setError(errorMessage);
        // Clear OTP on error
        setOtp(['', '', '', '']);
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      
      // Handle network errors
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setOtp(['', '', '', '']); // 4-digit OTP
    setTimer(60);
    setCanResend(false);
    await sendOTP();
  };

  const handleClose = () => {
    setIsVisible(false);
    setStep(1);
    setFormData({ name: '', phone: '', city: '', propertyInterest: '' });
    setOtp(['', '', '', '']); // 4-digit OTP
    setError(null);
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
          aria-label="Close"
        >
          <i className="bi bi-x-lg fs-4 text-muted"></i>
        </button>

        {/* Header */}
        <div className="p-4 pb-0">
          <div className="text-center mb-4">
            <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '60px', height: '60px' }}>
              {step === 3 ? (
                <i className="bi bi-check-lg fs-3 text-white"></i>
              ) : (
                <i className="bi bi-house-heart fs-3 text-white"></i>
              )}
            </div>
            <h4 className="fw-bold mb-2">
              {step === 1 && 'Interested in This Property?'}
              {step === 2 && 'Verify Your Number'}
              {step === 3 && 'Thank You!'}
            </h4>
            <p className="text-muted mb-0">
              {step === 1 && 'Get exclusive updates and personalized assistance'}
              {step === 2 && `Enter the 4-digit OTP sent to +91-${formData.phone}`}
              {step === 3 && 'You are now logged in! We\'ll contact you soon.'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Step 1: Form */}
          {step === 1 && (
            <form onSubmit={handleSubmitForm}>
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
                    readOnly={!!user}
                    style={user ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                  />
                </div>

                {/* Phone */}
                <div className="col-12">
                  <label className="form-label fw-semibold">Phone Number *</label>
                  <div className="input-group">
                    <span className="input-group-text">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="form-control"
                      placeholder="10-digit mobile number"
                      required
                      maxLength="10"
                      readOnly={!!user}
                      style={user ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
                    />
                  </div>
                  {!user && (
                    <small className="text-muted">We'll send an OTP to verify</small>
                  )}
                </div>

                {/* City */}
                <div className="col-12">
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

                {/* Property Interest (Auto-filled, readonly) */}
                {formData.propertyInterest && (
                  <div className="col-12">
                    <label className="form-label fw-semibold">Property Interest</label>
                    <input
                      type="text"
                      name="propertyInterest"
                      value={formData.propertyInterest}
                      className="form-control"
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="col-12">
                    <div className="alert alert-danger mb-0">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  </div>
                )}

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
                        {user ? 'Submitting...' : 'Sending OTP...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        {user ? 'Get Property Details' : 'Get Property Details'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="form-control text-center fw-bold"
                      style={{
                        width: '50px',
                        height: '50px',
                        fontSize: '24px'
                      }}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  {!canResend ? (
                    <small className="text-muted">
                      Resend OTP in <span className="fw-bold text-warning">{timer}s</span>
                    </small>
                  ) : (
                    <button
                      onClick={handleResendOTP}
                      className="btn btn-link text-warning p-0"
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={isSubmitting || otp.join('').length !== 4}
                className="btn btn-warning w-100 py-3 fw-bold"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check me-2"></i>
                    Verify & Continue
                  </>
                )}
              </button>

              {/* Change Number */}
              <button
                onClick={() => setStep(1)}
                className="btn btn-link w-100 mt-2 text-muted"
                disabled={isSubmitting}
              >
                Change Phone Number
              </button>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center py-4">
              {/* Success Icon */}
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '70px', height: '70px' }}>
                <i className="bi bi-check-lg fs-2 text-white"></i>
              </div>
              
              {/* Welcome Message */}
              <h5 className="fw-bold text-success mb-2">
                {isReturningUser ? 'Welcome Back!' : 'Verification Successful!'}
              </h5>
              
              {/* User Details */}
              <div className="mb-3">
                <p className="text-dark mb-1">
                  <span className="fs-5 fw-bold">{verifiedUser?.name || formData.name}</span>
                </p>
                <p className="text-muted small mb-0">
                  <i className="bi bi-telephone-fill me-1"></i>
                  +91-{verifiedUser?.phone || formData.phone}
                </p>
                <p className="text-muted small">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {verifiedUser?.city || formData.city}
                </p>
              </div>
              
              {/* Status Message */}
              <div className="alert alert-success py-2 mb-3">
                <i className="bi bi-shield-check me-2"></i>
                <small className="fw-semibold">
                  {isReturningUser 
                    ? 'Your account has been verified and you\'re logged in!' 
                    : 'Your account has been created and you\'re logged in!'}
                </small>
              </div>
              
              {/* Contact Promise */}
              <p className="text-muted small mb-3">
                Our team will contact you within 24 hours with exclusive details about <span className="fw-bold">{property?.projectName || property?.title || 'this property'}</span>.
              </p>
              
              {/* Loading Indicator */}
              <div className="d-flex align-items-center justify-content-center gap-2">
                <div className="spinner-border spinner-border-sm text-warning" role="status">
                  <span className="visually-hidden">Redirecting...</span>
                </div>
                <small className="text-muted">Redirecting...</small>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="px-4 pb-4">
            <div className="text-center">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Your information is secure and will not be shared with third parties.
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadFormWithOTP;

