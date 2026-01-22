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
            {/* Liquid Glass Backdrop */}
            <div
                className="absolute inset-0 glass-backdrop animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div
                className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up"
                style={{ animationDuration: "0.5s" }}
            >
                {/* Decorative Liquid Glass Orbs */}
                <div
                    className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl animate-float"
                    style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)' }}
                />
                <div
                    className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl animate-float"
                    style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)', animationDelay: '-4s' }}
                />

                {/* Liquid Glass Modal Content */}
                <div className="glass-modal relative">
                    {/* Top Specular Highlight */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none rounded-t-[36px] z-10"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 100%)',
                        }}
                    />

                    {/* Header Gradient Bar - Liquid Glass Style */}
                    <div
                        className="h-1.5 relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.8) 0%, rgba(168, 85, 247, 0.8) 50%, rgba(236, 72, 153, 0.8) 100%)',
                        }}
                    >
                        {/* Animated shimmer */}
                        <div
                            className="absolute inset-0 animate-shimmer"
                            style={{
                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                                backgroundSize: '200% 100%',
                            }}
                        />
                    </div>

                    {/* Liquid Glass Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2.5 rounded-xl transition-all duration-300"
                        style={{
                            background: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                        }}
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-slate-500 hover:text-slate-700 transition-colors" />
                    </button>

                    <div className="p-8 pt-6 relative z-10">
                        {/* Liquid Glass Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div
                                    className="w-20 h-20 rounded-[24px] flex items-center justify-center relative overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                                        boxShadow: `0 12px 40px rgba(14, 165, 233, 0.4),
                                                    0 0 60px rgba(168, 85, 247, 0.2),
                                                    inset 0 1px 1px rgba(255, 255, 255, 0.4),
                                                    inset 0 -2px 4px rgba(0, 0, 0, 0.1)`,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    {/* Specular highlight on icon */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[24px] pointer-events-none"
                                        style={{
                                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                        }}
                                    />
                                    {showSuccess ? (
                                        <Sparkles className="w-9 h-9 text-white animate-pulse drop-shadow-lg relative z-10" />
                                    ) : (
                                        <Shield className="w-9 h-9 text-white drop-shadow-lg relative z-10" />
                                    )}
                                </div>
                                {/* Ambient glow */}
                                <div
                                    className="absolute inset-0 rounded-[24px] blur-2xl opacity-50 -z-10"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%)',
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
                                <div
                                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl"
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.15)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(16, 185, 129, 0.3)',
                                        boxShadow: '0 4px 24px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                                    }}
                                >
                                    <Sparkles className="w-5 h-5 text-emerald-500" />
                                    <span className="font-semibold text-emerald-600">เข้าสู่ระบบสำเร็จ!</span>
                                </div>
                            </div>
                        ) : (
                            /* Login Form */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Liquid Glass Secret Key Input */}
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
                                            className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                                            autoComplete="off"
                                        />
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    </div>
                                </div>

                                {/* Error Message - Liquid Glass Style */}
                                {error && (
                                    <div
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm animate-fade-in"
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                                            animationDuration: "0.2s",
                                        }}
                                    >
                                        <X className="w-4 h-4 flex-shrink-0 text-rose-500" />
                                        <span className="text-rose-600">{error}</span>
                                    </div>
                                )}

                                {/* Liquid Glass Primary Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative overflow-hidden group py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-400 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
                                        boxShadow: `0 8px 32px rgba(14, 165, 233, 0.4),
                                                    inset 0 1px 1px rgba(255, 255, 255, 0.4),
                                                    inset 0 -2px 4px rgba(0, 0, 0, 0.1)`,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    {/* Top specular highlight */}
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl pointer-events-none"
                                        style={{
                                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                        }}
                                    />

                                    {/* Hover glow effect */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                        }}
                                    />

                                    <span className="relative flex items-center justify-center gap-2 drop-shadow-sm">
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

                        {/* Security Note - Liquid Glass Pill */}
                        <div className="flex justify-center mt-6">
                            <div
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255, 255, 255, 0.35)',
                                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                                }}
                            >
                                <span>🔐</span>
                                <span className="text-slate-500">การเชื่อมต่อมีความปลอดภัย</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
