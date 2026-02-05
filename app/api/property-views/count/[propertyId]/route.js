import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');

export async function GET(request, { params }) {
  try {
    const { propertyId } = params;
    
    const backendUrl = `${BACKEND_URL}/api/property-views/count/${propertyId}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Property View Count API] Backend error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to get view count' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Property View Count API] Exception:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get view count', details: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
