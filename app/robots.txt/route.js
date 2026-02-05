import { NextResponse } from 'next/server';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /user/
Disallow: /debug-auth/
Disallow: /profile-completion/

# Allow important pages
Allow: /properties
Allow: /builder
Allow: /city
Allow: /about
Allow: /contact-us
Allow: /faq

# Sitemap
Sitemap: https://urbanesta.in/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
