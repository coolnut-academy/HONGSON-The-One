"use client";

import AppCard, { AppData } from "./AppCard";

interface AppGridProps {
    apps: AppData[];
    emptyMessage?: string;
}

export default function AppGrid({
    apps,
    emptyMessage = "ไม่พบแอปพลิเคชัน",
}: AppGridProps) {
    if (apps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                    <span className="text-4xl">📭</span>
                </div>
                <p className="text-slate-500 text-center">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Responsive grid layout - Mobile-first design */}
            <div
                className="grid gap-3 sm:gap-5 md:gap-6 justify-items-center
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6"
            >
                {apps.map((app, index) => (
                    <div
                        key={app.id}
                        className="animate-fade-in-up opacity-0"
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        <AppCard app={app} />
                    </div>
                ))}
            </div>

            {/* App count indicator */}
            <div className="mt-8 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-sm text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    {apps.length} แอปพลิเคชัน
                </span>
            </div>
        </div>
    );
}
