"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Sparkles, Lock, Loader2, RefreshCw } from "lucide-react";
import ZoneSwitcher from "./ZoneSwitcher";
import AppGrid from "./AppGrid";
import { AppData } from "./AppCard";
import AdminLoginModal from "./AdminLoginModal";
import { getApps, AppDocument } from "@/lib/firestore";

type Zone = "student" | "teacher";

// Convert Firestore AppDocument to AppData format
function toAppData(doc: AppDocument): AppData {
    return {
        id: doc.id || "",
        name: doc.name,
        url: doc.url,
        iconUrl: doc.iconUrl,
        zone: doc.zone,
        color: doc.color,
        isEnabled: doc.isEnabled !== false, // Default to true if undefined
    };
}

export default function HomeContent() {
    const [currentZone, setCurrentZone] = useState<Zone>("teacher");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [apps, setApps] = useState<AppData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch apps from Firestore
    const fetchApps = useCallback(async () => {
        try {
            setError("");
            const fetchedApps = await getApps();
            setApps(fetchedApps.map(toAppData));
        } catch (err) {
            console.error("Failed to fetch apps:", err);
            setError("ไม่สามารถโหลดข้อมูลแอปได้");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load apps on mount
    useEffect(() => {
        fetchApps();
    }, [fetchApps]);

    // Check for showLogin query param (from middleware redirect)
    useEffect(() => {
        if (searchParams.get("showLogin") === "true") {
            setIsLoginModalOpen(true);
            // Clean up the URL
            router.replace("/", { scroll: false });
        }
    }, [searchParams, router]);

    // Handle successful login
    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        router.push("/admin/dashboard");
    };

    // Filter apps based on current zone
    const filteredApps = apps.filter(
        (app) => app.zone === currentZone || app.zone === "both"
    );

    return (
        <main className="min-h-screen flex flex-col pb-8">
            {/* Liquid Glass Header */}
            <header className="sticky top-0 z-50 glass-header">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Top Bar with Logo and Actions */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* Liquid Glass Logo Container */}
                                <div className="relative p-1 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/50 shadow-lg">
                                    <Image
                                        src="/logo.png"
                                        alt="HONGSON METAVERSE MODEL Logo"
                                        width={48}
                                        height={48}
                                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl"
                                        priority
                                    />
                                    {/* Specular highlight on logo */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                                </div>
                                {/* Online indicator with glow */}
                                <div className="absolute -bottom-0.5 -right-0.5">
                                    <div className="w-3 h-3 bg-emerald-400 rounded-full border-2 border-white/80 shadow-lg" />
                                    <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-60" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-gradient">
                                    HONGSON THE ONE
                                </h1>
                                <p className="text-xs text-slate-500/80 hidden sm:block">
                                    Web App Center
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons - Liquid Glass Style */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchApps}
                                className="glass-button p-2.5 rounded-xl"
                                title="รีเฟรช"
                            >
                                <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? "animate-spin" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {/* Zone Switcher */}
                    <ZoneSwitcher
                        currentZone={currentZone}
                        onZoneChange={setCurrentZone}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:py-8">
                {/* Section Title with Liquid Glass pill */}
                <div className="mb-6 sm:mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-lg border border-white/40 shadow-sm">
                        <span className="text-lg">
                            {currentZone === "student" ? "📚" : "📋"}
                        </span>
                        <h2 className="text-base sm:text-lg font-semibold text-slate-700">
                            {currentZone === "student" ? "แอปสำหรับนักเรียน" : "แอปสำหรับครู"}
                        </h2>
                    </div>
                </div>

                {/* Liquid Glass Card Container */}
                <div className="glass-card p-4 sm:p-6 md:p-8">
                    {isLoading ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                                </div>
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-400 blur-2xl opacity-20" />
                            </div>
                            <p className="text-slate-500 mt-4 font-medium">กำลังโหลดแอปพลิเคชัน...</p>
                        </div>
                    ) : error ? (
                        /* Error State */
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400/20 to-orange-400/20 backdrop-blur-xl border border-white/40 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-rose-400" />
                                </div>
                                <div className="absolute inset-0 rounded-2xl bg-rose-400 blur-2xl opacity-15" />
                            </div>
                            <p className="text-rose-600 mt-4 mb-4 font-medium">{error}</p>
                            <button
                                onClick={fetchApps}
                                className="glass-button-primary px-6 py-3 rounded-xl font-medium"
                            >
                                ลองใหม่อีกครั้ง
                            </button>
                        </div>
                    ) : (
                        /* Apps Grid */
                        <AppGrid
                            apps={filteredApps}
                            emptyMessage={`ไม่พบแอปพลิเคชันสำหรับ${currentZone === "student" ? "นักเรียน" : "ครู"
                                }`}
                        />
                    )}
                </div>
            </div>

            {/* Footer with Liquid Glass Style */}
            <footer className="text-center py-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-lg border border-white/30">
                        <p className="text-xs text-slate-500">
                            Version 1.0.0 • Powered by{" "}
                            <span className="font-medium text-slate-600">Mr.Satit Siriwach(Fullstack-Developer)</span>
                        </p>
                        {/* Secret Admin Entrance - Subtle Lock Icon */}
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="p-1.5 rounded-lg text-slate-400/60 hover:text-slate-600 hover:bg-white/30 transition-all duration-300"
                            aria-label="Admin Login"
                            title="Admin Access"
                        >
                            <Lock className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </footer>

            {/* Admin Login Modal */}
            <AdminLoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </main>
    );
}
