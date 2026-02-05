/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && { 
    // output: 'standalone', // Temporarily disabled to test API routes
    poweredByHeader: false,
    generateEtags: false,
  }),

  // Ensure HTTPS is used in production - fix mixed content issues
  ...(process.env.NODE_ENV === 'production' && {
    // Force HTTPS for all internal requests
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
    },
  }),

  // Configure base path and asset prefix for production HTTPS
  ...(process.env.NODE_ENV === 'production' && {
    // Don't use assetPrefix as it breaks relative URLs
    // Instead, rely on X-Forwarded-Proto header from Nginx
    // Trust proxy to get correct protocol from X-Forwarded-Proto
    // This is handled by the server.js file
  }),
  
  // Ensure Next.js respects X-Forwarded-Proto for HTTPS
  ...(process.env.NODE_ENV === 'production' && {
    // The server.js file should handle this by reading X-Forwarded-Proto
    // and setting the correct base URL for Next.js
  }),
  
  // Image optimization settings
  images: {
    unoptimized: true, // Disable optimization to prevent 400 errors
    qualities: [75, 80, 85, 90, 95], // Configure allowed quality values
    formats: ['image/webp'], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compression and optimization
  compress: true,
  trailingSlash: false,
  
  // React optimization - faster refresh, strict mode for better performance
  reactStrictMode: true,
  // swcMinify is now default in Next.js 15+ and deprecated as a config option
  
  // Reduce unnecessary page transitions
  experimental: {
    scrollRestoration: true,
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['@/components', '@/lib', '@/utils'], // Tree-shake these packages
  },
  
  // Webpack configuration for tree shaking and optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Split chunks for better caching (optimized for lower memory usage)
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Create smaller vendor chunks to reduce memory pressure
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match) return 'vendor';
              const packageName = match[1];
              return `vendor.${packageName.replace('@', '')}`;
            },
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
      
      // Remove console logs in production (with memory-efficient settings)
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new (require('terser-webpack-plugin'))({
          parallel: true,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
        })
      );
    }
    
    // Fallback for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Add headers for static assets
      {
        source: '/css/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
      {
        source: '/js/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        source: '/img/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Favicon specific headers
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Content-Type',
            value: 'image/jpeg',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
