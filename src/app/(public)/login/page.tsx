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
  User,
  ShieldAlert,
} from "lucide-react";
import Logo from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const { success, error, info } = useToast();

  // Portal selection: "user" | "admin"
  const [portalType, setPortalType] = useState<"user" | "admin">(
    callbackUrl.includes("/admin") ? "admin" : "user"
  );
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

      const userRole = data.user?.role;
      const isAdminRole = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

      if (portalType === "admin") {
        if (!isAdminRole) {
          info(
            "Standard account authenticated",
            "This account does not have staff privileges. Redirecting to your Client Dashboard."
          );
          setTimeout(() => {
            window.location.href = callbackUrl || "/dashboard";
          }, 1200);
          return;
        }

        success("Admin Access Granted", `Welcome back, ${data.user.name}`);
        window.location.href = callbackUrl || "/admin";
      } else {
        success("Signed in successfully", `Welcome back, ${data.user.name}`);
        if (callbackUrl) {
          window.location.href = callbackUrl;
        } else if (isAdminRole) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      error(err.message || "Authentication error");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      {/* Left Brand & Feature Column (Visible on Desktop / Tablets) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <Logo variant="light" size="md" />

          <div className="pt-4 space-y-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              portalType === "admin"
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-300"
                : "bg-sky-500/20 border border-sky-500/40 text-sky-300"
            }`}>
              {portalType === "admin" ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  Staff / Admin Gateway
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  Industrial Client Portal
                </>
              )}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
              {portalType === "admin"
                ? "Manage Operations, Inquiries & Production"
                : "Direct Access to RFQs, Specs & Mill Certifications"}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {portalType === "admin"
                ? "Restricted administrative zone for PDVOLT operations, product catalog updates, RFQ reviews, and customer management."
                : "Sign in to review formal quotation approvals, track lot spark testing, and download certified MTC 3.1 datasheets."}
            </p>
          </div>

          {/* Key Portal Features */}
          <div className="space-y-3 pt-2">
            {portalType === "admin" ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-100 block">RFQ & Quotation Workflow</span>
                    <span className="text-slate-400">Review commercial buyer submissions and generate formal estimates.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-100 block">Catalog & Inventory Management</span>
                    <span className="text-slate-400">Live control over conductors, cables, pipes, and raw materials.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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
      <div className="lg:col-span-7 p-5 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
        <div className="max-w-md w-full mx-auto space-y-5 sm:space-y-6">
          
          {/* Logo on Mobile */}
          <div className="flex lg:hidden justify-center pb-2">
            <Logo variant="dark" size="md" />
          </div>

          {/* USER VS ADMIN ROLE SELECTOR TABS */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Select Your Portal Role
            </span>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setPortalType("user")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  portalType === "user"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User className="w-4 h-4 text-sky-600" />
                <span>Client / Buyer</span>
              </button>

              <button
                type="button"
                onClick={() => setPortalType("admin")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  portalType === "admin"
                    ? "bg-slate-950 text-amber-400 shadow-sm border border-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin / Staff</span>
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              {portalType === "admin" ? "Staff & Admin Sign In" : "Sign In to Your Account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {portalType === "admin"
                ? "Enter authorized administrative credentials to access operations dashboard"
                : "Enter your credentials to access your PDVOLT client dashboard & RFQs"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {portalType === "admin" ? "Staff Email Address" : "Business Email Address"}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portalType === "admin" ? "admin@pdvolts.com" : "name@company.com"}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
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
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
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
              className={`w-full py-3.5 px-4 font-black text-sm rounded-xl shadow-lg transition duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-98 min-h-[48px] ${
                portalType === "admin"
                  ? "bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/30 shadow-slate-950/20"
                  : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 shadow-orange-500/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>{portalType === "admin" ? "Access Admin Dashboard" : "Sign In to Client Portal"}</span>
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

