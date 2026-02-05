import { NextResponse } from 'next/server';

// Public API routes that don't require authentication
// Read-only endpoints that should be accessible to everyone
const PUBLIC_API_ROUTES = [
  '/api/health',
  '/api/2factor/send-otp',
  '/api/2factor/verify-otp',
  '/api/2factor/logout',
  '/api/refresh-token',
  // NEW OTP-based authentication routes
  '/api/auth/send-otp',
  '/api/auth/verify-otp',
  '/api/auth/resend-otp',
  // Lead collection routes (public for form submissions)
  '/api/leads',
  // Analytics routes (public, non-critical)
  '/api/analytics',
  '/api/property-views',
  // Read-only data endpoints (GET requests only)
  '/api/cities',
  '/api/builders',
  '/api/categories',
  '/api/properties', // GET requests for listing properties
  '/api/home-videos/active', // Public home video
];

/**
 * Check if an API route is public (doesn't require authentication)
 */
function isPublicApiRoute(pathname) {
  return PUBLIC_API_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
}

/**
 * Check if request has valid authentication token
 */
function hasValidToken(request) {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token && token.length > 0) {
      return true;
    }
  }

  // Check cookies
  const token = request.cookies.get('urbanesta_token')?.value || 
                request.cookies.get('token')?.value;
  
  return token && token.length > 0;
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // Handle API routes
  if (pathname.startsWith('/api/')) {
    // Check if this is a public route
    if (isPublicApiRoute(pathname)) {
      const response = NextResponse.next();
      // Add security headers for API routes
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      return response;
    }

    // Allow GET requests for read-only endpoints (cities, builders, properties, categories)
    // These are public data that should be accessible without authentication
    const readOnlyEndpoints = ['/api/cities', '/api/builders', '/api/categories', '/api/properties', '/api/home-videos/active'];
    const isReadOnlyEndpoint = readOnlyEndpoints.some(endpoint => 
      pathname === endpoint || pathname.startsWith(endpoint + '/')
    );
    
    if (isReadOnlyEndpoint && method === 'GET') {
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      return response;
    }

    // Protected API route - require authentication
    if (!hasValidToken(request)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please log in.',
          code: 'UNAUTHORIZED'
        },
        { 
          status: 401,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
          }
        }
      );
    }

    // Authenticated request - proceed with security headers
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    return response;
  }

  // Check if the request is for the user page
  if (pathname.startsWith('/user')) {
    // Get the token from cookies (backend sets 'urbanesta_token')
    const token = request.cookies.get('urbanesta_token')?.value;
    
    // If no token, redirect to home page
    if (!token) {
      try {
        // Safely construct redirect URL using nextUrl.origin to avoid invalid header characters
        // This ensures we use a properly parsed URL without any malformed characters
        const origin = request.nextUrl.origin;
        
        // Validate origin doesn't contain invalid characters (newlines, carriage returns, etc.)
        if (origin && typeof origin === 'string') {
          const sanitizedOrigin = origin.trim();
          // Check for invalid characters that would cause header errors
          if (!sanitizedOrigin.includes('\n') && 
              !sanitizedOrigin.includes('\r') && 
              !sanitizedOrigin.includes('\t') &&
              sanitizedOrigin.length > 0) {
            const redirectUrl = new URL('/', sanitizedOrigin);
            // Double-check the final URL is valid
            const finalUrl = redirectUrl.toString().trim();
            if (finalUrl && !finalUrl.includes('\n') && !finalUrl.includes('\r')) {
              return NextResponse.redirect(redirectUrl);
            }
          }
        }
      } catch (error) {
        // If URL construction fails, log error for debugging
        console.error('Error constructing redirect URL in middleware:', error);
      }
      
      // Fallback: clone nextUrl and set pathname to root
      // This is safer than constructing a full URL when origin might be malformed
      try {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/';
        redirectUrl.search = '';
        redirectUrl.hash = '';
        return NextResponse.redirect(redirectUrl);
      } catch (fallbackError) {
        // Last resort: allow request to proceed (will show 404 or error page)
        // This prevents the app from crashing
        console.error('Fallback redirect also failed:', fallbackError);
        return NextResponse.next();
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};
