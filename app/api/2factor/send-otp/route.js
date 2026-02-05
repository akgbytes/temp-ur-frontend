import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🚀 [2FACTOR SEND OTP API] POST route handler called');
  console.log('🚀 [2FACTOR SEND OTP API] Environment:', process.env.NODE_ENV);
  
  try {
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/2factor/send-otp`;
    
    console.log('🔗 [2FACTOR SEND OTP API] Backend URL:', backendUrl);
    console.log('🔗 [2FACTOR SEND OTP API] Full URL:', fullUrl);
    console.log('📱 [2FACTOR SEND OTP API] Phone number:', body.phoneNumber);
    
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
      body: JSON.stringify(body),
    });

    console.log('📡 [2FACTOR SEND OTP API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [2FACTOR SEND OTP API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 [2FACTOR SEND OTP API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
