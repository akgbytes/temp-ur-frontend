import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🚀 [2FACTOR LOGOUT API] POST route handler called');
  console.log('🚀 [2FACTOR LOGOUT API] Environment:', process.env.NODE_ENV);
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/2factor/logout`;
    
    console.log('🔗 [2FACTOR LOGOUT API] Backend URL:', backendUrl);
    console.log('🔗 [2FACTOR LOGOUT API] Full URL:', fullUrl);
    
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...(cookie && { 'Cookie': cookie }),
      },
      credentials: 'include',
    });

    console.log('📡 [2FACTOR LOGOUT API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [2FACTOR LOGOUT API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    // Forward cookies from backend to frontend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 [2FACTOR LOGOUT API] Forwarding cookies to frontend:', setCookieHeader);
      responseHeaders.set('set-cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('💥 [2FACTOR LOGOUT API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}