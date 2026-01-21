"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:text-slate-800 dark:hover:text-white transition-all duration-300 hover:shadow-md hover:scale-105"
            aria-label={theme === "light" ? "เปลี่ยนเป็นโหมดมืด" : "เปลี่ยนเป็นโหมดสว่าง"}
            title={theme === "light" ? "เปลี่ยนเป็นโหมดมืด" : "เปลี่ยนเป็นโหมดสว่าง"}
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5 transition-transform duration-300" />
            ) : (
                <Sun className="w-5 h-5 transition-transform duration-300 text-yellow-400" />
            )}
        </button>
    );
}
