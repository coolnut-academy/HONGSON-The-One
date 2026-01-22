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
            {/* Header Section */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Top Bar with Logo and Actions */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src="/logo.png?v=2"
                                    alt="HONGSON METAVERSE MODEL Logo"
                                    width={48}
                                    height={48}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                    unoptimized
                                />
                                {/* Online indicator */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-gradient">
                                    HONGSON THE ONE
                                </h1>
                                <p className="text-xs text-slate-500 hidden sm:block">
                                    Web App Center
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchApps}
                                className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 hover:shadow-md"
                                title="รีเฟรช"
                            >
                                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
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
                {/* Section Title */}
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1">
                        {currentZone === "student" ? "📚 แอปสำหรับนักเรียน" : "📋 แอปสำหรับครู"}
                    </h2>

                </div>

                {/* Glass Card Container */}
                <div className="glass-card p-4 sm:p-6 md:p-8">
                    {isLoading ? (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-slate-500">กำลังโหลดแอปพลิเคชัน...</p>
                        </div>
                    ) : error ? (
                        /* Error State */
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-red-400" />
                            </div>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchApps}
                                className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-all"
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

            {/* Footer */}
            <footer className="text-center py-4">
                <div className="flex items-center justify-center gap-3">
                    <p className="text-xs text-slate-400">
                        Version 1.0.0 • Powered by{" "}
                        <span className="font-medium text-slate-500">COOLNUT Academy</span>
                    </p>
                    {/* Secret Admin Entrance - Subtle Lock Icon */}
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-100/50 transition-all duration-300 opacity-50 hover:opacity-100"
                        aria-label="Admin Login"
                        title="Admin Access"
                    >
                        <Lock className="w-3.5 h-3.5" />
                    </button>
                </div>
            </footer>

            {/* Admin Login Modal */}
            <AdminLoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </main >
    );
}
