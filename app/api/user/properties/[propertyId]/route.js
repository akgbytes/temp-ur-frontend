import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  console.log('🚀 [USER PROPERTIES DELETE API] DELETE route handler called');
  console.log('🚀 [USER PROPERTIES DELETE API] Environment:', process.env.NODE_ENV);
  
  try {
    const { propertyId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/properties/${propertyId}`;
    
    console.log('🔗 [USER PROPERTIES DELETE API] Backend URL:', backendUrl);
    console.log('🔗 [USER PROPERTIES DELETE API] Full URL:', fullUrl);
    console.log('🗑️ [USER PROPERTIES DELETE API] Property ID:', propertyId);
    
    const authorization = request.headers.get('authorization');
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
        ...(cookie && { 'Cookie': cookie }),
      },
      credentials: 'include',
    });

    console.log('📡 [USER PROPERTIES DELETE API] Backend response status:', response.status);
    
    const data = await response.json();
    console.log('✅ [USER PROPERTIES DELETE API] Data received from backend:', data?.success ? 'Success' : 'Failed');
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('💥 [USER PROPERTIES DELETE API] Frontend API route error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}