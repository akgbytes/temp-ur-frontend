import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log('🚀 [USER PROPERTIES API] GET route handler called');
  console.log('🚀 [USER PROPERTIES API] Environment:', process.env.NODE_ENV);
  
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/properties`;
    
    console.log('🔗 [USER PROPERTIES API] Backend URL:', backendUrl);
    console.log('🔗 [USER PROPERTIES API] Full URL:', fullUrl);
    
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

    console.log('📡 [USER PROPERTIES API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [USER PROPERTIES API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 [USER PROPERTIES API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}