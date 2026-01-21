"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Key, X, Loader2, Shield, Sparkles } from "lucide-react";

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AdminLoginModal({
    isOpen,
    onClose,
    onSuccess,
}: AdminLoginModalProps) {
    const [secretKey, setSecretKey] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSecretKey("");
            setError("");
            setShowSuccess(false);
        }
    }, [isOpen]);

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!secretKey.trim()) {
            setError("กรุณาใส่รหัสลับ");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ secretKey }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setError(data.error || "รหัสลับไม่ถูกต้อง");
                setSecretKey("");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up"
                style={{ animationDuration: "0.4s" }}
            >
                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />

                {/* Modal Content */}
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(20px)",
                        boxShadow:
                            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset",
                    }}
                >
                    {/* Header Gradient Bar */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 transition-all duration-200"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8 pt-6">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                        boxShadow: "0 10px 40px rgba(37, 99, 235, 0.4)",
                                    }}
                                >
                                    {showSuccess ? (
                                        <Sparkles className="w-9 h-9 text-white animate-pulse" />
                                    ) : (
                                        <Shield className="w-9 h-9 text-white" />
                                    )}
                                </div>
                                {/* Glow effect */}
                                <div
                                    className="absolute inset-0 rounded-2xl"
                                    style={{
                                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                        filter: "blur(20px)",
                                        opacity: 0.4,
                                        zIndex: -1,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gradient mb-2">
                                Admin Access
                            </h2>
                            <p className="text-sm text-slate-500">
                                ใส่รหัสลับเพื่อเข้าสู่แดชบอร์ดผู้ดูแล
                            </p>
                        </div>

                        {/* Success State */}
                        {showSuccess ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-5 py-3 rounded-xl">
                                    <Sparkles className="w-5 h-5" />
                                    <span className="font-medium">เข้าสู่ระบบสำเร็จ!</span>
                                </div>
                            </div>
                        ) : (
                            /* Login Form */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Secret Key Input */}
                                <div className="relative">
                                    <label
                                        htmlFor="secretKey"
                                        className="block text-sm font-medium text-slate-700 mb-2"
                                    >
                                        <Key className="w-4 h-4 inline-block mr-1.5 opacity-70" />
                                        Secret Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            id="secretKey"
                                            type="password"
                                            value={secretKey}
                                            onChange={(e) => setSecretKey(e.target.value)}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            className="w-full px-4 py-3.5 pl-12 rounded-xl border-2 border-slate-200 
                        focus:border-purple-400 focus:ring-4 focus:ring-purple-100 
                        outline-none transition-all duration-200
                        bg-white/70 backdrop-blur-sm
                        placeholder:text-slate-300
                        disabled:bg-slate-100 disabled:cursor-not-allowed"
                                            autoComplete="off"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div
                                        className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm animate-fade-in"
                                        style={{ animationDuration: "0.2s" }}
                                    >
                                        <X className="w-4 h-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative overflow-hidden group py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{
                                        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                                        boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
                                    }}
                                >
                                    {/* Hover gradient overlay */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                                        }}
                                    />

                                    <span className="relative flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>กำลังตรวจสอบ...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                <span>เข้าสู่ระบบ</span>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>
                        )}

                        {/* Security Note */}
                        <p className="text-center text-xs text-slate-400 mt-6">
                            🔐 การเชื่อมต่อมีความปลอดภัย
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
