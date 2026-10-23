"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Phone,
  Mail,
  ChevronDown,
  User,
  Shield,
  LayoutDashboard,
  LogOut,
  Zap,
  Layers,
  Factory,
  FileCheck,
  ArrowRight,
  HelpCircle,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Building,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  ChevronRight,
  BookOpen,
  FolderDown,
} from "lucide-react";
import Logo from "./Logo";
import { siteConfig } from "@/config/site";
import GlobalSearchModal from "../shared/GlobalSearchModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check logged in user session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Dropdown Data
  const rawMaterialItems = [
    {
      title: "Continuous Cast Copper Rods (99.99%)",
      desc: "ASTM B49 / IS 12444 pure ETP / OFC continuous drawn copper coils",
      href: "/raw-materials#copper-rods",
      tag: "99.99% Cu",
    },
    {
      title: "EC Grade Aluminum Wire Rods",
      desc: "High conductivity IS 5484 EC 1370 grade aluminum rods for conductors",
      href: "/raw-materials#ec-aluminum",
      tag: "EC 1370",
    },
    {
      title: "Specialized PVC Cable Compounds",
      desc: "Virgin FR, FRLS, and Type C heat-resistant polymer granules",
      href: "/raw-materials#pvc-compounds",
      tag: "FR / FRLS",
    },
    {
      title: "Silane & Peroxide Curable XLPE",
      desc: "High-dielectric cross-linkable polyethylene for power insulation",
      href: "/raw-materials#xlpe-resins",
      tag: "Cross-linked",
    },
    {
      title: "Color & UV Masterbatches",
      desc: "High pigment dispersion masterbatches for high-speed extruders",
      href: "/raw-materials#masterbatches",
      tag: "UV Stabilized",
    },
  ];

  const productsItems = [
    {
      title: "Armored XLPE Power Cables",
      desc: "0.6/1.1kV to 33kV utility feeders with steel wire armoring",
      href: "/products?category=industrial-power-cables",
      category: "Cables",
    },
    {
      title: "Building & Panel Flexible Wires",
      desc: "High-grade electrolytic copper wires with flame retardant PVC",
      href: "/products?category=building-flexible-wires",
      category: "Wires",
    },
    {
      title: "Solar Photovoltaic (PV) Cables",
      desc: "TUV certified halogen-free dual insulated solar cables (1500V DC)",
      href: "/products/halogen-free-solar-pv-cable",
      category: "Solar",
    },
    {
      title: "Rigid uPVC Electrical Conduit Pipes",
      desc: "Heavy-duty non-metallic, self-extinguishing conduit pipes",
      href: "/products/rigid-pvc-electrical-conduit-pipes",
      category: "Conduits",
    },
    {
      title: "Precision Molded Terminal Blocks",
      desc: "High-temperature phenolic and nylon electrical terminal connectors",
      href: "/products/precision-molded-terminal-blocks",
      category: "Polymers",
    },
  ];

  const resourcesItems = [
    {
      title: "Technical Blog & Insights",
      desc: "Whitepapers on XLPE vs PVC insulation, fire standards & polymer science",
      href: "/blog",
      icon: BookOpen,
    },
    {
      title: "Downloads & Datasheets",
      desc: "Download official catalogues, submittals, and MTC 3.1 test certs",
      href: "/downloads",
      icon: FolderDown,
    },
    {
      title: "Industries Served",
      desc: "Automotive, Power Grid, Infrastructure, EPC & Renewable projects",
      href: "/industries",
      icon: Building,
    },
    {
      title: "Factory Media Gallery",
      desc: "Tour continuous casting lines, tandem extruders & test labs",
      href: "/gallery",
      icon: ImageIcon,
    },
    {
      title: "About PDVolts Ltd.",
      desc: "28+ years of precision manufacturing excellence since 1998",
      href: "/about",
      icon: Factory,
    },
    {
      title: "Careers & Openings",
      desc: "Join our metallurgical and electrical engineering teams",
      href: "/careers",
      icon: Briefcase,
    },
  ];

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full overflow-x-clip bg-white shadow-sm border-b border-slate-200">
        {/* ============================================================
            TIER 1: TOP CORPORATE UTILITY STRIP
           ============================================================ */}
        <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Quick Contact Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold tracking-wide">
                  {siteConfig.contact.phone}
                </a>
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <a href={`mailto:${siteConfig.contact.salesEmail}`} className="font-semibold">
                  {siteConfig.contact.salesEmail}
                </a>
              </span>
            </div>

            {/* Industrial Live Performance Ticker (Desktop) */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-slate-100 font-bold">99.99% ETP Copper</span>
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300 font-semibold">50,000 MT/Yr Capacity</span>
              <span className="text-slate-700">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ISO 9001:2015 & CE
              </span>
            </div>

            {/* Portal & Auth Access (ALWAYS VISIBLE & FULLY CLICKABLE) */}
            <div className="flex items-center gap-3 text-xs">
              <Link href="/faq" className="hover:text-white transition text-slate-400 hidden sm:inline">
                FAQ
              </Link>
              <span className="text-slate-700 hidden sm:inline">|</span>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="text-slate-200 hover:text-white font-semibold flex items-center gap-1"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="max-w-[120px] truncate">{user.name}</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-amber-300 hover:text-amber-200 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40 text-[11px]"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-rose-400 hover:text-rose-300 font-semibold ml-1 text-[11px]"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-slate-200 hover:text-white font-medium hover:underline"
                  >
                    Login
                  </Link>
                  <span className="text-slate-700">•</span>
                  <Link
                    href="/register"
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            TIER 2: MAIN COMPACT, BALANCED NAVIGATION BAR
            (GUARANTEED NEVER TO OVERFLOW)
           ============================================================ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-3">
            {/* Brand Logo */}
            <Logo size="md" className="shrink-0" />

            {/* Desktop Navigation Links (Clean, streamlined, 5-6 core items max) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-sm font-bold">
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-xl transition-all ${
                  pathname === "/"
                    ? "text-brand-700 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                }`}
              >
                Home
              </Link>

              {/* ⚡ Raw Materials */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("raw-materials")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/raw-materials"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    pathname.startsWith("/raw-materials")
                      ? "text-amber-900 bg-amber-100 border border-amber-300"
                      : "text-slate-800 hover:text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500/30" />
                  <span>Raw Materials</span>
                  <span className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">
                    99.99%
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {activeDropdown === "raw-materials" && (
                  <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                        Mill-Direct Raw Materials
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Continuous cast copper rods, EC aluminum, and engineered polymers.
                      </p>
                    </div>
                    <div className="space-y-1">
                      {rawMaterialItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block p-2.5 rounded-xl hover:bg-amber-50/70 transition group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                              {item.tag}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Products (Consolidated Cables + Conduits) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("products")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/products"
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    pathname.startsWith("/products")
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {activeDropdown === "products" && (
                  <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 pb-2 mb-2 border-b border-slate-100">
                      <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                        Wires, Cables & Conduit Systems
                      </span>
                    </div>
                    <div className="space-y-1">
                      {productsItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block p-2.5 rounded-xl hover:bg-slate-50 transition group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 group-hover:text-brand-600">
                              {item.title}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <Link
                        href="/products"
                        className="flex items-center justify-between p-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span>View All Products & Specifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Manufacturing */}
              <Link
                href="/manufacturing"
                className={`px-3 py-2 rounded-xl transition-all ${
                  pathname === "/manufacturing"
                    ? "text-brand-700 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                }`}
              >
                Manufacturing
              </Link>

              {/* Quality Lab */}
              <Link
                href="/quality"
                className={`px-3 py-2 rounded-xl transition-all ${
                  pathname === "/quality"
                    ? "text-brand-700 bg-brand-50"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                }`}
              >
                Quality Lab
              </Link>

              {/* Resources ▾ (Consolidates Blog, Downloads, Industries, About) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                    pathname === "/blog" || pathname === "/downloads" || pathname === "/about"
                      ? "text-brand-700 bg-brand-50"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Resources</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {activeDropdown === "resources" && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-1">
                      {resourcesItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={idx}
                            href={item.href}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-700 shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900 group-hover:text-brand-700">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Right Actions (Compact & Never Overflowing) */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-slate-600 hover:text-brand-700 hover:bg-slate-100 rounded-xl transition"
                title="Search Products (Ctrl+K)"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Request a Quote CTA Button */}
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs xl:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>

            {/* Mobile Header Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-700 hover:text-brand-600 active:scale-95 rounded-xl hover:bg-slate-100 transition"
                aria-label="Search Catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="p-2 text-amber-600 hover:text-amber-700 active:scale-95 rounded-xl hover:bg-amber-50 transition"
                aria-label="Call Sales"
              >
                <PhoneCall className="w-5 h-5" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-900 active:scale-95 rounded-xl bg-slate-100 hover:bg-slate-200 transition border border-slate-200"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================================
          MOBILE NAVIGATION DRAWER (Full-screen overlay)
         ============================================================ */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full bg-white flex flex-col max-h-[92vh] rounded-b-3xl shadow-2xl overflow-hidden border-b-2 border-slate-200 animate-in slide-in-from-top-4 duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/80">
              <Logo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition active:scale-95"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-4 py-3 space-y-4">
              {/* Quick Search Bar */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-semibold hover:border-brand-500 transition"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search cables, pipes, raw materials...</span>
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                  Search
                </span>
              </button>

              {/* ⚡ High Priority: Mill-Direct Raw Materials Banner */}
              <Link
                href="/raw-materials"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-md active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-black/20 text-slate-950">
                      <Zap className="w-4 h-4 fill-slate-950" />
                    </span>
                    <div>
                      <span className="text-xs font-black tracking-tight uppercase block text-slate-950">
                        Mill-Direct Raw Materials
                      </span>
                      <span className="text-[11px] font-bold text-slate-900 block opacity-90">
                        99.99% ETP Copper Rods & Polymers
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-950 font-black" />
                </div>
              </Link>

              {/* Core Divisions in Touch Grid */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1">
                  Product Catalogs & Divisions
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/products?category=industrial-power-cables"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col justify-between active:scale-95 transition"
                  >
                    <Layers className="w-5 h-5 text-sky-600 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      Cables & Wires
                    </span>
                    <span className="text-[10px] text-slate-500">Armored & Flexible</span>
                  </Link>

                  <Link
                    href="/products?category=plastic-polymer-components"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col justify-between active:scale-95 transition"
                  >
                    <Factory className="w-5 h-5 text-emerald-600 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      Pipes & Polymers
                    </span>
                    <span className="text-[10px] text-slate-500">Rigid uPVC Conduits</span>
                  </Link>

                  <Link
                    href="/manufacturing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col justify-between active:scale-95 transition"
                  >
                    <Building className="w-5 h-5 text-brand-600 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      Manufacturing
                    </span>
                    <span className="text-[10px] text-slate-500">Continuous Extrusion</span>
                  </Link>

                  <Link
                    href="/quality"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex flex-col justify-between active:scale-95 transition"
                  >
                    <FileCheck className="w-5 h-5 text-amber-600 mb-1.5" />
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      Quality & Testing
                    </span>
                    <span className="text-[10px] text-slate-500">ISO 9001 & 15kV Spark</span>
                  </Link>
                </div>
              </div>

              {/* Technical & Company Navigation Links */}
              <div className="pt-1 border-t border-slate-100 space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block px-1 mb-1">
                  Company & Specifications
                </span>

                <div className="grid grid-cols-2 gap-1 text-xs font-semibold">
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • About PDVolts
                  </Link>
                  <Link
                    href="/industries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • Industries
                  </Link>
                  <Link
                    href="/downloads"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • Downloads / Specs
                  </Link>
                  <Link
                    href="/gallery"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • Factory Gallery
                  </Link>
                  <Link
                    href="/careers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • Careers
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • Technical Blog
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                  >
                    • FAQs
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-brand-700 font-bold hover:bg-brand-50"
                  >
                    • Contact & Inquiry
                  </Link>
                </div>
              </div>

              {/* User Session or Login Box */}
              <div className="pt-2 border-t border-slate-100">
                {user ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{user.email}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-2.5 py-1 text-xs font-black bg-amber-200 text-amber-900 rounded-lg"
                        >
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100 rounded-lg"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 rounded-xl border-2 border-slate-300 font-bold text-xs text-slate-800 active:scale-95 transition"
                    >
                      Client Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 rounded-xl bg-brand-700 text-white font-extrabold text-xs shadow-md active:scale-95 transition"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact Footer Strip in Drawer */}
            <div className="p-3 bg-slate-950 text-white flex items-center justify-around text-xs border-t border-slate-800">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300"
              >
                <Phone className="w-3.5 h-3.5" /> Call Sales
              </a>
              <span className="text-slate-700">|</span>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 font-bold hover:text-emerald-300"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <span className="text-slate-700">|</span>
              <a
                href={`mailto:${siteConfig.contact.salesEmail}`}
                className="flex items-center gap-1.5 text-sky-400 font-bold hover:text-sky-300"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
