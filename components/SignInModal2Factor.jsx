"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth2Factor } from "../contexts/Auth2FactorContext";
import "../styles/signin.css";

const SignInModal2Factor = ({ isOpen, onClose, onUserComplete, redirectAfterLogin = false }) => {
  const router = useRouter();
  const { sendOTP, verifyOTP, isProfileComplete } = useAuth2Factor();
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP verification
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", ""]); // 4-digit OTP with AUTOGEN3
  const [sessionId, setSessionId] = useState("");
  const [otpType, setOtpType] = useState("sms");
  const [isFallback, setIsFallback] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  // Country codes for dropdown
  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
  ];


  // Reset modal when opened/closed
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber("");
      setOtp("");
      setOtpInputs(["", "", "", ""]); // 4-digit OTP with AUTOGEN3
      setError("");
      setSessionId("");
      setOtpType("sms");
      setIsFallback(false);
      setOtpTimer(0);
      setIsOtpExpired(false);
    }
  }, [isOpen]);

  // OTP Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => {
          if (timer <= 1) {
            setIsOtpExpired(true);
            return 0;
          }
          return timer - 1;
        });
      }, 1000);
    } else if (otpTimer === 0 && step === 2) {
      setIsOtpExpired(true);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpTimer, step]);

  // Handle phone number submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      // Format phone number for 2Factor API
      const fullPhoneNumber = countryCode + phoneNumber;
      
      // Send OTP using Auth2Factor context
      const result = await sendOTP(fullPhoneNumber);

      if (result.success) {
        setSessionId(result.sessionId);
        setOtpType(result.otpType || "sms");
        setIsFallback(result.isFallback || false);
        setStep(2);
        setError("");
        // Start 120-second timer
        setOtpTimer(120);
        setIsOtpExpired(false);
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isOtpExpired) return; // Don't allow input if OTP is expired
    if (value.length > 1) return; // Only allow single digit
    
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
    
    // Auto-focus next input
    if (value && index < 3) { // 4-digit OTP (indices 0-3)
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
    
    // Check if all digits are filled (4-digit OTP)
    const otpValue = newOtpInputs.join("");
    if (otpValue.length === 4) {
      setOtp(otpValue);
    }
  };

  // Handle backspace in OTP input
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check if OTP is expired
    if (isOtpExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }
    
    const otpValue = otpInputs.join("");
    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit OTP");
      return;
    }

    if (!sessionId) {
      setError("No OTP session found. Please request OTP again.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify OTP using Auth2Factor context
      const result = await verifyOTP(sessionId, otpValue);

      if (result.success) {
        // Close modal
        onClose();
        
        // Check if profile is complete, if not redirect to profile completion page
        if (!isProfileComplete) {
          router.push('/profile-completion');
        } else {
          // Handle redirect after login (for watchlist flow)
          if (redirectAfterLogin) {
            // Check for pending property in localStorage
            const pendingPropertyId = localStorage.getItem('pendingWatchlistProperty');
            
            if (pendingPropertyId) {
              // Import userAPI to add to watchlist
              try {
                const { userAPI } = await import('../lib/api');
                const { data } = await userAPI.addToWatchlist(pendingPropertyId);
                
                if (data && data.success) {
                  // Clear the pending property
                  localStorage.removeItem('pendingWatchlistProperty');
                  // Redirect to user watchlist page
                  router.push('/user');
                } else {
                  // Still redirect even if adding failed
                  router.push('/user');
                }
              } catch (error) {
                // Still redirect on error
                router.push('/user');
              }
            } else {
              // No pending property, just redirect to user page
              router.push('/user');
            }
          } else {
            // Call the callback to update parent component
            if (onUserComplete) {
              onUserComplete(result.user);
            }
          }
        }
      } else {
        setError(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      // Show more specific error messages
      if (err.message.includes('Phone number already exists')) {
        setError("This phone number is already registered. Please try logging in instead.");
      } else if (err.message.includes('Invalid OTP')) {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (err.message.includes('expired')) {
        setError("OTP has expired. Please request a new one.");
      } else if (err.message.includes('Network error')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      // Send OTP again using Auth2Factor context
      const fullPhoneNumber = countryCode + phoneNumber;
      const result = await sendOTP(fullPhoneNumber);

      if (result.success) {
        setSessionId(result.sessionId);
        setOtpType(result.otpType || "sms");
        setIsFallback(result.isFallback || false);
        setOtpInputs(["", "", "", ""]); // 4-digit OTP with AUTOGEN3
        setOtp("");
        setError("");
        // Restart 120-second timer
        setOtpTimer(120);
        setIsOtpExpired(false);
      } else {
        setError(result.error || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block signin-modal" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 pb-0">
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex align-items-center">
                <img 
                  src="/img/logo.jpg" 
                  alt="Urbanesta" 
                  width={40} 
                  height={40} 
                  className="me-2"
                />
                <h5 className="mb-0 fw-bold">Welcome to Urbanesta</h5>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body px-4 pb-4">
            {step === 1 ? (
              // Phone Number Step
              <form onSubmit={handlePhoneSubmit}>
                <div className="text-center mb-4">
                  <h4 className="fw-bold text-dark mb-2">Sign In</h4>
                  <p className="text-muted">Enter your mobile number to continue</p>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Mobile Number</label>
                  <div className="input-group">
                    <select 
                      className="form-select country-selector" 
                      style={{ maxWidth: '120px' }}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      className="form-control phone-input"
                      placeholder="Enter 10-digit mobile number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only numbers
                        if (value.length <= 10) {
                          setPhoneNumber(value);
                        }
                      }}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-danger btn-lg btn-signin"
                    disabled={isLoading || phoneNumber.length !== 10}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending SMS...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </small>
                </div>
              </form>
            ) : (
              // OTP Verification Step
              <form onSubmit={handleOtpSubmit}>
                <div className="text-center mb-4">
                  <h4 className="fw-bold text-dark mb-2">Verify OTP</h4>
                  <p className="text-muted">
                    {otpType === 'voice' ? (
                      <>
                        We've sent a 4-digit voice call to<br />
                        <strong>{countryCode} {phoneNumber}</strong><br />
                        <small className="text-warning">📞 Answer the call to get your OTP</small>
                        {isFallback && (
                          <><br /><small className="text-info">ℹ️ SMS delivery failed, using voice as backup</small></>
                        )}
                      </>
                    ) : (
                      <>
                        We've sent a 4-digit SMS code to<br />
                        <strong>{countryCode} {phoneNumber}</strong><br />
                        <small className="text-info">📱 Check your messages</small>
                      </>
                    )}
                  </p>
                  
                  {/* Timer Display */}
                  {otpTimer > 0 && !isOtpExpired && (
                    <div className="mt-3">
                      <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-2">
                        <span className="text-muted me-2">⏱️</span>
                        <span className="fw-semibold text-primary">
                          {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                        </span>
                        <span className="text-muted ms-2">remaining</span>
                      </div>
                    </div>
                  )}
                  
                  {isOtpExpired && (
                    <div className="mt-3">
                      <div className="alert alert-warning d-inline-block" role="alert">
                        <small>⏰ OTP has expired. Please request a new one.</small>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Enter OTP</label>
                  <div className="d-flex justify-content-center gap-2">
                    {otpInputs.map((digit, index) => (
                      <input
                        key={index}
                        data-index={index}
                        type="text"
                        className={`form-control text-center fw-bold otp-input ${digit ? 'filled' : ''} ${isOtpExpired ? 'disabled' : ''}`}
                        style={{ 
                          width: '45px', 
                          height: '45px',
                          opacity: isOtpExpired ? 0.6 : 1,
                          cursor: isOtpExpired ? 'not-allowed' : 'text'
                        }}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        maxLength={1}
                        required
                        disabled={isOtpExpired}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-danger btn-lg btn-signin"
                    disabled={isLoading || otpInputs.join("").length !== 4 || isOtpExpired}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verifying SMS...
                      </>
                    ) : isOtpExpired ? (
                      "OTP Expired"
                    ) : (
                      "Verify SMS OTP"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button 
                    type="button" 
                    className="btn btn-link"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    {isOtpExpired ? "Request New OTP" : "Didn't receive SMS? Resend"}
                  </button>
                </div>

                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="btn btn-link"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                  >
                    ← Change mobile number
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal2Factor;
