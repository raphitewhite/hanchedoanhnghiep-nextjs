import { NextRequest, NextResponse } from 'next/server';
import { detectCountryFromIP, getClientIP } from '@/lib/geolocation';

interface FormData {
  fullName: string;
  email: string;
  emailBusiness: string;
  pageName: string;
  phoneNumber: string;
  day: string;
  month: string;
  year: string;
  note: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormData = await request.json();
    
    // Get client IP and detect country
    const clientIP = getClientIP(request.headers);
    const locationData = await detectCountryFromIP(clientIP);
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      meta: {
        ip: clientIP,
        location: locationData
          ? [locationData.city, locationData.region, locationData.country]
              .filter(Boolean)
              .join(', ')
          : 'Unknown location',
      },
    });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

