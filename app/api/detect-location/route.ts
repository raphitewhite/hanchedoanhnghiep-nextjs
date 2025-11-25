import { NextRequest, NextResponse } from 'next/server';

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

// Detect country from IP using ipgeolocation.io
async function detectCountryFromIP(ip: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
    if (!apiKey) {
      return { error: 'API key not configured' };
    }

    const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
    const data = await response.json();
    
    return {
      ip: data.ip || ip,
      country: data.country_name || null,
      countryCode: data.country_code2 || null,
      city: data.city || null,
      region: data.state_prov || null,
      timezone: data.time_zone?.name || null,
    };
  } catch (error) {
    console.error('Error detecting country from IP:', error);
    return { error: 'Failed to detect location' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const locationData = await detectCountryFromIP(clientIP);
    
    return NextResponse.json(locationData);
  } catch (error) {
    console.error('Error in detect-location API:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

