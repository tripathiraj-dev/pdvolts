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
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      error(err.message || "Authentication error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
      {/* Left Brand & Feature Column */}
      <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <Logo size="md" />

          <div className="pt-4 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Industrial Client Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              Direct Access to RFQs, Specs & Mill Certifications
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sign in to view formal quotation approvals, track production lot testing, and download certified MTC 3.1 datasheets.
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
                <span className="text-slate-400">Direct commercial estimator pricing on bulk cable & polymer orders.</span>
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
          <span className="text-slate-500 font-bold">ISO 9001:2015 & CE</span>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your credentials to access the PDVOLT client portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
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
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
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
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
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
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-medium">
                Keep me signed in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/20 transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="font-bold text-amber-600 hover:underline">
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
