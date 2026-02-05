import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'stats';
    
    // Build backend URL based on endpoint
    let backendUrl = `${BACKEND_URL}/api/analytics/${endpoint}`;
    
    // Add query parameters
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        params.append(key, value);
      }
    });
    
    if (params.toString()) {
      backendUrl += `?${params.toString()}`;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch analytics' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Analytics API GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  try {
    console.log('[Analytics API] POST request received');
    const body = await request.json();
    console.log('[Analytics API] Request body:', JSON.stringify(body).substring(0, 200));
    
    const backendUrl = `${BACKEND_URL}/api/analytics/track`;
    console.log('[Analytics API] Calling backend:', backendUrl.replace(BACKEND_URL, 'BACKEND_URL'));
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('[Analytics API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Analytics API] Backend error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to track analytics' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Analytics API] Success');
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[Analytics API] Exception:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track analytics', details: error.message },
      { status: 500 }
    );
  }
}

