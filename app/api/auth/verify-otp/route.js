import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3012';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('🔄 [Next.js] Proxying verify-otp request to backend');
    console.log('📤 [Next.js] Request body:', { 
      sessionId: body.sessionId ? 'present' : 'missing',
      otp: body.otp ? 'present' : 'missing',
      name: body.name || 'not provided'
    });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('❌ [Next.js] Failed to parse backend response:', parseError);
      const text = await response.text();
      console.error('❌ [Next.js] Backend response text:', text);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid response from server. Please try again.' 
        },
        { status: 500 }
      );
    }
    
    console.log('📥 [Next.js] Backend response:', { 
      status: response.status, 
      success: data.success,
      message: data.message || data.error || 'No message'
    });

    // Forward cookies from backend to frontend
    const setCookieHeaders = response.headers.getSetCookie();
    const nextResponse = NextResponse.json(data, { status: response.status });
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Set each cookie individually
      setCookieHeaders.forEach(cookieString => {
        nextResponse.headers.append('Set-Cookie', cookieString);
      });
      console.log('🍪 [Next.js] Forwarding', setCookieHeaders.length, 'cookies to browser');
    }

    return nextResponse;
  } catch (error) {
    console.error('❌ [Next.js] Error proxying verify-otp:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Internal server error. Please try again.' 
      },
      { status: 500 }
    );
  }
}

