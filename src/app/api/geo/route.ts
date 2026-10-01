import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const headers = request.headers;

  // Check common CDN headers
  const country =
    headers.get('cf-ipcountry') || // Cloudflare
    headers.get('x-vercel-ip-country') || // Vercel
    headers.get('cloudfront-viewer-country') || // AWS CloudFront
    headers.get('x-country') || // Generic reverse proxy
    headers.get('x-client-ip-country') ||
    null;

  const validCountry =
    country && country.trim() !== '' && country.toUpperCase() !== 'XX'
      ? country.trim().toUpperCase()
      : null;

  return NextResponse.json({ country: validCountry });
}
