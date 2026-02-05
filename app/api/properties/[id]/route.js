export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3012';
    const fullUrl = `${backendUrl}/api/properties/${id}`;
    
    // Fetching property by ID from backend
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Backend response received
    
    if (!response.ok) {
      if (response.status === 404) {
        return Response.json({ 
          success: false, 
          error: 'Property not found',
          message: 'The requested property could not be found'
        }, { status: 404 });
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    // Property data received from backend
    
    return Response.json(data);
  } catch (error) {
    console.error('Frontend API route error:', error);
    
    return Response.json({ 
      success: false, 
      error: error.message,
      message: 'Failed to fetch property from backend'
    }, { status: 500 });
  }
}
