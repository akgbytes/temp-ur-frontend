import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');

export async function GET(request) {
  try {
    const backendUrl = `${BACKEND_URL}/api/home-videos/active`;

    console.log('[HomeVideo API] Fetching active video from:', backendUrl.replace(BACKEND_URL, 'BACKEND_URL'));

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
    console.log('[HomeVideo API] Active video data received:', data?.data ? 'Video found' : 'No video');
    console.log('[HomeVideo API] Response structure:', {
      hasData: !!data.data,
      dataType: typeof data.data,
      isArray: Array.isArray(data.data)
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('[HomeVideo API] Error fetching active home video:', error);
    console.error('[HomeVideo API] Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ data: null }, { status: 500 });
  }
}

