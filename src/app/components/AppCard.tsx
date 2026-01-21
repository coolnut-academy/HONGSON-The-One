"use client";

import Image from "next/image";
import { ExternalLink, Ban } from "lucide-react";

export interface AppData {
    id: string;
    name: string;
    url: string;
    iconUrl: string;
    zone: "student" | "teacher" | "both";
    color?: string;
    isEnabled?: boolean;
}

interface AppCardProps {
    app: AppData;
}

export default function AppCard({ app }: AppCardProps) {
    const isEnabled = app.isEnabled !== false; // Default to true if undefined

    const handleClick = () => {
        if (!isEnabled) {
            alert("แอปนี้ยังไม่เปิดใช้งาน");
            return;
        }
        window.open(app.url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className={`group flex flex-col items-center gap-2 p-2 outline-none focus:outline-none ${!isEnabled ? "cursor-not-allowed" : ""}`}
        >
            {/* App Icon Container */}
            <div className="relative">
                {/* Glow effect on hover - only for enabled apps */}
                {isEnabled && (
                    <div
                        className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${app.color || "bg-gradient-to-br from-blue-400 to-purple-400"
                            }`}
                    />
                )}

                {/* Main icon container */}
                <div
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl overflow-hidden 
            ${isEnabled
                            ? `bg-gradient-to-br ${app.color || "from-slate-100 to-slate-200"}`
                            : "bg-slate-200"
                        }
            shadow-lg shadow-black/10
            border border-white/60
            transition-all duration-300 ease-out
            ${isEnabled
                            ? "group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/15 group-active:scale-95"
                            : "opacity-60"
                        }`}
                >
                    {/* Icon image */}
                    <div className={`absolute inset-1 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm flex items-center justify-center ${!isEnabled ? "grayscale" : ""}`}>
                        {app.iconUrl.startsWith("http") || app.iconUrl.startsWith("/") ? (
                            <Image
                                src={app.iconUrl}
                                alt={app.name}
                                width={64}
                                height={64}
                                className={`w-full h-full object-cover ${!isEnabled ? "grayscale opacity-50" : ""}`}
                                unoptimized
                            />
                        ) : (
                            // Fallback gradient icon with first letter
                            <div
                                className={`w-full h-full flex items-center justify-center ${isEnabled
                                    ? `bg-gradient-to-br ${app.color || "from-blue-500 to-purple-500"}`
                                    : "bg-slate-400"
                                    }`}
                            >
                                <span className="text-2xl sm:text-3xl font-bold text-white">
                                    {app.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Disabled indicator */}
                    {!isEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30 rounded-2xl">
                            <Ban className="w-8 h-8 text-white/80" />
                        </div>
                    )}

                    {/* External link indicator - only for enabled apps */}
                    {isEnabled && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                    )}
                </div>

                {/* Reflection effect - only for enabled apps */}
                {isEnabled && (
                    <div className="absolute inset-x-2 -bottom-2 h-4 bg-gradient-to-b from-black/5 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
            </div>

            {/* App Name */}
            <span className={`text-sm sm:text-base font-medium text-center line-clamp-2 max-w-[100px] sm:max-w-[120px] leading-tight transition-colors duration-300 ${isEnabled
                ? "text-slate-700 group-hover:text-slate-900"
                : "text-slate-400"
                }`}>
                {app.name}
            </span>
        </button>
    );
}
