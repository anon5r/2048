// Cloudflare Worker for puzzle-2024
// This worker handles any additional functionality needed for Cloudflare Pages

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Get the original response
  const response = await fetch(request)
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response)
  
  // Add security headers if they're not already set by _headers
  newResponse.headers.set('X-Frame-Options', 'DENY')
  newResponse.headers.set('X-Content-Type-Options', 'nosniff')
  newResponse.headers.set('Referrer-Policy', 'no-referrer')
  
  return newResponse
}