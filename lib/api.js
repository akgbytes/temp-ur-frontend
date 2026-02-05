// API utility functions for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Token refresh lock to prevent multiple simultaneous refresh attempts
let refreshTokenPromise = null;
let lastRefreshAttempt = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown between refresh attempts

// Token refresh function with debouncing and locking
async function refreshToken() {
  // Check if we're in a cooldown period
  const now = Date.now();
  if (now - lastRefreshAttempt < REFRESH_COOLDOWN) {
    // If there's an ongoing refresh, wait for it
    if (refreshTokenPromise) {
      return await refreshTokenPromise;
    }
    // Otherwise, skip this refresh attempt
    return false;
  }

  // If there's already a refresh in progress, wait for it
  if (refreshTokenPromise) {
    return await refreshTokenPromise;
  }

  // Check if there's a session indicator before attempting refresh
  if (typeof window !== 'undefined') {
    const hasSession = localStorage.getItem('hasSession') || sessionStorage.getItem('hasSession');
    if (!hasSession) {
      // No session indicator, skip refresh attempt
      return false;
    }
  }

  // Create a new refresh promise
  refreshTokenPromise = (async () => {
    try {
      lastRefreshAttempt = now;
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      // Silently handle token refresh failures
      return false;
    } finally {
      // Clear the promise after a short delay to allow concurrent requests to wait
      setTimeout(() => {
        refreshTokenPromise = null;
      }, 1000);
    }
  })();

  return await refreshTokenPromise;
}

// Helper function to get JWT token from cookies
// Note: Since backend sets httpOnly cookies, we can't access them directly
// The token will be sent automatically with requests due to credentials: 'include'
function getJWTToken() {
  // Return null - authentication will be handled by cookies automatically
  return null;
}

