"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import Header from "../../components/header";
import ProfileEditForm from "../../components/ProfileEditForm";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth2Factor } from "../../contexts/Auth2FactorContext";
import { useWatchlist } from "../../contexts/WatchlistContext";

// Note: Metadata cannot be exported from client components
// SEO metadata should be handled at the layout level or in server components

function UserContent() {
  const { user, isProfileComplete, refreshUserProfile, signOut } = useAuth2Factor();
  const { watchlist, loading, removeFromWatchlist: removeFromWatchlistContext } = useWatchlist();
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  const handleProfileSaved = async () => {
    setShowEditForm(false);
    await refreshUserProfile();
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
        window.location.href = '/';
      } catch (error) {
        alert('Failed to sign out. Please try again.');
      }
    }
  };

  const removeFromWatchlist = useCallback(async (propertyId) => {
    try {
      const result = await removeFromWatchlistContext(propertyId);
      if (!result.success) {
        alert('Failed to remove property from watchlist');
      }
    } catch (error) {
      alert('Failed to remove property from watchlist');
    }
  }, [removeFromWatchlistContext]);



  if (showEditForm) {
    return (
      <>
        <Header />
        <ProfileEditForm 
          onCancel={handleCancelEdit}
          onSave={handleProfileSaved}
        />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container-fluid" style={{ marginTop: '80px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="container-fluid px-3 px-md-4 py-4">
          {/* User Profile Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                {/* Header with Urbanesta Logo and Gradient Background */}
                <div 
                  className="text-white p-4"
                  style={{
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 50%, #a71e2a 100%)',
                    position: 'relative'
                  }}
                >
                  <div className="row align-items-center">
                    <div className="col-12 col-md-8">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src="/img/logo.jpg"
                          alt="Urbanesta Logo"
                          width={50}
                          height={50}
                          className="rounded-circle me-3"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <h3 className="fw-bold mb-0 fs-4 fs-md-3">Welcome back, {user.name}!</h3>
                          <p className="mb-0 opacity-75 small">Manage your profile and properties</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-4 text-md-end">
                      <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                        <button 
                          type="button"
                          className="btn btn-light btn-sm"
                          onClick={handleEditProfile}
                          style={{ borderRadius: '25px' }}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit Profile
                        </button>
                        <button 
                          type="button"
                          className="btn btn-outline-light btn-sm"
                          onClick={handleSignOut}
                          style={{ borderRadius: '25px' }}
                        >
                          <i className="bi bi-box-arrow-right me-1"></i>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details Section */}
                <div className="card-body p-3 p-md-4">
                  <div className="row">
                    {/* Profile Avatar and Basic Info */}
                    <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{
                          width: '100px',
                          height: '100px',
                          background: 'linear-gradient(135deg, #dc3545, #c82333)',
                          color: 'white',
                          fontSize: '2.5rem',
                          fontWeight: 'bold',
                          boxShadow: '0 8px 25px rgba(220, 53, 69, 0.3)',
                          border: '4px solid white'
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="fw-bold text-dark mb-1 fs-5 fs-md-4">{user.name}</h4>
                      <p className="text-muted mb-0 small">
                        <i className="bi bi-calendar-check me-1"></i>
                        Member since {new Date(user.joinDate).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div className="col-12 col-md-8">
                      <div className="row">
                        <div className="col-12 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-2 p-md-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 flex-shrink-0"
                              style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: '#dc3545',
                                color: 'white'
                              }}
                            >
                              <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-bold small">Location</h6>
                              <p className="text-muted mb-0 small">{user.city}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-2 p-md-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 flex-shrink-0"
                              style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: '#dc3545',
                                color: 'white'
                              }}
                            >
                              <i className="bi bi-telephone-fill"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-bold small">Phone</h6>
                              <p className="text-muted mb-0 small">{user.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-2 p-md-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 flex-shrink-0"
                              style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: '#dc3545',
                                color: 'white'
                              }}
                            >
                              <i className="bi bi-envelope-fill"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-bold small">Email</h6>
                              <p className="text-muted mb-0 small text-break">{user.email || 'Not provided'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-2 p-md-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-2 me-md-3 flex-shrink-0"
                              style={{
                                width: '35px',
                                height: '35px',
                                backgroundColor: user.email ? '#28a745' : '#ffc107',
                                color: 'white'
                              }}
                            >
                              <i className={`bi ${user.email ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-0 fw-bold small">Profile Status</h6>
                              <p className="text-muted mb-0 small">
                                {isProfileComplete ? 'Complete' : 'Incomplete'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Watchlist Section */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">
                      <i className="bi bi-heart-fill me-2 text-danger"></i>
                      My Watchlist
                    </h4>
                    <span className="badge bg-danger">{watchlist.length} Properties</span>
                  </div>
                  
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3 text-muted">Loading your watchlist...</p>
                    </div>
                  ) : watchlist.length > 0 ? (
                    <div className="row">
                      {watchlist.map((property) => (
                        <div key={property._id} className="col-12 col-sm-6 col-lg-4 mb-4">
                          <div className="card h-100 border-0 shadow-sm" style={{ transition: 'transform 0.2s ease' }}>
                            <div className="position-relative">
                              <img
                                src={property.displayImage || (property.images && property.images.length > 0 ? property.images[0] : null) || (property.projectImages && property.projectImages.length > 0 ? property.projectImages[0] : null) || property.wallpaperImage || "/img/heroImage.jpg"}
                                alt={property.projectName || property.title || 'Property'}
                                width={300}
                                height={200}
                                className="card-img-top"
                                style={{ objectFit: 'cover', height: '200px' }}
                                sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                onError={(e) => {
                                  // Silently handle image errors - fallback to default image
                                  if (e.target.src !== "/img/heroImage.jpg") {
                                    e.target.src = "/img/heroImage.jpg";
                                  } else {
                                    e.target.style.display = 'none';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFromWatchlist(property._id);
                                }}
                                style={{ width: '35px', height: '35px' }}
                              >
                                <i className="bi bi-heart-fill"></i>
                              </button>
                              <span className="badge bg-primary position-absolute top-0 start-0 m-2 small">
                                {property.categoryName || property.category?.name || property.subcategoryName || 'Property'}
                              </span>
                            </div>
                            <div className="card-body p-3">
                              <h6 className="card-title fw-bold fs-6">{property.projectName || property.title}</h6>
                              <p className="text-muted small mb-2">
                                <i className="bi bi-geo-alt me-1"></i>
                                {property.localityName || property.location || property.fullAddress || property.city?.name || 'Location not specified'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-danger fs-6">
                                  {property.price ? `₹${property.price.toLocaleString()}` : property.minPrice && property.maxPrice ? `₹${property.minPrice.toLocaleString()} - ₹${property.maxPrice.toLocaleString()}` : 'Price on request'}
                                </span>
                                <small className="text-muted d-none d-sm-block">
                                  Added {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                                </small>
                              </div>
                              <small className="text-muted d-block d-sm-none mt-1">
                                Added {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
                              </small>
                            </div>
                            <div className="card-footer bg-transparent border-0 p-3">
                              <Link 
                                href={`/properties/${property.slug || property._id}`}
                                className="btn btn-outline-danger w-100 btn-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="bi bi-heart text-muted" style={{ fontSize: '4rem' }}></i>
                      <h5 className="text-muted mt-3">No Properties in Watchlist</h5>
                      <p className="text-muted">Start exploring properties and add them to your watchlist!</p>
                      <Link href="/properties" className="btn btn-danger">
                        <i className="bi bi-search me-1"></i>
                        Browse Properties
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default function User() {
  return (
    <ProtectedRoute>
      <UserContent />
    </ProtectedRoute>
  );
}