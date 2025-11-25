import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Privacy Center",
  description: "Learn how we collect, use, and share your personal data. Understand your privacy rights and how to manage your information on Meta platforms.",
  openGraph: {
    type: "website",
    url: "https://www.facebook.com/privacy/",
    title: "Meta Privacy Center",
    description: "Learn how we collect, use, and share your personal data. Understand your privacy rights and how to manage your information on Meta platforms.",
    images: [
      {
        url: "/image.png",
        width: 1920,
        height: 840,
        alt: "Meta Privacy Center",
      },
    ],
    siteName: "Meta Privacy Center",
    locale: "en_US",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

