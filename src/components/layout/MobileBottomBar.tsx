"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  Layers,
  PhoneCall,
  FileText,
  User,
  Shield,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export default function MobileBottomBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Raw Material",
      href: "/raw-materials",
      icon: Zap,
      isActive: pathname.startsWith("/raw-materials"),
      isSpecial: true,
      badge: "99.99%",
    },
    {
      label: "Products",
      href: "/products",
      icon: Layers,
      isActive: pathname.startsWith("/products"),
    },
    {
      label: "Call",
      href: `tel:${siteConfig.contact.phone}`,
      icon: PhoneCall,
      isExternal: true,
    },
    {
      label: isAdmin ? "Admin" : "Quote",
      href: isAdmin ? "/admin" : "/quote",
      icon: isAdmin ? Shield : FileText,
      isActive: isAdmin ? pathname.startsWith("/admin") : pathname === "/quote",
      isPrimary: true,
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] safe-area-bottom select-none"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-3.5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-500/30 border-2 border-slate-900 group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5 font-black stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-amber-400 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center py-1 px-2 text-slate-400 hover:text-white active:scale-95 transition group"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 mt-1">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition group relative ${
                item.isActive
                  ? "text-brand-400 font-extrabold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    item.isActive ? "text-amber-400" : "text-slate-400"
                  }`}
                />
                {item.isSpecial && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight ${
                  item.isActive ? "text-white font-black" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
              {item.isActive && (
                <span className="w-4 h-0.5 bg-amber-400 rounded-full mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
