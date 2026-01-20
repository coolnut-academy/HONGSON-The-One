"use client";

import { useState } from "react";
import { Sparkles, Settings, Search } from "lucide-react";
import ZoneSwitcher from "./components/ZoneSwitcher";
import AppGrid from "./components/AppGrid";
import { AppData } from "./components/AppCard";

// Mock Apps Data - Replace with Firebase data later
const MockApps: AppData[] = [
  {
    id: "1",
    name: "Google Classroom",
    url: "https://classroom.google.com",
    iconUrl: "https://www.gstatic.com/classroom/logo_square_rounded.svg",
    zone: "both",
    color: "from-green-500 to-green-600",
  },
  {
    id: "2",
    name: "Google Meet",
    url: "https://meet.google.com",
    iconUrl: "https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png",
    zone: "both",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "3",
    name: "Google Drive",
    url: "https://drive.google.com",
    iconUrl: "https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png",
    zone: "both",
    color: "from-yellow-400 to-yellow-500",
  },
  {
    id: "4",
    name: "Canva",
    url: "https://www.canva.com",
    iconUrl: "https://static.canva.com/static/images/favicon-1.ico",
    zone: "student",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "5",
    name: "Kahoot!",
    url: "https://kahoot.com",
    iconUrl: "https://kahoot.com/wp-content/themes/flavor/assets/favicons/apple-touch-icon-180x180.png",
    zone: "student",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "6",
    name: "Quizizz",
    url: "https://quizizz.com",
    iconUrl: "https://cf.quizizz.com/img/quizizz_logos/purple-brandmark-600x164.png",
    zone: "student",
    color: "from-indigo-500 to-purple-600",
  },
  {
    id: "7",
    name: "YouTube Edu",
    url: "https://www.youtube.com/edu",
    iconUrl: "https://www.youtube.com/s/desktop/5a580f0b/img/favicon_144x144.png",
    zone: "student",
    color: "from-red-500 to-red-600",
  },
  {
    id: "8",
    name: "E-Library",
    url: "https://library.example.com",
    iconUrl: "",
    zone: "student",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "9",
    name: "Grade Book",
    url: "https://gradebook.example.com",
    iconUrl: "",
    zone: "teacher",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "10",
    name: "Admin Portal",
    url: "https://admin.example.com",
    iconUrl: "",
    zone: "teacher",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "11",
    name: "Lesson Planner",
    url: "https://planner.example.com",
    iconUrl: "",
    zone: "teacher",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "12",
    name: "Parent Connect",
    url: "https://parent.example.com",
    iconUrl: "",
    zone: "teacher",
    color: "from-violet-500 to-purple-600",
  },
];

type Zone = "student" | "teacher";

export default function Home() {
  const [currentZone, setCurrentZone] = useState<Zone>("teacher");

  // Filter apps based on current zone
  const filteredApps = MockApps.filter(
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
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
              <button className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 hover:shadow-md">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 hover:shadow-md">
                <Settings className="w-5 h-5" />
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
          <p className="text-sm text-slate-500">
            {currentZone === "student"
              ? "เข้าถึงเครื่องมือการเรียนรู้ได้ที่นี่"
              : "จัดการและติดตามการเรียนการสอน"}
          </p>
        </div>

        {/* Glass Card Container */}
        <div className="glass-card p-4 sm:p-6 md:p-8">
          <AppGrid
            apps={filteredApps}
            emptyMessage={`ไม่พบแอปพลิเคชันสำหรับ${currentZone === "student" ? "นักเรียน" : "ครู"
              }`}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-xs text-slate-400">
          Version 1.0.0 • Powered by{" "}
          <span className="font-medium text-slate-500">COOLNUT Academy</span>
        </p>
      </footer>
    </main>
  );
}
