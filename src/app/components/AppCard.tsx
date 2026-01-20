"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

export interface AppData {
    id: string;
    name: string;
    url: string;
    iconUrl: string;
    zone: "student" | "teacher" | "both";
    color?: string;
}

interface AppCardProps {
    app: AppData;
}

export default function AppCard({ app }: AppCardProps) {
    const handleClick = () => {
        window.open(app.url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className="group flex flex-col items-center gap-2 p-2 outline-none focus:outline-none"
        >
            {/* App Icon Container */}
            <div className="relative">
                {/* Glow effect on hover */}
                <div
                    className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 ${app.color || "bg-gradient-to-br from-blue-400 to-purple-400"
                        }`}
                />

                {/* Main icon container */}
                <div
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-2xl overflow-hidden 
            bg-gradient-to-br ${app.color || "from-slate-100 to-slate-200"}
            shadow-lg shadow-black/10
            border border-white/60
            transition-all duration-300 ease-out
            group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/15
            group-active:scale-95`}
                >
                    {/* Icon image */}
                    <div className="absolute inset-1 rounded-xl overflow-hidden bg-white/90 backdrop-blur-sm flex items-center justify-center">
                        {app.iconUrl.startsWith("http") || app.iconUrl.startsWith("/") ? (
                            <Image
                                src={app.iconUrl}
                                alt={app.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            // Fallback gradient icon with first letter
                            <div
                                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${app.color || "from-blue-500 to-purple-500"
                                    }`}
                            >
                                <span className="text-2xl sm:text-3xl font-bold text-white">
                                    {app.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* External link indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                    </div>
                </div>

                {/* Reflection effect */}
                <div className="absolute inset-x-2 -bottom-2 h-4 bg-gradient-to-b from-black/5 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* App Name */}
            <span className="text-sm sm:text-base font-medium text-slate-700 text-center line-clamp-2 max-w-[100px] sm:max-w-[120px] leading-tight group-hover:text-slate-900 transition-colors duration-300">
                {app.name}
            </span>
        </button>
    );
}
