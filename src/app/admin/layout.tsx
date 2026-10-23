"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  Image,
  Award,
  Download,
  Briefcase,
  HelpCircle,
  Star,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Shield,
  ChevronDown,
} from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!data.user || (data.user.role !== "ADMIN" && data.user.role !== "SUPER_ADMIN")) {
          router.push("/login?callbackUrl=/admin");
        } else {
          setAdminUser(data.user);
        }
      })
      .catch(() => router.push("/login"));
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const menuSections = [
    {
      group: "Core Management",
      items: [
        { label: "Overview & Analytics", href: "/admin", icon: LayoutDashboard },
        { label: "Products Catalog", href: "/admin/products", icon: Package },
        { label: "Product Categories", href: "/admin/categories", icon: Layers },
      ],
    },
    {
      group: "CRM & Inquiries",
      items: [
        { label: "Quote Requests (RFQ)", href: "/admin/quotes", icon: FileText },
        { label: "Contact Inquiries", href: "/admin/enquiries", icon: MessageSquare },
        { label: "User Accounts", href: "/admin/users", icon: Users },
      ],
    },
    {
      group: "Content & CMS",
      items: [
        { label: "Blog & Articles", href: "/admin/blog", icon: BookOpen },
        { label: "Media Gallery", href: "/admin/gallery", icon: Image },
        { label: "Certifications & ISO", href: "/admin/certifications", icon: Award },
        { label: "Download Center", href: "/admin/downloads", icon: Download },
        { label: "Careers & Applicants", href: "/admin/careers", icon: Briefcase },
        { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
        { label: "Client Testimonials", href: "/admin/testimonials", icon: Star },
        { label: "Industry Verticals", href: "/admin/industries", icon: Zap },
      ],
    },
    {
      group: "Configuration",
      items: [{ label: "Site & SEO Settings", href: "/admin/settings", icon: Settings }],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo variant="light" />
        </div>
        <span className="px-2 py-0.5 rounded bg-brand-900 text-brand-300 text-[10px] font-extrabold uppercase">
          Admin CMS
        </span>
      </div>

      {/* Admin Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Top Logo & Admin Badge */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Logo variant="light" />
            <span className="px-2 py-0.5 rounded bg-brand-950 text-brand-400 text-[10px] font-extrabold uppercase border border-brand-800">
              Admin
            </span>
          </div>

          {/* Navigation Items */}
          <div className="p-4 space-y-6 flex-1">
            {menuSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
                  {sec.group}
                </span>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? "bg-brand-600 text-white font-bold shadow-lg shadow-brand-900/30"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Bottom Profile & Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/50">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Globe className="w-4 h-4 text-brand-400" />
              <span>View Public Website</span>
            </Link>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between px-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{adminUser?.name || "Admin"}</p>
                <p className="text-[10px] text-slate-500 truncate">{adminUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900/40">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
