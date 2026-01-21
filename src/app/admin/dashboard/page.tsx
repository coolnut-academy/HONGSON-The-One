"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    LogOut,
    Plus,
    Loader2,
    Sparkles,
    Pencil,
    Trash2,
    ChevronUp,
    ChevronDown,
    AppWindow,
    GraduationCap,
    Briefcase,
    Globe,
    AlertTriangle,
    RefreshCw,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import {
    getApps,
    addApp,
    updateApp,
    deleteApp,
    reorderApp,
    AppDocument,
} from "@/lib/firestore";
import { deleteImage } from "@/lib/storage";
import AppFormModal from "@/app/components/AppFormModal";

// Confirmation Modal Component
function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isLoading: boolean;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-sm mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                            <p className="text-sm text-slate-500">{message}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                            ลบ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Zone Badge Component
function ZoneBadge({ zone }: { zone: "student" | "teacher" | "both" }) {
    const config = {
        student: {
            icon: GraduationCap,
            label: "นักเรียน",
            bg: "bg-blue-100",
            text: "text-blue-700",
        },
        teacher: {
            icon: Briefcase,
            label: "ครู",
            bg: "bg-purple-100",
            text: "text-purple-700",
        },
        both: {
            icon: Globe,
            label: "ทั้งหมด",
            bg: "bg-green-100",
            text: "text-green-700",
        },
    };

    const { icon: Icon, label, bg, text } = config[zone];

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
            <Icon className="w-3 h-3" />
            {label}
        </span>
    );
}

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [apps, setApps] = useState<AppDocument[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<AppDocument | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<AppDocument | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReordering, setIsReordering] = useState<string | null>(null);
    const [isToggling, setIsToggling] = useState<string | null>(null);
    const [error, setError] = useState("");
    const router = useRouter();

    // Fetch apps from Firestore
    const fetchApps = useCallback(async () => {
        try {
            const fetchedApps = await getApps();
            setApps(fetchedApps);
            setError("");
        } catch (err) {
            console.error("Failed to fetch apps:", err);
            setError("ไม่สามารถโหลดข้อมูลแอปได้");
        }
    }, []);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/check");
                const data = await response.json();

                if (!data.authenticated) {
                    router.push("/?showLogin=true");
                } else {
                    setIsLoading(false);
                    fetchApps();
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/?showLogin=true");
            }
        };

        checkAuth();
    }, [router, fetchApps]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Handle add/edit submission
    const handleFormSubmit = async (
        data: Omit<AppDocument, "id" | "order" | "createdAt" | "updatedAt">
    ) => {
        if (editingApp) {
            // Update existing app
            await updateApp(editingApp.id!, data);
        } else {
            // Add new app
            await addApp(data);
        }
        await fetchApps();
        setEditingApp(null);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteConfirm) return;

        setIsDeleting(true);
        try {
            // Delete icon from storage if it's a Firebase URL
            if (deleteConfirm.iconUrl) {
                await deleteImage(deleteConfirm.iconUrl);
            }
            // Delete from Firestore
            await deleteApp(deleteConfirm.id!);
            await fetchApps();
            setDeleteConfirm(null);
        } catch (err) {
            console.error("Delete failed:", err);
            setError("ลบแอปไม่สำเร็จ");
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle reorder
    const handleReorder = async (appId: string, direction: "up" | "down") => {
        setIsReordering(appId);
        try {
            await reorderApp(appId, direction);
            await fetchApps();
        } catch (err) {
            console.error("Reorder failed:", err);
        } finally {
            setIsReordering(null);
        }
    };

    // Open edit modal
    const openEditModal = (app: AppDocument) => {
        setEditingApp(app);
        setIsFormModalOpen(true);
    };

    // Open add modal
    const openAddModal = () => {
        setEditingApp(null);
        setIsFormModalOpen(true);
    };

    // Handle toggle enabled/disabled
    const handleToggleEnabled = async (app: AppDocument) => {
        setIsToggling(app.id!);
        try {
            const newEnabledState = app.isEnabled === false ? true : false;
            await updateApp(app.id!, { isEnabled: newEnabledState });
            await fetchApps();
        } catch (err) {
            console.error("Toggle enabled failed:", err);
            setError("เปลี่ยนสถานะแอปไม่สำเร็จ");
        } finally {
            setIsToggling(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-slate-500">กำลังตรวจสอบสิทธิ์...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src="/logo.png"
                                    alt="HONGSON METAVERSE MODEL Logo"
                                    width={48}
                                    height={48}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl shadow-lg"
                                />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gradient">
                                    Admin Dashboard
                                </h1>
                                <p className="text-xs text-slate-500">HONGSON THE ONE</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchApps}
                                className="p-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 text-slate-600 hover:bg-white/80 hover:text-slate-800 transition-all duration-200 hover:shadow-md"
                                title="รีเฟรชข้อมูล"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium text-sm disabled:opacity-50"
                            >
                                {isLoggingOut ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LogOut className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">ออกจากระบบ</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <AppWindow className="w-7 h-7 text-purple-600" />
                            จัดการแอปพลิเคชัน
                        </h2>
                        <p className="text-slate-500 mt-1">
                            เพิ่ม แก้ไข ลบ หรือเรียงลำดับแอปที่แสดงบนหน้าหลัก
                        </p>
                    </div>

                    {/* Add New Button */}
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                            boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
                        }}
                    >
                        <Plus className="w-5 h-5" />
                        เพิ่มแอปใหม่
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Apps Table/List */}
                <div className="glass-card overflow-hidden">
                    {apps.length === 0 ? (
                        /* Empty State */
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                ยังไม่มีแอปพลิเคชัน
                            </h3>
                            <p className="text-slate-500 mb-6">
                                เริ่มต้นด้วยการเพิ่มแอปแรกของคุณ
                            </p>
                            <button
                                onClick={openAddModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                เพิ่มแอปใหม่
                            </button>
                        </div>
                    ) : (
                        /* Apps List */
                        <div className="divide-y divide-slate-100">
                            {/* Table Header (Desktop) */}
                            <div className="hidden md:grid md:grid-cols-14 gap-4 px-6 py-3 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-1 text-center">#</div>
                                <div className="col-span-4">แอป</div>
                                <div className="col-span-2">โซน</div>
                                <div className="col-span-2 text-center">สถานะ</div>
                                <div className="col-span-2 text-center">เรียงลำดับ</div>
                                <div className="col-span-3 text-right">การจัดการ</div>
                            </div>

                            {/* App Rows */}
                            {apps.map((app, index) => (
                                <div
                                    key={app.id}
                                    className={`grid grid-cols-1 md:grid-cols-14 gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50/50 transition-colors items-center ${app.isEnabled === false ? "opacity-60" : ""}`}
                                >
                                    {/* Order Number */}
                                    <div className="hidden md:block col-span-1 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* App Info */}
                                    <div className="md:col-span-4 flex items-center gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-md bg-gradient-to-br ${app.color || "from-blue-500 to-purple-500"
                                                }`}
                                        >
                                            {app.iconUrl ? (
                                                <Image
                                                    src={app.iconUrl}
                                                    alt={app.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-lg font-bold text-white">
                                                        {app.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {/* Name & URL */}
                                        <div className="min-w-0">
                                            <h4 className="font-semibold text-slate-800 truncate">
                                                {app.name}
                                            </h4>
                                            <p className="text-xs text-slate-400 truncate max-w-[200px]">
                                                {app.url}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Zone Badge */}
                                    <div className="md:col-span-2 flex md:justify-start">
                                        <ZoneBadge zone={app.zone} />
                                    </div>

                                    {/* Enable/Disable Toggle */}
                                    <div className="md:col-span-2 flex items-center justify-center">
                                        <button
                                            onClick={() => handleToggleEnabled(app)}
                                            disabled={isToggling === app.id}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${app.isEnabled === false
                                                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                                } disabled:opacity-50`}
                                            title={app.isEnabled === false ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                        >
                                            {isToggling === app.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : app.isEnabled === false ? (
                                                <ToggleLeft className="w-5 h-5" />
                                            ) : (
                                                <ToggleRight className="w-5 h-5" />
                                            )}
                                            <span className="text-xs font-medium">
                                                {app.isEnabled === false ? "ปิด" : "เปิด"}
                                            </span>
                                        </button>
                                    </div>

                                    {/* Reorder Buttons */}
                                    <div className="md:col-span-2 flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => handleReorder(app.id!, "up")}
                                            disabled={index === 0 || isReordering === app.id}
                                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            title="เลื่อนขึ้น"
                                        >
                                            {isReordering === app.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <ChevronUp className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleReorder(app.id!, "down")}
                                            disabled={index === apps.length - 1 || isReordering === app.id}
                                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                            title="เลื่อนลง"
                                        >
                                            {isReordering === app.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="md:col-span-3 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(app)}
                                            className="p-2.5 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
                                            title="แก้ไข"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(app)}
                                            className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                                            title="ลบ"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Bar */}
                {apps.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <AppWindow className="w-4 h-4" />
                            <span>รวมทั้งหมด: <strong className="text-slate-700">{apps.length}</strong> แอป</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-blue-500" />
                            <span>นักเรียน: <strong className="text-slate-700">{apps.filter(a => a.zone === "student" || a.zone === "both").length}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-500" />
                            <span>ครู: <strong className="text-slate-700">{apps.filter(a => a.zone === "teacher" || a.zone === "both").length}</strong></span>
                        </div>
                    </div>
                )}
            </main>

            {/* App Form Modal */}
            <AppFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingApp(null);
                }}
                onSubmit={handleFormSubmit}
                editingApp={editingApp}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title="ยืนยันการลบ"
                message={`ต้องการลบ "${deleteConfirm?.name}" หรือไม่?`}
                isLoading={isDeleting}
            />
        </div>
    );
}
