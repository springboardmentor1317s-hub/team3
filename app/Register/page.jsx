'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Shield, Building2, } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  function handleRole(r) {
    setRole(r);
    setMsg({ type: "", text: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!fullName || !email || !password || !confirmPassword || !college) {
      setMsg({ type: "error", text: "Please fill in all fields" });
      return;
    }
    if (password !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setIsLoading(true);

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, college, role }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMsg({ type: "error", text: data.error });
        } else {
          setMsg({ type: "success", text: "Registration successful! Redirecting to login..." });
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setMsg({ type: "error", text: "Connection error" });
        setIsLoading(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-white font-bold text-xl">Campus Events</h1>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link href="/event" className="text-gray-300 hover:text-white transition-colors">Events</Link>
            <Link href="/Home" className="text-gray-300 hover:text-white transition-colors"></Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-teal-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-4">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Campus Events</h1>
          <p className="text-gray-400">Create your account and start exploring</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRole("student")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "student"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <User size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRole("admin")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                role === "admin"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

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

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

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
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                College/University
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Your College"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
