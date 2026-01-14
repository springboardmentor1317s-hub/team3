'use client';
import Link from "next/link";
import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState({ type: "", text: "" });
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setMsg({ type: "", text: "" });
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMsg({ type: "success", text: "Reset link sent! Check your email (or server console)." });
            } else {
                setMsg({ type: "error", text: data.error || "Something went wrong" });
            }
        } catch (err) {
            setMsg({ type: "error", text: "Connection error" });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <Logo size={48} className="p-4 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
                    <p className="text-gray-400">Enter your email to receive a reset link</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    {msg.type === "error" && (
                        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                            {msg.text}
                        </div>
                    )}
                    {msg.type === "success" && (
                        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-200 text-sm">
                            {msg.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/login" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
