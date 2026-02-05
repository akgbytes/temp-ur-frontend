import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('🚀 [USER PROFILE API] GET route handler called');
  console.log('🚀 [USER PROFILE API] Environment:', process.env.NODE_ENV);
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/profile`;
    
    console.log('🔗 [USER PROFILE API] Backend URL:', backendUrl);
    console.log('🔗 [USER PROFILE API] Full URL:', fullUrl);
    
    // Get authorization header from the request
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...(cookie && { 'Cookie': cookie }),
      },
      credentials: 'include',
    });

    console.log('📡 [USER PROFILE API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [USER PROFILE API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    // Forward cookies from backend to frontend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 [USER PROFILE API] Forwarding cookies to frontend:', setCookieHeader);
      responseHeaders.set('set-cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('💥 [USER PROFILE API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  console.log('🚀 [USER PROFILE API] PUT route handler called');
  
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/profile`;
    
    console.log('🔗 [USER PROFILE API] Backend URL:', backendUrl);
    console.log('🔗 [USER PROFILE API] Full URL:', fullUrl);
    
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...(cookie && { 'Cookie': cookie }),
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    console.log('📡 [USER PROFILE API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [USER PROFILE API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    // Forward cookies from backend to frontend
    const responseHeaders = new Headers();
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log('🍪 [USER PROFILE API] Forwarding cookies to frontend:', setCookieHeader);
      responseHeaders.set('set-cookie', setCookieHeader);
    }
    
    return NextResponse.json(data, { 
      status: response.status,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('💥 [USER PROFILE API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
