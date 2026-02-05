export async function GET(request) {
  console.log('🚀 [PROPERTIES API] Route handler called');
  console.log('🚀 [PROPERTIES API] Environment:', process.env.NODE_ENV);
  console.log('🚀 [PROPERTIES API] Process env keys:', Object.keys(process.env).filter(key => key.includes('BACKEND')));
  console.log('🚀 [PROPERTIES API] Request URL:', request.url);
  
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = queryString ? `${backendUrl}/api/properties?${queryString}` : `${backendUrl}/api/properties`;
    
    console.log('🔗 [PROPERTIES API] Backend URL:', backendUrl);
    console.log('🔗 [PROPERTIES API] Query string:', queryString);
    console.log('🔗 [PROPERTIES API] Full URL:', fullUrl);
    console.log('🔗 [PROPERTIES API] Making request to backend...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [PROPERTIES API] Backend response status:', response.status);
    console.log('📡 [PROPERTIES API] Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle rate limiting specifically
    if (response.status === 429) {
      console.log('⚠️ [PROPERTIES API] Rate limited, using fallback');
      return Response.json({ 
        success: true, 
        data: [],
        pagination: { current: 1, pages: 1, total: 0, limit: 20 },
        message: 'Rate limited - please try again later'
      });
    }
    
    if (!response.ok) {
      console.error('❌ [PROPERTIES API] Backend API error:', response.status);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [PROPERTIES API] Data received from backend:', data?.data?.length || 'No data');
    console.log('✅ [PROPERTIES API] Pagination:', data?.pagination || 'No pagination');
    
    return Response.json(data);
  } catch (error) {
    console.error('💥 [PROPERTIES API] Frontend API route error:', error.message);
    console.error('💥 [PROPERTIES API] Error stack:', error.stack);
    
    // Return empty data instead of error for better UX
    return Response.json({ 
      success: true, 
      data: [],
      pagination: { current: 1, pages: 1, total: 0, limit: 20 },
      error: error.message,
      message: 'Failed to fetch properties from backend'
    });
  }
}
