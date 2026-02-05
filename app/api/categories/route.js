import { NextResponse } from 'next/server';

export async function GET() {
  console.log('🚀 [CATEGORIES API] Route handler called');
  console.log('🚀 [CATEGORIES API] Environment:', process.env.NODE_ENV);
  console.log('🚀 [CATEGORIES API] Process env keys:', Object.keys(process.env).filter(key => key.includes('BACKEND')));
  
  try {
    // Categories API - Backend URL configured
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/categories`;
    
    console.log('🔗 [CATEGORIES API] Backend URL:', backendUrl);
    console.log('🔗 [CATEGORIES API] Full URL:', fullUrl);
    console.log('🔗 [CATEGORIES API] Making request to backend...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [CATEGORIES API] Backend response status:', response.status);
    console.log('📡 [CATEGORIES API] Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ [CATEGORIES API] Backend API error:', response.status);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [CATEGORIES API] Data received from backend:', data?.length || 'No data');
    console.log('✅ [CATEGORIES API] First item:', data?.[0]?.name || 'No items');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('💥 [CATEGORIES API] Frontend API route error:', error.message);
    console.error('💥 [CATEGORIES API] Error stack:', error.stack);
    
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
