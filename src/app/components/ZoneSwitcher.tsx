"use client";

import { User, GraduationCap } from "lucide-react";

type Zone = "student" | "teacher";

interface ZoneSwitcherProps {
    currentZone: Zone;
    onZoneChange: (zone: Zone) => void;
}

export default function ZoneSwitcher({
    currentZone,
    onZoneChange,
}: ZoneSwitcherProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Glassmorphism container */}
            <div className="relative p-1.5 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-lg">
                {/* Animated sliding background indicator */}
                <div
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-xl transition-all duration-500 ease-out ${currentZone === "teacher"
                        ? "left-1.5 bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/40"
                        : "left-[calc(50%+3px)] bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/40"
                        }`}
                >
                    {/* Glow effect */}
                    <div
                        className={`absolute inset-0 rounded-xl blur-xl opacity-60 ${currentZone === "teacher"
                            ? "bg-amber-400"
                            : "bg-blue-400"
                            }`}
                    />
                </div>

                {/* Buttons container */}
                <div className="relative flex">
                    {/* Teacher Zone Button - Now First */}
                    <button
                        onClick={() => onZoneChange("teacher")}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 ${currentZone === "teacher"
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        <GraduationCap
                            className={`w-5 h-5 transition-transform duration-300 ${currentZone === "teacher" ? "scale-110" : "scale-100"
                                }`}
                        />
                        <span className="font-semibold text-sm sm:text-base">
                            ครู
                        </span>
                    </button>

                    {/* Student Zone Button - Now Second */}
                    <button
                        onClick={() => onZoneChange("student")}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl transition-all duration-300 ${currentZone === "student"
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        <User
                            className={`w-5 h-5 transition-transform duration-300 ${currentZone === "student" ? "scale-110" : "scale-100"
                                }`}
                        />
                        <span className="font-semibold text-sm sm:text-base">
                            นักเรียน
                        </span>
                    </button>
                </div>
            </div>

            {/* Zone indicator text */}
            <p className="text-center mt-3 text-sm text-slate-500 dark:text-slate-400">
                กำลังดู:{" "}
                <span
                    className={`font-semibold ${currentZone === "student" ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
                        }`}
                >
                    {currentZone === "student" ? "โซนนักเรียน" : "โซนครู"}
                </span>
            </p>
        </div>
    );
}
