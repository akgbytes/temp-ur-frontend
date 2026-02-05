// Server-side authentication utility for Next.js API routes
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Verify JWT token from request headers or cookies
 * @param {Request} request - Next.js request object
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(request) {
  try {
    let token = null;

    // Check Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // If no token in header, check cookies
    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) acc[key] = value;
        return acc;
      }, {});
      
      token = cookies.token || cookies.urbanesta_token;
    }

    if (!token) {
      return null;
    }

    // Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET;
    
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token');
    } else {
      console.error('Token verification error:', error.message);
    }
    return null;
  }
}

/**
 * Middleware function to protect API routes
 * @param {Request} request - Next.js request object
 * @returns {NextResponse|null} - Error response if unauthorized, null if authorized
 */
export function requireAuth(request) {
  const decoded = verifyToken(request);
  
  if (!decoded) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required. Please log in.',
        code: 'UNAUTHORIZED'
      },
      { status: 401 }
    );
  }

  return null; // Authorized
}

/**
 * Get authenticated user from request
 * @param {Request} request - Next.js request object
 * @returns {Object|null} - User object or null if not authenticated
 */
export function getAuthenticatedUser(request) {
  const decoded = verifyToken(request);
  
  if (!decoded) {
    return null;
  }

  return {
    id: decoded.id,
    phoneNumber: decoded.phoneNumber,
    email: decoded.email || '',
    name: decoded.name || '',
    city: decoded.city || 'Delhi'
  };
}

