import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

// Configure Kanit font with multiple weights for versatility
const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HONGSON THE ONE | Web App Center",
  description:
    "ศูนย์รวมลิงก์แอปพลิเคชันสำหรับโรงเรียน - School Links Aggregation Platform",
  keywords: [
    "school links",
    "education",
    "HONGSON THE ONE",
    "web app center",
    "school portal",
  ],
  authors: [{ name: "COOLNUT Academy" }],
  openGraph: {
    title: "HONGSON THE ONE | Web App Center",
    description: "ศูนย์รวมลิงก์แอปพลิเคชันสำหรับโรงเรียน",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={kanit.variable}>
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
