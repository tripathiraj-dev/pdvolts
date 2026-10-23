"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Bookmark,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Globe,
  Bell,
} from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string; company?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!data.user) {
          router.push("/login?callbackUrl=" + pathname);
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push("/login"));
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Quote Requests (RFQ)", href: "/dashboard/quotes", icon: FileText },
    { label: "My Inquiries", href: "/dashboard/enquiries", icon: MessageSquare },
    { label: "Saved Products", href: "/dashboard/saved", icon: Bookmark },
    { label: "Profile & Security", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Logo variant="dark" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              Client Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              <Globe className="w-3.5 h-3.5" /> Back to Main Site
            </Link>

            {user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow hover:bg-brand-700 transition"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Area with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            {/* User Profile Card */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-base shadow">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate font-heading">{user?.name || "Client"}</h4>
                <p className="text-xs text-slate-500 truncate">{user?.company || user?.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-brand-700 text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Sourcing Action */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/quote"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-xs font-bold shadow transition"
              >
                Submit New RFQ
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden col-span-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Content Pane */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
