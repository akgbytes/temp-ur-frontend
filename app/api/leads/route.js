import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('🚀 [LEADS API] Route handler called');
    
    const body = await request.json();
    console.log('📝 [LEADS API] Lead data received:', body);

    // Validate required fields
    const { name, phone, city } = body;
    if (!name || !phone || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, phone, city' },
        { status: 400 }
      );
    }

    // Get backend URL from environment
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3012';
    const fullUrl = `${backendUrl}/api/leads`;
    
    console.log('🔗 [LEADS API] Backend URL:', backendUrl);
    console.log('🔗 [LEADS API] Full URL:', fullUrl);

    // Forward the request to backend
    const backendResponse = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 [LEADS API] Backend response status:', backendResponse.status);

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('✅ [LEADS API] Lead saved successfully');
      return NextResponse.json({ success: true, data });
    } else {
      let errorData;
      try {
        errorData = await backendResponse.json();
      } catch {
        errorData = await backendResponse.text();
      }
      console.log('❌ [LEADS API] Backend error:', errorData);
      const errorMessage = typeof errorData === 'object' 
        ? (errorData.error || errorData.message || 'Failed to save lead')
        : errorData || 'Failed to save lead';
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: backendResponse.status }
      );
    }

  } catch (error) {
    console.error('💥 [LEADS API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
