import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3012';

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log('🔄 [Next.js] Proxying send-otp request to backend:', body);

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    console.log('📥 [Next.js] Backend response:', { status: response.status, data });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ [Next.js] Error proxying send-otp:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

