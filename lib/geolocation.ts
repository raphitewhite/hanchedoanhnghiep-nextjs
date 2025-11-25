/**
 * Utility functions for IP geolocation
 */

export interface LocationData {
  ip: string;
  country: string | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  timezone: string | null;
}

/**
 * Detect country from IP using ipgeolocation.io
 */
export async function detectCountryFromIP(ip: string): Promise<LocationData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
    if (!apiKey) {
      console.error('IP Geolocation API key not configured');
      return null;
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
    return null;
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

