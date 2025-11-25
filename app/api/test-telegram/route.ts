import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

export async function GET(request: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const envCheck = {
      hasBotToken: !!botToken,
      hasChatId: !!chatId,
      botTokenLength: botToken?.length || 0,
      chatIdValue: chatId || 'MISSING',
    };

    if (!botToken || !chatId) {
      return NextResponse.json({
        success: false,
        message: 'Telegram credentials not configured',
        envCheck,
      }, { status: 500 });
    }

    // Test send message
    const testMessage = '🧪 Test message from Vercel deployment';
    const success = await sendTelegramMessage(testMessage);

    return NextResponse.json({
      success,
      message: success ? 'Test message sent successfully' : 'Failed to send test message',
      envCheck,
    });
  } catch (error) {
    console.error('Test Telegram error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error testing Telegram',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

