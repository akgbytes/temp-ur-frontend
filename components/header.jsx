"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SignInModal2Factor from "./SignInModal2Factor";
import UserAvatar from "./UserAvatar";
import { useAuth2Factor } from "@/contexts/Auth2FactorContext";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);
    const menuRef = useRef(null);
    
    // Use Auth2Factor context for user authentication
    const { user, loading: authLoading, signOut } = useAuth2Factor();

    // Listen for custom event to open sign-in modal
    useEffect(() => {
        const handleOpenSignIn = (event) => {
            setIsSignInModalOpen(true);
            setRedirectAfterLogin(event.detail?.redirectAfterLogin || false);
        };

        window.addEventListener('openSignInModal', handleOpenSignIn);
        
        return () => {
            window.removeEventListener('openSignInModal', handleOpenSignIn);
        };
    }, []);

    // Close menu when clicking outside (but not on mobile menu items)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                // Only close if it's not a mobile menu item click
                const isMobileMenuClick = event.target.closest('.mobile-menu-dropdown');
                if (!isMobileMenuClick) {
                    setIsMenuOpen(false);
                }
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // Handle user completion from sign-in modal
    const handleUserComplete = (userData) => {
        // User data is now managed by Auth2FactorContext
        // No need to manually set user state
    };

    // Handle sign out
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            // Silently handle sign out errors
        }
    };

    // Handle view profile - now handled by UserAvatar component

    return(
        <>
        <header ref={menuRef} className=" bg-white  d-flex justify-content-between align-items-center border-bottom fixed-top px-3 px-md-4">
                {/* Logo */}
                <Link href="/" className="d-flex align-items-center">
                    <img 
                        src="/img/logo.jpg" 
                        alt="urbanestaLogo" 
                        width={60} 
                        height={60} 
                        className="d-md-none"
                    />
                    <img 
                        src="/img/logo.jpg" 
                        alt="urbanestaLogo" 
                        width={80} 
                        height={80} 
                        className="d-none d-md-block"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="d-none d-lg-block">
                    <ul className="d-flex list-unstyled gap-4 mb-0">
                        <li>
                            <Link href="/properties?category=residential" className="text-decoration-none text-black fs-5">Residential</Link>
                        </li>
                        <li>
                            <Link href="/properties?category=commercial" className="text-decoration-none text-black fs-5">Commercial</Link>
                        </li>
                        <li>
                            <Link href="/properties?category=rentals" className="text-decoration-none text-black fs-5">Rentals</Link>
                        </li>
                        <li>
                            <Link href="/properties?category=investments" className="text-decoration-none text-black fs-5">Investments</Link>
                        </li>
                       
                    </ul>
                </nav>

                {/* Desktop Actions */}
                <div className="d-none d-lg-flex gap-3 align-items-center">

                    {/* Watchlist Icon - Only show when user is logged in */}
                    {user && (
                        <Link 
                            href="/user#watchlist" 
                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                            style={{
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                padding: '0',
                                border: '2px solid #dc3545',
                                color: '#dc3545',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#dc3545';
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#dc3545';
                                e.target.style.transform = 'translateY(0)';
                            }}
                            title="My Watchlist"
                        >
                            <i className="bi bi-heart-fill"></i>
                        </Link>
                    )}

                    {/* Post a Property Button - HIDDEN */}
                    <div style={{ display: 'none' }}>
                        <button 
                            className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                            style={{
                                borderRadius: '20px',
                                padding: '6px 16px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'not-allowed',
                                opacity: 0.6
                            }}
                            disabled
                            title="Post Property feature is currently disabled"
                        >
                            <i className="bi bi-plus-circle-fill"></i>
                            Post Property
                        </button>
                    </div>
                    
                    {/* User Avatar or Sign In Button */}
                    {authLoading ? (
                        <div className="spinner-border spinner-border-sm text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : user ? (
                        <UserAvatar 
                            user={user}
                        />
                    ) : (
                        <button 
                            className=" bg-danger btn p-1 ps-2 pe-2 rounded-2 btn-sm text-white"
                            onClick={() => setIsSignInModalOpen(true)}
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="btn d-lg-none border border-dark bg-white text-dark rounded-2"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Hamburger menu toggled
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    aria-label="Toggle menu"
                    style={{
                        padding: '8px 12px',
                        minWidth: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`} style={{fontSize: '1.2rem', fontWeight: 'bold'}}></i>
                </button>
                
        </header>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
            <div 
                className="d-lg-none position-fixed start-0 w-100 bg-white border-bottom shadow-lg mobile-menu-dropdown" 
                style={{
                    zIndex: 1050, 
                    top: '70px',
                    maxHeight: 'calc(100vh - 70px)',
                    overflowY: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <nav className="p-3">
                    {/* Navigation Links */}
                    <ul className="list-unstyled mb-3">
                        <li className="mb-2">
                            <Link 
                                href="/properties?category=residential" 
                                className="text-decoration-none text-black d-block p-3 rounded hover-bg-light" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTimeout(() => {
                                        window.location.href = '/properties?category=residential';
                                    }, 100);
                                    setIsMenuOpen(false);
                                }}
                                style={{transition: 'background-color 0.2s ease'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Residential
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link 
                                href="/properties?category=commercial" 
                                className="text-decoration-none text-black d-block p-3 rounded hover-bg-light" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTimeout(() => {
                                        window.location.href = '/properties?category=commercial';
                                    }, 100);
                                    setIsMenuOpen(false);
                                }}
                                style={{transition: 'background-color 0.2s ease'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                             Commercial
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link 
                                href="/properties?category=rentals" 
                                className="text-decoration-none text-black d-block p-3 rounded hover-bg-light" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTimeout(() => {
                                        window.location.href = '/properties?category=rentals';
                                    }, 100);
                                    setIsMenuOpen(false);
                                }}
                                style={{transition: 'background-color 0.2s ease'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Rentals
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link 
                                href="/properties?category=investments" 
                                className="text-decoration-none text-black d-block p-3 rounded hover-bg-light" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setTimeout(() => {
                                        window.location.href = '/properties?category=investments';
                                    }, 100);
                                    setIsMenuOpen(false);
                                }}
                                style={{transition: 'background-color 0.2s ease'}}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                Investments
                            </Link>
                        </li>
                    </ul>
                    
                    {/* Separator */}
                    <div className="border-top pt-3">
                        
                        {/* Mobile Watchlist Icon - Only show when user is logged in */}
                        {user && (
                            <div className="mb-3">
                                <Link 
                                    href="/user#watchlist" 
                                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setTimeout(() => {
                                            window.location.href = '/user#watchlist';
                                        }, 100);
                                        setIsMenuOpen(false);
                                    }}
                                    style={{
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        border: '2px solid #dc3545',
                                        color: '#dc3545',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <i className="bi bi-heart-fill"></i>
                                    My Watchlist
                                </Link>
                            </div>
                        )}

                        {/* Mobile Post a Property Button - HIDDEN */}
                        <div className="mb-3" style={{ display: 'none' }}>
                            <button 
                                className="btn btn-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                                disabled
                                style={{
                                    borderRadius: '8px',
                                    padding: '10px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'not-allowed',
                                    opacity: 0.6
                                }}
                                title="Post Property feature is currently disabled"
                            >
                                <i className="bi bi-plus-circle-fill"></i>
                                Post a Property
                            </button>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="d-grid gap-2">
                            {authLoading ? (
                                <div className="d-flex align-items-center justify-content-center p-3">
                                    <div className="spinner-border spinner-border-sm text-danger me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className="text-muted small">Loading...</span>
                                </div>
                            ) : user ? (
                                <div className="d-flex align-items-center justify-content-between p-2 border rounded">
                                    <div className="d-flex align-items-center">
                                        <div 
                                            className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                background: 'linear-gradient(135deg, #dc3545, #c82333)',
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <div className="fw-bold small">{user.name}</div>
                                            <div className="text-muted" style={{ fontSize: '11px' }}>{user.city}</div>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setIsSignInModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        )}

        {/* Sign In Modal */}
        <SignInModal2Factor 
            isOpen={isSignInModalOpen}
            onClose={() => {
                setIsSignInModalOpen(false);
                setRedirectAfterLogin(false);
            }}
            onUserComplete={handleUserComplete}
            redirectAfterLogin={redirectAfterLogin}
        />

        </>
    )
}