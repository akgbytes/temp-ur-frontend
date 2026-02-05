import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    // Build backend URL
    let backendUrl = `${BACKEND_URL}/api/home-videos`;
    if (active === 'true') {
      backendUrl += '/active';
    }

    console.log('[HomeVideo API] Fetching from:', backendUrl.replace(BACKEND_URL, 'BACKEND_URL'));

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    console.log('[HomeVideo API] Response status:', response.status);

    if (!response.ok) {
      console.error('[HomeVideo API] Backend response not OK:', response.status);
      const errorText = await response.text();
      console.error('[HomeVideo API] Error response:', errorText);
      return NextResponse.json({ data: null }, { status: response.status });
    }

    const data = await response.json();
    console.log('[HomeVideo API] Data received:', data?.data ? 'Video found' : 'No video');
    return NextResponse.json(data);
  } catch (error) {
    console.error('[HomeVideo API] Error fetching home videos:', error);
    console.error('[HomeVideo API] Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/api/home-videos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating home video:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

