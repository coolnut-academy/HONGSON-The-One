"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    X,
    Loader2,
    Save,
    Upload,
    Link as LinkIcon,
    Type,
    Users,
    GraduationCap,
    Briefcase,
    Globe,
    ImageIcon,
    Sparkles,
} from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { AppDocument } from "@/lib/firestore";

type Zone = "student" | "teacher" | "both";

interface AppFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<AppDocument, "id" | "order" | "createdAt" | "updatedAt">) => Promise<void>;
    editingApp?: AppDocument | null;
}

// Gradient color options for apps without custom icons
const GRADIENT_OPTIONS = [
    { value: "from-blue-500 to-cyan-500", label: "Blue Ocean", preview: "bg-gradient-to-br from-blue-500 to-cyan-500" },
    { value: "from-purple-500 to-violet-600", label: "Purple Dream", preview: "bg-gradient-to-br from-purple-500 to-violet-600" },
    { value: "from-green-500 to-emerald-600", label: "Green Forest", preview: "bg-gradient-to-br from-green-500 to-emerald-600" },
    { value: "from-orange-500 to-amber-500", label: "Sunset", preview: "bg-gradient-to-br from-orange-500 to-amber-500" },
    { value: "from-pink-500 to-rose-500", label: "Pink Bloom", preview: "bg-gradient-to-br from-pink-500 to-rose-500" },
    { value: "from-indigo-500 to-blue-600", label: "Deep Indigo", preview: "bg-gradient-to-br from-indigo-500 to-blue-600" },
    { value: "from-teal-500 to-cyan-600", label: "Teal Wave", preview: "bg-gradient-to-br from-teal-500 to-cyan-600" },
    { value: "from-red-500 to-orange-500", label: "Fire", preview: "bg-gradient-to-br from-red-500 to-orange-500" },
];

export default function AppFormModal({
    isOpen,
    onClose,
    onSubmit,
    editingApp,
}: AppFormModalProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [zone, setZone] = useState<Zone>("both");
    const [iconUrl, setIconUrl] = useState("");
    const [color, setColor] = useState(GRADIENT_OPTIONS[0].value);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Populate form when editing
    useEffect(() => {
        if (editingApp) {
            setName(editingApp.name);
            setUrl(editingApp.url);
            setZone(editingApp.zone);
            setIconUrl(editingApp.iconUrl);
            setColor(editingApp.color || GRADIENT_OPTIONS[0].value);
        } else {
            // Reset form for new app
            setName("");
            setUrl("");
            setZone("both");
            setIconUrl("");
            setColor(GRADIENT_OPTIONS[0].value);
        }
        setError("");
        setPreviewFile(null);
    }, [editingApp, isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !isSubmitting && !isUploading) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, isSubmitting, isUploading, onClose]);

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("กรุณาเลือกไฟล์รูปภาพ");
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB");
            return;
        }

        setError("");

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewFile(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Firebase Storage
        setIsUploading(true);
        try {
            const downloadUrl = await uploadImage(file);
            setIconUrl(downloadUrl);
            setError("");
        } catch (err) {
            console.error("Upload error:", err);
            setError("อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่");
            setPreviewFile(null);
        } finally {
            setIsUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!name.trim()) {
            setError("กรุณาใส่ชื่อแอป");
            return;
        }

        if (!url.trim()) {
            setError("กรุณาใส่ URL ของแอป");
            return;
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            setError("URL ไม่ถูกต้อง (ต้องเริ่มด้วย http:// หรือ https://)");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                name: name.trim(),
                url: url.trim(),
                zone,
                iconUrl: iconUrl.trim(),
                color,
            });
            onClose();
        } catch (err) {
            console.error("Submit error:", err);
            setError("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isEditing = !!editingApp;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => !isSubmitting && !isUploading && onClose()}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg mx-4 animate-fade-in-up">
                {/* Decorative blurs */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                >
                    {/* Header Gradient */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        disabled={isSubmitting || isUploading}
                        className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                }}
                            >
                                {isEditing ? (
                                    <Sparkles className="w-6 h-6 text-white" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    {isEditing ? "แก้ไขแอป" : "เพิ่มแอปใหม่"}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {isEditing ? "อัปเดตข้อมูลแอปพลิเคชัน" : "กรอกข้อมูลแอปพลิเคชันที่ต้องการเพิ่ม"}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                                    <Type className="w-4 h-4 opacity-60" />
                                    ชื่อแอป
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="เช่น Google Classroom"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70 disabled:bg-slate-100"
                                />
                            </div>

                            {/* URL Field */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                                    <LinkIcon className="w-4 h-4 opacity-60" />
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://classroom.google.com"
                                    disabled={isSubmitting}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all bg-white/70 disabled:bg-slate-100"
                                />
                            </div>

                            {/* Zone Selection */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-3">
                                    <Users className="w-4 h-4 opacity-60" />
                                    แสดงสำหรับ
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Student */}
                                    <button
                                        type="button"
                                        onClick={() => setZone("student")}
                                        disabled={isSubmitting}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${zone === "student"
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <GraduationCap className="w-5 h-5" />
                                        <span className="text-xs font-medium">นักเรียน</span>
                                    </button>
                                    {/* Teacher */}
                                    <button
                                        type="button"
                                        onClick={() => setZone("teacher")}
                                        disabled={isSubmitting}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${zone === "teacher"
                                                ? "border-purple-500 bg-purple-50 text-purple-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        <span className="text-xs font-medium">ครู</span>
                                    </button>
                                    {/* Both */}
                                    <button
                                        type="button"
                                        onClick={() => setZone("both")}
                                        disabled={isSubmitting}
                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5 ${zone === "both"
                                                ? "border-green-500 bg-green-50 text-green-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                                            }`}
                                    >
                                        <Globe className="w-5 h-5" />
                                        <span className="text-xs font-medium">ทั้งหมด</span>
                                    </button>
                                </div>
                            </div>

                            {/* Icon Upload */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                                    <ImageIcon className="w-4 h-4 opacity-60" />
                                    ไอคอนแอป
                                </label>
                                <div className="flex items-center gap-4">
                                    {/* Preview */}
                                    <div
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 border-dashed ${iconUrl || previewFile ? "border-transparent" : "border-slate-300"
                                            } flex items-center justify-center bg-slate-50`}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                                        ) : previewFile || iconUrl ? (
                                            <Image
                                                src={previewFile || iconUrl}
                                                alt="Icon preview"
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${color}`}>
                                                <span className="text-xl font-bold text-white">
                                                    {name ? name.charAt(0).toUpperCase() : "?"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex-1">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={isSubmitting || isUploading}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isSubmitting || isUploading}
                                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-slate-600 disabled:opacity-50"
                                        >
                                            <Upload className="w-4 h-4" />
                                            {isUploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
                                        </button>
                                        <p className="text-xs text-slate-400 mt-1.5">
                                            PNG, JPG, SVG (สูงสุด 2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Color Selection (for fallback icon) */}
                            <div>
                                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
                                    สีพื้นหลัง (ใช้เมื่อไม่มีไอคอน)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {GRADIENT_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setColor(option.value)}
                                            disabled={isSubmitting}
                                            className={`w-8 h-8 rounded-lg ${option.preview} transition-all ${color === option.value
                                                    ? "ring-2 ring-offset-2 ring-purple-500 scale-110"
                                                    : "hover:scale-105"
                                                }`}
                                            title={option.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm">
                                    <X className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || isUploading}
                                className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
                                style={{
                                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                    boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
                                }}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>กำลังบันทึก...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            <span>{isEditing ? "บันทึกการแก้ไข" : "เพิ่มแอป"}</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
