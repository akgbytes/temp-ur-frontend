import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 [CITIES API] Route handler called');
  console.log('🚀 [CITIES API] Environment:', process.env.NODE_ENV);
  console.log('🚀 [CITIES API] Process env keys:', Object.keys(process.env).filter(key => key.includes('BACKEND')));
  
  try {
    // Fetching cities from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/cities`;
    
    console.log('🔗 [CITIES API] Backend URL:', backendUrl);
    console.log('🔗 [CITIES API] Full URL:', fullUrl);
    console.log('🔗 [CITIES API] Making request to backend...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [CITIES API] Backend response status:', response.status);
    console.log('📡 [CITIES API] Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle rate limiting specifically
    if (response.status === 429) {
      console.log('⚠️ [CITIES API] Rate limited, using fallback');
      return NextResponse.json([]);
    }
    
    if (!response.ok) {
      console.error('❌ [CITIES API] Backend API error:', response.status);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [CITIES API] Data received from backend:', data?.length || 'No data');
    console.log('✅ [CITIES API] First item:', data?.[0]?.name || 'No items');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [CITIES API] Frontend API route error:', error.message);
    console.error('💥 [CITIES API] Error stack:', error.stack);
    
    // Return empty array instead of error for better UX
    return NextResponse.json([]);
  }
}
