'use client';
import Link from "next/link";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  function handleRole(r) {
    setRole(r);
    setMsg({ type: "", text: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        // Extract a meaningful message from the HTML if possible, or show the first 100 chars
        const errorMessage = text.length > 200 ? text.substring(0, 200) + "..." : text;
        throw new Error(`Server returned 500. Details: ${errorMessage}`);
      }

      const data = await res.json();

      if (data.error) {
        setMsg({ type: "error", text: data.error });
      } else {
        setMsg({ type: "success", text: "Login successful! Redirecting..." });
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        setTimeout(() => {
          if (role === "admin") {
            router.replace("/admin-dashboard");
          } else {
            router.replace("/student-dashboard");
          }
        }, 1500);

      }
    } catch (err) {
      console.error("Login Error:", err);
      setMsg({ type: "error", text: err.message || "Connection error" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-pink-950 to-slate-950 flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-600/20 backdrop-blur-2xl border-b border-white/10 shadow-lg">
        <div className="w-full px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <Logo size={32} />
            <h1 className="text-white font-bold text-xl">CampusEventHub</h1>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <Link href="/event" className="text-gray-300 hover:text-white transition-colors">Events</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-lg font-semibold shadow-lg shadow-pink-500/30">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Logo size={48} className="p-4 bg-gradient-to-r from-pink-600 to-orange-600 rounded-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your campus events</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRole("student")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === "student"
                ? "bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg shadow-pink-500/50"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
            >
              <User size={18} />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRole("admin")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${role === "admin"
                ? "bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-lg shadow-pink-500/50"
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

          <div className="space-y-5">
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
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-white/20 bg-white/10 checked:bg-gradient-to-r checked:from-purple-600 checked:to-pink-600 focus:ring-2 focus:ring-purple-500 cursor-pointer transition-all"
                />
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-pink-400 hover:text-pink-300 text-sm font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="my-6 text-center">
            <span className="text-gray-400 text-sm">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/student-dashboard' })}
              className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
              title="Continue with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => window.location.href = '/api/auth/signin/azure-ad'}
              className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
              title="Continue with Microsoft"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#f25022" d="M0 0h11.377v11.372H0z" />
                <path fill="#00a4ef" d="M12.623 0H24v11.372H12.623z" />
                <path fill="#7fba00" d="M0 12.623h11.377V24H0z" />
                <path fill="#ffb900" d="M12.623 12.623H24V24H12.623z" />
              </svg>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <a href="/register" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                Create one
              </a>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center mb-3">Demo Credentials:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-gray-400 mb-1">Student</div>
                <div className="text-gray-300 font-mono">student@campus.com</div>
                <div className="text-gray-300 font-mono">student123</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="text-gray-400 mb-1">Admin</div>
                <div className="text-gray-300 font-mono">admin@campus.com</div>
                <div className="text-gray-300 font-mono">admin123</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Secure login powered by CampusEventHub Platform
        </p>
      </div>
    </div>
  );
}
