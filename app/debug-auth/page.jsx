"use client";

import React, { useState, useEffect } from 'react';
import { useAuth2Factor } from '../../contexts/Auth2FactorContext';
import { userAPI } from '../../lib/api';

// Note: Metadata cannot be exported from client components
// SEO metadata should be handled at the layout level or in server components

export default function DebugAuthPage() {
  const { user, loading } = useAuth2Factor();
  const [cookies, setCookies] = useState('');
  const [apiTest, setApiTest] = useState(null);

  useEffect(() => {
    // Get cookies
    setCookies(document.cookie);
  }, []);

  const testWatchlistAPI = async () => {
    try {
      const result = await userAPI.getWatchlist();
      setApiTest(result);
    } catch (error) {
      setApiTest({ error: error.message });
    }
  };

  const testAddToWatchlist = async () => {
    try {
      const result = await userAPI.addToWatchlist('test123');
      setApiTest(result);
    } catch (error) {
      setApiTest({ error: error.message });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Debug Authentication</h1>
      
      <div className="row">
        <div className="col-md-6">
          <h3>Authentication Status</h3>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}</p>
          {user && (
            <div>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Phone:</strong> {user.phoneNumber}</p>
              <p><strong>Name:</strong> {user.name}</p>
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          <h3>Cookies</h3>
          <pre style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {cookies || 'No cookies found'}
          </pre>
        </div>
      </div>
      
      <div className="row mt-4">
        <div className="col-12">
          <h3>API Tests</h3>
          <button 
            className="btn btn-primary me-2" 
            onClick={testWatchlistAPI}
            disabled={!user}
          >
            Test Get Watchlist
          </button>
          <button 
            className="btn btn-success me-2" 
            onClick={testAddToWatchlist}
            disabled={!user}
          >
            Test Add to Watchlist
          </button>
          
          {apiTest && (
            <div className="mt-3">
              <h5>API Response:</h5>
              <pre style={{ fontSize: '12px' }}>
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
