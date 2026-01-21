import type { Metadata, Viewport } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

// Configure Kanit font with multiple weights for versatility
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

// SEO Metadata Configuration
export const metadata: Metadata = {
  title: {
    default: "HONGSON THE ONE | Web App Center",
    template: "%s | HONGSON THE ONE",
  },
  description:
    "ศูนย์รวมเว็บแอปพลิเคชันสำหรับครูและนักเรียนโรงเรียนห้องสอนศึกษา - Web App Center for Teachers and Students",
  keywords: [
    "school links",
    "education",
    "HONGSON THE ONE",
    "web app center",
    "school portal",
    "ห้องสอนศึกษา",
    "แอปการศึกษา",
    "ครู",
    "นักเรียน",
  ],
  authors: [{ name: "COOLNUT Academy", url: "https://coolnut.academy" }],
  creator: "COOLNUT Academy",
  publisher: "COOLNUT Academy",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "HONGSON THE ONE | Web App Center",
    description: "ศูนย์รวมเว็บแอปพลิเคชันสำหรับครูและนักเรียนโรงเรียนห้องสอนศึกษา",
    type: "website",
    locale: "th_TH",
    siteName: "HONGSON THE ONE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HONGSON THE ONE - Web App Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HONGSON THE ONE | Web App Center",
    description: "ศูนย์รวมเว็บแอปพลิเคชันสำหรับครูและนักเรียนโรงเรียนห้องสอนศึกษา",
    images: ["/og-image.png"],
  },
};

// Viewport Configuration (separated from metadata in Next.js 13+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable}>
      <head>
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className="font-kanit antialiased">
        {/* Premium gradient background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40" />

        {/* Subtle animated gradient orbs for depth */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[40%] -top-[40%] h-[80%] w-[80%] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/30 blur-3xl animate-float" />
          <div className="absolute -right-[30%] -bottom-[30%] h-[70%] w-[70%] rounded-full bg-gradient-to-br from-purple-100/40 to-pink-100/30 blur-3xl animate-float-delayed" />
          <div className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-cyan-100/20 to-blue-100/20 blur-3xl animate-pulse-slow" />
        </div>

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
