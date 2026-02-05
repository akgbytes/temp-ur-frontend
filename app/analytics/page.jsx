'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI, propertyViewsAPI } from '@/lib/api';

export default function AnalyticsDashboard() {
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [propertyStats, setPropertyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch visitor statistics
      const visitorStats = await analyticsAPI.getVisitorStats();
      
      // Fetch top viewed properties
      const topProperties = await propertyViewsAPI.getTopViewed(10);
      
      // Fetch page popularity
      const pagePopularity = await analyticsAPI.getPagePopularity(10);
      
      // Fetch device stats
      const deviceStats = await analyticsAPI.getDeviceStats();

      setAnalyticsStats({
        visitors: visitorStats.data,
        pagePopularity: pagePopularity.data,
        deviceStats: deviceStats.data
      });

      setPropertyStats(topProperties.data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Analytics Dashboard</h1>
          
          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'properties' ? 'active' : ''}`}
                onClick={() => setActiveTab('properties')}
              >
                Property Views
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'pages' ? 'active' : ''}`}
                onClick={() => setActiveTab('pages')}
              >
                Page Popularity
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'devices' ? 'active' : ''}`}
                onClick={() => setActiveTab('devices')}
              >
                Device Stats
              </button>
            </li>
          </ul>

          {/* Overview Tab */}
          {activeTab === 'overview' && analyticsStats && (
            <div className="row">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-primary">Total Visits</h5>
                    <h2 className="card-text">{analyticsStats.visitors?.totalVisits || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-success">Unique Visitors</h5>
                    <h2 className="card-text">{analyticsStats.visitors?.uniqueVisitors || 0}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-warning">Avg. Visit Duration</h5>
                    <h2 className="card-text">
                      {analyticsStats.visitors?.avgVisitDuration 
                        ? `${Math.round(analyticsStats.visitors.avgVisitDuration)}s`
                        : '0s'
                      }
                    </h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title text-info">Top Properties</h5>
                    <h2 className="card-text">{propertyStats?.length || 0}</h2>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Property Views Tab */}
          {activeTab === 'properties' && propertyStats && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Top Viewed Properties</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Views</th>
                        <th>Last Viewed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertyStats.map((stat, index) => (
                        <tr key={index}>
                          <td>
                            {stat.propertyId?.title || stat.propertyId?.projectName || 'Unknown'}
                          </td>
                          <td>
                            <span className={`badge ${stat.propertyId?.type === 'builder' ? 'bg-primary' : 'bg-secondary'}`}>
                              {stat.propertyId?.type || 'Unknown'}
                            </span>
                          </td>
                          <td>{stat.propertyId?.location || 'Unknown'}</td>
                          <td>
                            <span className="badge bg-success">{stat.viewCount}</span>
                          </td>
                          <td>
                            {new Date(stat.lastViewedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Page Popularity Tab */}
          {activeTab === 'pages' && analyticsStats && (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Most Popular Pages</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Page URL</th>
                        <th>Visits</th>
                        <th>Unique Visitors</th>
                        <th>Avg. Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsStats.pagePopularity.map((page, index) => (
                        <tr key={index}>
                          <td>
                            <code>{page.pageUrl}</code>
                          </td>
                          <td>
                            <span className="badge bg-primary">{page.visitCount}</span>
                          </td>
                          <td>
                            <span className="badge bg-success">{page.uniqueVisitors}</span>
                          </td>
                          <td>
                            {page.avgDuration ? `${Math.round(page.avgDuration)}s` : '0s'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Device Stats Tab */}
          {activeTab === 'devices' && analyticsStats && (
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Devices</h5>
                  </div>
                  <div className="card-body">
                    {analyticsStats.deviceStats.devices.map((device, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span className="text-capitalize">{device._id}</span>
                        <span className="badge bg-primary">{device.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Browsers</h5>
                  </div>
                  <div className="card-body">
                    {analyticsStats.deviceStats.browsers.map((browser, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span className="text-capitalize">{browser._id}</span>
                        <span className="badge bg-success">{browser.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Operating Systems</h5>
                  </div>
                  <div className="card-body">
                    {analyticsStats.deviceStats.operatingSystems.map((os, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span className="text-capitalize">{os._id}</span>
                        <span className="badge bg-warning">{os.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
