import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');

export async function GET(request) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/analytics/device-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Analytics Device Stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch device stats' },
      { status: 500 }
    );
  }
}
