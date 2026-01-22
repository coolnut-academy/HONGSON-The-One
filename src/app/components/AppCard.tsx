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
    priority?: boolean;
}

export default function AppCard({ app, priority = false }: AppCardProps) {
    const isEnabled = app.isEnabled !== false; // Default to true if undefined
    const isTransparent = app.color === "transparent";

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
            className={`group flex flex-col items-center gap-3 p-2 outline-none focus:outline-none ${!isEnabled ? "cursor-not-allowed" : ""}`}
        >
            {/* App Icon Container with Liquid Glass Effect */}
            <div className="relative">
                {/* Ambient glow on hover - only for enabled apps and not transparent */}
                {isEnabled && !isTransparent && (
                    <div
                        className="absolute -inset-3 rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500"
                        style={{
                            background: `linear-gradient(135deg, rgba(14, 165, 233, 0.5) 0%, rgba(168, 85, 247, 0.5) 100%)`,
                        }}
                    />
                )}

                {/* Main Liquid Glass icon container */}
                <div
                    className={`relative w-32 h-32 sm:w-32 sm:h-32 md:w-32 md:h-32 rounded-[28px] overflow-hidden 
                        ${isEnabled
                            ? (isTransparent ? "" : "bg-white/25 backdrop-blur-xl")
                            : "bg-slate-200/50 backdrop-blur-sm"
                        }
                        ${!isTransparent && "border border-white/40 shadow-xl shadow-black/5"}
                        transition-all duration-500 ease-out
                        ${isEnabled
                            ? "group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 group-active:scale-98"
                            : "opacity-60"
                        }`}
                    style={{
                        boxShadow: isEnabled && !isTransparent
                            ? `0 8px 32px rgba(0, 0, 0, 0.08), 
                               inset 0 1px 1px rgba(255, 255, 255, 0.7),
                               inset 0 -2px 4px rgba(0, 0, 0, 0.03)`
                            : undefined,
                    }}
                >
                    {/* Specular Highlight - Top shine effect */}
                    {!isTransparent && isEnabled && (
                        <div
                            className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-10 rounded-t-[28px]"
                            style={{
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 40%, transparent 100%)',
                            }}
                        />
                    )}

                    {/* Icon image */}
                    <div className={`absolute ${isTransparent ? "inset-0" : "inset-1"} rounded-[24px] overflow-hidden ${!isTransparent ? "bg-white/80 backdrop-blur-md" : ""} flex items-center justify-center ${!isEnabled ? "grayscale" : ""}`}>
                        {app.iconUrl.startsWith("http") || app.iconUrl.startsWith("/") || app.iconUrl.startsWith("data:") ? (
                            <Image
                                src={app.iconUrl}
                                alt={app.name}
                                width={128}
                                height={128}
                                className={`w-full h-full ${isTransparent ? "object-contain" : "object-cover"} ${!isEnabled ? "grayscale opacity-50" : ""} transition-transform duration-500 group-hover:scale-105`}
                                priority={priority}
                            />
                        ) : (
                            // Fallback gradient icon with first letter
                            <div
                                className={`w-full h-full flex items-center justify-center ${isEnabled
                                    ? "bg-gradient-to-br from-cyan-400/90 to-purple-500/90"
                                    : "bg-slate-400"
                                    }`}
                            >
                                <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                                    {app.name.replace(/<[^>]*>/g, '').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Disabled indicator */}
                    {!isEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm rounded-[28px]">
                            <div className="p-3 rounded-full bg-white/30 backdrop-blur-xl">
                                <Ban className="w-6 h-6 text-white/90" />
                            </div>
                        </div>
                    )}

                    {/* Liquid Glass External link indicator - only for enabled apps */}
                    {isEnabled && !isTransparent && (
                        <div
                            className="absolute -top-1 -right-1 w-6 h-6 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75"
                            style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.5)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                            }}
                        >
                            <ExternalLink className="w-3 h-3 text-slate-600" />
                        </div>
                    )}

                    {/* Edge glow effect on hover */}
                    {isEnabled && !isTransparent && (
                        <div
                            className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, transparent 30%, transparent 70%, rgba(168, 85, 247, 0.3) 100%)',
                            }}
                        />
                    )}
                </div>

                {/* Liquid reflection effect - only for enabled apps and not transparent */}
                {isEnabled && !isTransparent && (
                    <div
                        className="absolute inset-x-4 -bottom-3 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                        }}
                    />
                )}
            </div>

            {/* App Name with Liquid Glass background on hover */}
            <div className="relative">
                <span
                    className={`block text-sm sm:text-base font-medium text-center max-w-[110px] sm:max-w-[130px] leading-tight transition-all duration-300 ${isEnabled
                        ? "text-slate-700 group-hover:text-slate-900"
                        : "text-slate-400"
                        }`}
                    dangerouslySetInnerHTML={{ __html: app.name }}
                />
                {/* Subtle text glow on hover */}
                {isEnabled && (
                    <div
                        className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                        }}
                    />
                )}
            </div>
        </button>
    );
}
