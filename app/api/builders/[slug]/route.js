import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    // Fetching builder by slug from backend
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3012';
    
    const response = await fetch(`${backendUrl}/api/builders/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Backend response received
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    // Builder data received from backend
    return NextResponse.json(data);
  } catch (error) {
    console.error('Frontend API route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch builder from backend'
    }, { status: 500 });
  }
}
