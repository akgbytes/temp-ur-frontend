import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🚀 [REFRESH TOKEN API] POST route handler called');
  console.log('🚀 [REFRESH TOKEN API] Environment:', process.env.NODE_ENV);
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/refresh-token`;
    
    console.log('🔗 [REFRESH TOKEN API] Backend URL:', backendUrl);
    console.log('🔗 [REFRESH TOKEN API] Full URL:', fullUrl);
    
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

    console.log('📡 [REFRESH TOKEN API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [REFRESH TOKEN API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    // Forward cookies from backend to frontend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 [REFRESH TOKEN API] Forwarding cookies to frontend:', setCookieHeader);
      responseHeaders.set('set-cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('💥 [REFRESH TOKEN API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
