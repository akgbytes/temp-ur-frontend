// Environment-based configuration for frontend
const config = {
  // Backend API URL based on environment
  backendUrl: process.env.NODE_ENV === 'production' 
    ? (process.env.BACKEND_URL || 'http://10.0.2.144:80')  // Production: Use env var or default to private IP on port 80
    : (process.env.BACKEND_URL || 'http://localhost:3012'),   // Development: Use env var or localhost
  
  // Frontend port
  port: process.env.PORT || 3000,
  
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API timeout
  apiTimeout: 15000,
  
  // Cache settings
  cacheEnabled: process.env.NODE_ENV === 'production',
  
  // Debug logging
  debug: process.env.NODE_ENV === 'development'
};

// Configuration loaded

// Force production URL if we're in production and no env var is set
if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_URL) {
  // Using fallback URL for production
  config.backendUrl = 'http://10.0.2.144:80';
}

export default config;
