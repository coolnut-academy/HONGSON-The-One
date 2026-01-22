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
                        <AppCard app={app} priority={index < 10} />
                    </div>
                ))}
            </div>

            {/* App count indicator */}
            {/* App count indicator */}
            <div className="mt-8 flex justify-center items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50/50 backdrop-blur-sm border border-green-100/60 text-sm text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {apps.filter(app => app.isEnabled !== false).length} เปิดใช้งาน
                </span>

                {apps.filter(app => app.isEnabled === false).length > 0 && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50/50 backdrop-blur-sm border border-slate-100/60 text-sm text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        {apps.filter(app => app.isEnabled === false).length} ปิดใช้งาน
                    </span>
                )}
            </div>
        </div>
    );
}
