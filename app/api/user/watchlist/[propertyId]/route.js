import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  try {
    const { propertyId } = params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/user/watchlist/${propertyId}`;
    
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
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}