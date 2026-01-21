"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-300" />
                <div className="absolute bottom-1/4 right-1/4 w-2.5 h-2.5 bg-pink-400 rounded-full animate-ping delay-700" />
            </div>

            {/* Main Content Container */}
            <div className="glass-card p-8 sm:p-12 max-w-lg w-full text-center relative overflow-hidden">
                {/* Decorative gradient corner */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl" />

                {/* 404 Number with Gradient */}
                <div className="relative mb-6">
                    <h1
                        className="text-8xl sm:text-9xl font-black"
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}
                    >
                        404
                    </h1>
                    {/* Sparkle effect */}
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-pulse" />
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative"
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                            boxShadow: "0 10px 40px rgba(37, 99, 235, 0.3)",
                        }}
                    >
                        <Search className="w-10 h-10 text-white" />
                    </div>
                </div>

                {/* Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                    ไม่พบหน้าที่คุณต้องการ
                </h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    ขออภัย หน้าที่คุณกำลังค้นหาอาจถูกลบ ย้าย หรือไม่มีอยู่จริง
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    {/* Go Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center"
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                            boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
                        }}
                    >
                        <Home className="w-5 h-5" />
                        กลับหน้าหลัก
                    </Link>

                    {/* Secondary Button */}
                    <button
                        onClick={() => typeof window !== "undefined" && window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-600 bg-white/60 border-2 border-slate-200 hover:bg-white hover:border-slate-300 transition-all w-full sm:w-auto justify-center"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        ย้อนกลับ
                    </button>
                </div>

                {/* Fun Footer Message */}
                <div className="mt-10 pt-6 border-t border-slate-200/50">
                    <p className="text-xs text-slate-400">
                        💡 เคล็ดลับ: ตรวจสอบ URL ที่พิมพ์อีกครั้ง หรือใช้เมนูหลัก
                    </p>
                </div>
            </div>

            {/* Page Info */}
            <div className="mt-8 text-center">
                <p className="text-xs text-slate-400">
                    HONGSON THE ONE • Web App Center
                </p>
            </div>
        </main>
    );
}
