export async function GET() {
  console.log('🚀 [HEALTH API] Route handler called');
  console.log('🚀 [HEALTH API] Environment:', process.env.NODE_ENV);
  console.log('🚀 [HEALTH API] Process env keys:', Object.keys(process.env).filter(key => key.includes('BACKEND')));
  
  try {
    // Basic health check for ALB
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      port: process.env.PORT || 3000,
      nodeEnv: process.env.NODE_ENV || "production",
      backendUrl: process.env.BACKEND_URL || 'not set',
      apiRoutes: {
        builders: '/api/builders',
        cities: '/api/cities',
        categories: '/api/categories',
        properties: '/api/properties'
      }
    };

    console.log('✅ [HEALTH API] Health check data:', healthData);

    // Return 200 status for ALB health checks
    return Response.json(healthData, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('💥 [HEALTH API] Health check error:', error.message);
    
    // Return 503 for unhealthy state
    return Response.json(
      { 
        status: "unhealthy", 
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}