export async function GET() {
  console.log('🚀 [BUILDERS API] Route handler called');
  console.log('🚀 [BUILDERS API] Environment:', process.env.NODE_ENV);
  console.log('🚀 [BUILDERS API] Process env keys:', Object.keys(process.env).filter(key => key.includes('BACKEND')));
  
  try {
    // Fetching builders from backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://10.0.2.144:80' : 'http://localhost:3012');
    const fullUrl = `${backendUrl}/api/builders`;
    
    console.log('🔗 [BUILDERS API] Backend URL:', backendUrl);
    console.log('🔗 [BUILDERS API] Full URL:', fullUrl);
    console.log('🔗 [BUILDERS API] Making request to backend...');
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 [BUILDERS API] Backend response status:', response.status);
    console.log('📡 [BUILDERS API] Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle rate limiting specifically
    if (response.status === 429) {
      console.log('⚠️ [BUILDERS API] Rate limited, using fallback');
      return Response.json([]);
    }
    
    if (!response.ok) {
      console.error('❌ [BUILDERS API] Backend API error:', response.status);
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [BUILDERS API] Data received from backend:', data?.length || 'No data');
    console.log('✅ [BUILDERS API] First item:', data?.[0]?.name || 'No items');
    
    return Response.json(data);
  } catch (error) {
    console.error('💥 [BUILDERS API] Frontend API route error:', error.message);
    console.error('💥 [BUILDERS API] Error stack:', error.stack);
    
    // Return empty array instead of error for better UX
    return Response.json([]);
  }
}
