"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import {
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Zap,
  FileCheck,
  CheckCircle2,
} from "lucide-react";
import Logo from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      success("Signed in successfully", `Welcome back, ${data.user.name}`);

      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      error(err.message || "Authentication error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      {/* Left Brand & Feature Column (Hidden on mobile or visible as sleek header) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow & Radial Rings */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <Logo variant="light" />

          <div className="pt-4 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Industrial Client Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              Direct Access to RFQs, Specs & Mill Certifications
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Login to view formal quotation approvals, track production lot testing, and download certified MTC 3.1 datasheets.
            </p>
          </div>

          {/* Key Portal Features */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-100 block">Fast 24-Hour RFQ Turnaround</span>
                <span className="text-slate-400">Direct commercial estimator pricing on bulk cable orders.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0 mt-0.5">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-100 block">100% Spark Test Lot Records</span>
                <span className="text-slate-400">Online verification of 15kV dielectric pass certificates.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badge at Bottom */}
        <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            256-Bit TLS Encrypted
          </span>
          <span className="text-slate-500">ISO 9001:2015</span>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mb-3 shadow-xs">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Portal Locked: Sign in required to view website</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter verified credentials to access the PDVolts platform
            </p>
          </div>

          {/* Quick Demo Access Clickable Pills */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs mb-2">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Demo Access (Click to auto-fill)</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin@pdvolts.com", "Admin@12345")}
                className="p-2.5 bg-white rounded-xl border border-slate-200 text-left hover:border-brand-500 hover:shadow-xs transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700">Super Admin</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                    Admin
                  </span>
                </div>
                <span className="block text-[11px] text-slate-500 truncate mt-0.5">admin@pdvolts.com</span>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("user@pdvolts.com", "User@12345")}
                className="p-2.5 bg-white rounded-xl border border-slate-200 text-left hover:border-brand-500 hover:shadow-xs transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-brand-700">Client User</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-800">
                    Client
                  </span>
                </div>
                <span className="block text-[11px] text-slate-500 truncate mt-0.5">user@pdvolts.com</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-medium">
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 hover:from-brand-800 hover:to-sky-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-brand-700/25 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an enterprise account?{" "}
              <Link href="/register" className="font-bold text-brand-700 hover:underline">
                Register New Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 font-medium">Loading portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