// Generic API call function with timeout and retry
async function apiCall(endpoint, options = {}, retries = 3) {
  // Handle relative URLs by constructing absolute URL
  let url;
  if (API_BASE_URL.startsWith('/')) {
    // Relative URL - construct absolute URL for browser requests
    if (typeof window !== 'undefined') {
      // Force HTTPS to avoid mixed content issues - always use HTTPS if page is HTTPS
      let origin = window.location.origin;
      const isHTTPS = window.location.protocol === 'https:';
      
      // If page is HTTPS, force origin to HTTPS
      if (isHTTPS && origin.startsWith('http://')) {
        origin = origin.replace('http://', 'https://');
      }
      
      // In production, always use HTTPS
      if (process.env.NODE_ENV === 'production' && origin.startsWith('http://')) {
        origin = origin.replace('http://', 'https://');
      }
      
      url = `${origin}${API_BASE_URL}${endpoint}`;
    } else {
      // Server-side rendering - use environment variable (always HTTPS in production)
      const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://urbanesta.in';
      url = `${baseUrl}${API_BASE_URL}${endpoint}`;
    }
  } else {
    // Absolute URL - ensure HTTPS in production
    url = `${API_BASE_URL}${endpoint}`;
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.protocol === 'https:') {
      url = url.replace('http://', 'https://');
    }
  }
  
  // Get JWT token from cookies
  const token = getJWTToken();

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Include cookies in requests for authentication
    credentials: 'include',
    // Use configurable timeout - increased for better reliability
    signal: AbortSignal.timeout(60000), // 60 second timeout for better reliability
  };

  const requestConfig = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        // Handle 401 errors - try to refresh token first (only if not already a refresh token request)
        // Also skip refresh for public endpoints that don't require auth
        const publicEndpoints = ['/cities', '/builders', '/categories', '/properties', '/home-videos/active', '/2factor', '/health', '/analytics', '/property-views', '/leads', '/auth/'];
        const isPublicEndpoint = publicEndpoints.some(publicPath => endpoint.includes(publicPath));
        
        if (response.status === 401 && !endpoint.includes('/refresh-token') && !isPublicEndpoint) {
          // Try to refresh token (with built-in debouncing)
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Retry the original request with refreshed token
            const retryResponse = await fetch(url, requestConfig);
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              return { data: retryData, error: null };
            }
          }
          
          return { 
            data: null, 
            error: 'Unauthorized',
            status: 401
          };
        }
        
        // For public endpoints with 401, just return the error without trying to refresh
        if (response.status === 401 && isPublicEndpoint) {
          return { 
            data: null, 
            error: 'Unauthorized',
            status: 401
          };
        }
        
        // Handle client errors (4xx) - don't retry these
        if (response.status >= 400 && response.status < 500) {
          const errorData = await response.json().catch(() => ({}));
          return { 
            data: null, 
            error: errorData.error || `HTTP error! status: ${response.status}`,
            status: response.status
          };
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      // Handle 401 errors silently - don't retry or log them
      if (error.message.includes('401')) {
        return { 
          data: null, 
          error: 'Unauthorized',
          status: 401
        };
      }
      
      // Silently handle errors - no logging needed
      
      // If this is the last attempt, return error with fallback data
      if (attempt === retries) {
        // Return fallback data for specific endpoints
        if (endpoint.includes('/cities')) {
          return { 
            data: [
              { _id: 'fallback-1', name: 'Delhi', slug: 'delhi' },
              { _id: 'fallback-2', name: 'Mumbai', slug: 'mumbai' },
              { _id: 'fallback-3', name: 'Bangalore', slug: 'bangalore' }
            ], 
            error: 'Using fallback data due to connection issues'
          };
        }
        
        if (endpoint.includes('/builders')) {
          return { 
            data: [], 
            error: 'Unable to load builders data'
          };
        }
        
        if (endpoint.includes('/properties')) {
          return { 
            data: [], 
            error: 'Unable to load properties data'
          };
        }
        
        return { 
          data: null, 
          error: error.message
        };
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Properties API
export const propertiesAPI = {
  // Get all properties with optional filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/properties?${queryString}` : '/properties';
    
    return apiCall(endpoint);
  },

  // Get single property by ID
  getById: async (id) => {
    return apiCall(`/properties/${id}`);
  },

  // Get dropdown data for property forms
  getDropdownData: async () => {
    return apiCall('/properties/dropdown-data');
  },

  // Get property statistics
  getStats: async () => {
    return apiCall('/properties/stats/summary');
  }
};

// Builders API
export const buildersAPI = {
  // Get all builders
  getAll: async () => {
    return apiCall('/builders');
  },

  // Get single builder by slug
  getBySlug: async (slug) => {
    return apiCall(`/builders/${slug}`);
  },

  // Create new builder
  create: async (builderData) => {
    return apiCall('/builders', {
      method: 'POST',
      body: JSON.stringify(builderData),
    });
  },

  // Update builder
  update: async (id, builderData) => {
    return apiCall(`/builders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(builderData),
    });
  },

  // Delete builder
  delete: async (id) => {
    return apiCall(`/builders/${id}`, {
      method: 'DELETE',
    });
  }
};

// Cities API
export const citiesAPI = {
  // Get all cities
  getAll: async () => {
    return apiCall('/cities');
  },

  // Get single city by ID
  getById: async (id) => {
    return apiCall(`/cities/${id}`);
  },

  // Create new city
  create: async (cityData) => {
    return apiCall('/cities', {
      method: 'POST',
      body: JSON.stringify(cityData),
    });
  },

  // Update city
  update: async (id, cityData) => {
    return apiCall(`/cities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cityData),
    });
  },

  // Delete city
  delete: async (id) => {
    return apiCall(`/cities/${id}`, {
      method: 'DELETE',
    });
  }
};

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return apiCall('/categories');
  },

  // Get single category by ID
  getById: async (id) => {
    return apiCall(`/categories/${id}`);
  },

  // Create new category
  create: async (categoryData) => {
    return apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Update category
  update: async (id, categoryData) => {
    return apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Delete category
  delete: async (id) => {
    return apiCall(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
};

// Upload API
export const uploadAPI = {
  // Upload single image
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiCall('/upload/single', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Upload multiple images
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    
    return apiCall('/upload/multiple', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Upload builder images (logo + background)
  uploadBuilder: async (logoFile, backgroundFile) => {
    const formData = new FormData();
    if (logoFile) formData.append('logo', logoFile);
    if (backgroundFile) formData.append('backgroundImage', backgroundFile);
    
    return apiCall('/upload/builder', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
};

// 2Factor Authentication API
export const authAPI = {
  // Send OTP
  sendOTP: async (phoneNumber) => {
    return apiCall('/2factor/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },

  // Verify OTP
  verifyOTP: async (sessionId, otp) => {
    return apiCall('/2factor/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ sessionId, otp }),
    });
  },

  // Logout
  logout: async () => {
    return apiCall('/2factor/logout', {
      method: 'POST',
    });
  }
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiCall('/user/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    // Updating user profile
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get user's watchlist
  getWatchlist: async () => {
    return apiCall('/user/watchlist');
  },

  // Add property to watchlist
  addToWatchlist: async (propertyId) => {
    return apiCall('/user/watchlist', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  },

  // Remove property from watchlist
  removeFromWatchlist: async (propertyId) => {
    return apiCall(`/user/watchlist/${propertyId}`, {
      method: 'DELETE',
    });
  },

  // Get user's properties
  getMyProperties: async () => {
    return apiCall('/user/properties');
  },

  // Delete user's property
  deleteProperty: async (propertyId) => {
    return apiCall(`/user/properties/${propertyId}`, {
      method: 'DELETE',
    });
  }
};

// Property Views API
export const propertyViewsAPI = {
  // Track property view
  track: async (data) => {
    return apiCall('/property-views/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get property view count
  getCount: async (propertyId) => {
    return apiCall(`/property-views/count/${propertyId}`);
  },

  // Get top viewed properties
  getTopViewed: async (limit = 10) => {
    return apiCall(`/property-views/top-viewed?limit=${limit}`);
  },

  // Get view statistics for multiple properties
  getStats: async (propertyIds) => {
    return apiCall('/property-views/stats', {
      method: 'POST',
      body: JSON.stringify({ propertyIds }),
    });
  }
};

// Analytics API
export const analyticsAPI = {
  // Track website visit
  track: async (visitData) => {
    return apiCall('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },

  // Get visitor statistics
  getVisitorStats: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/analytics/stats?${queryString}` : '/analytics/stats';
    
    return apiCall(endpoint);
  },

  // Get page popularity
  getPagePopularity: async (limit = 10) => {
    return apiCall(`/analytics/page-popularity?limit=${limit}`);
  },

  // Get device/browser statistics
  getDeviceStats: async () => {
    return apiCall('/analytics/device-stats');
  },

  // Get recent visits
  getRecentVisits: async (limit = 20) => {
    return apiCall(`/analytics/recent?limit=${limit}`);
  }
};

// Home Videos API
export const homeVideosAPI = {
  // Get active home video
  getActive: async () => {
    return apiCall('/home-videos/active');
  },

  // Get all home videos
  getAll: async () => {
    return apiCall('/home-videos');
  },

  // Get single home video by ID
  getById: async (id) => {
    return apiCall(`/home-videos/${id}`);
  },

  // Create new home video
  create: async (videoData) => {
    return apiCall('/home-videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  },

  // Update home video
  update: async (id, videoData) => {
    return apiCall(`/home-videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  },

  // Delete home video
  delete: async (id) => {
    return apiCall(`/home-videos/${id}`, {
      method: 'DELETE',
    });
  }
};

const api = {
  properties: propertiesAPI,
  builders: buildersAPI,
  cities: citiesAPI,
  categories: categoriesAPI,
  upload: uploadAPI,
  auth: authAPI,
  user: userAPI,
  propertyViews: propertyViewsAPI,
  analytics: analyticsAPI,
  homeVideos: homeVideosAPI,
};

export default api;

// Export the apiCall function for direct use
export { apiCall };
