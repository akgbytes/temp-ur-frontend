const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')
const fs = require('fs')

// Load environment variables from .env file
require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT, 10) || 3000


// Debug environment variables
console.log('🚀 [SERVER] Starting with configuration:')
console.log('🚀 [SERVER] NODE_ENV:', process.env.NODE_ENV)
console.log('🚀 [SERVER] HOSTNAME:', hostname)
console.log('🚀 [SERVER] PORT:', port)
console.log('🚀 [SERVER] BACKEND_URL:', process.env.BACKEND_URL)
console.log('🚀 [SERVER] Dev mode:', dev)

// Create Next.js app
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
}

// Function to serve static files
function serveStaticFile(req, res, filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    
    // Set appropriate headers
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    
    // Read and serve the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
    
    fileStream.on('error', (err) => {
      console.error('Error serving static file:', err)
      res.statusCode = 404
      res.end('File not found')
    })
  } catch (error) {
    console.error('Error in serveStaticFile:', error)
    res.statusCode = 500
    res.end('Internal server error')
  }
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Fix HTTPS behind proxy - ensure X-Forwarded-Proto is set correctly
      // This helps Next.js generate correct HTTPS URLs for RSC payloads
      if (process.env.NODE_ENV === 'production') {
        // Always set to https in production (Nginx handles HTTPS termination)
        req.headers['x-forwarded-proto'] = 'https';
        req.headers['x-forwarded-port'] = '443';
        req.headers['x-forwarded-host'] = req.headers['host'] || 'urbanesta.in';
        
        // Ensure host header is correct (not 0.0.0.0 or localhost)
        if (!req.headers['host'] || 
            req.headers['host'].includes('0.0.0.0') || 
            req.headers['host'].includes('localhost') ||
            req.headers['host'].includes('127.0.0.1')) {
          req.headers['host'] = 'urbanesta.in';
        }
        
        // Override the URL to use HTTPS for Next.js internal URL generation
        // This ensures RSC payloads use HTTPS URLs
        if (req.url && req.url.startsWith('http://')) {
          req.url = req.url.replace('http://', 'https://');
        }
      }

      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl

      // Handle static files from public directory
      if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/img/')) {
        const filePath = path.join(process.cwd(), 'public', pathname)
        
        // Check if file exists
        if (fs.existsSync(filePath)) {
          serveStaticFile(req, res, filePath)
          return
        }
      }

      // Handle Next.js static files
      if (pathname.startsWith('/_next/static/')) {
        const filePath = path.join(process.cwd(), '.next', 'static', pathname.replace('/_next/static/', ''))
        
        if (fs.existsSync(filePath)) {
          serveStaticFile(req, res, filePath)
          return
        }
      }

      // Handle all other requests with Next.js
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
