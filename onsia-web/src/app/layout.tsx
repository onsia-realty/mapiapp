import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "온시아 부동산 플랫폼",
  description: "분양권 전매, 신규분양정보, 아파트 매물 정보를 한눈에! 청약홈 연동, 실거래가 조회, 주변 학군/교통 정보까지",
  keywords: ["분양권", "전매", "아파트", "부동산", "청약", "신규분양", "실거래가", "마피"],
  authors: [{ name: "온시아" }],
  creator: "온시아",
  publisher: "온시아",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://onsia-web.vercel.app",
    siteName: "온시아 부동산 플랫폼",
    title: "온시아 - 분양권 전매 & 신규분양 플랫폼",
    description: "분양권 전매, 신규분양정보, 아파트 매물 정보를 한눈에! 청약홈 연동, 실거래가 조회, 주변 학군/교통 정보까지",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "온시아 부동산 플랫폼",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "온시아 - 분양권 전매 & 신규분양 플랫폼",
    description: "분양권 전매, 신규분양정보, 아파트 매물 정보를 한눈에!",
    images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=630&fit=crop"],
  },

  // 기타
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
