"use client";

import React, { useState } from 'react';
import { useAuth2Factor } from '../contexts/Auth2FactorContext';
import { useWatchlist } from '../contexts/WatchlistContext';

const WatchlistButton = ({ propertyId, className = "", size = "sm" }) => {
  const { user } = useAuth2Factor();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, loading: watchlistLoading } = useWatchlist();
  const [loading, setLoading] = useState(false);
  const isInList = isInWatchlist(propertyId);

  const handleToggleWatchlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      localStorage.setItem('pendingWatchlistProperty', propertyId);
      window.dispatchEvent(new CustomEvent('openSignInModal', { 
        detail: { redirectAfterLogin: true } 
      }));
      return;
    }

    setLoading(true);
    try {
      if (isInList) {
        const result = await removeFromWatchlist(propertyId);
        if (!result.success) {
          alert('Failed to remove from watchlist');
        }
      } else {
        const result = await addToWatchlist(propertyId);
        if (!result.success) {
          alert('Failed to add to watchlist');
        }
      }
    } catch (error) {
      alert('Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  const buttonClasses = `btn ${isInList ? 'btn-danger' : 'btn-outline-danger'} ${className}`;
  const iconClass = isInList ? 'bi-heart-fill' : 'bi-heart';

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleToggleWatchlist}
      disabled={loading || watchlistLoading}
      title={
        !user 
          ? 'Sign in to add to watchlist' 
          : isInList 
            ? 'Remove from watchlist' 
            : 'Add to watchlist'
      }
      style={{
        borderRadius: '50%',
        width: size === 'sm' ? '35px' : '40px',
        height: size === 'sm' ? '35px' : '40px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        opacity: !user ? 0.6 : 1
      }}
    >
      {loading ? (
        <div className={`spinner-border ${size === 'sm' ? 'spinner-border-sm' : ''}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <i className={`bi ${iconClass}`}></i>
      )}
    </button>
  );
};

export default WatchlistButton;
