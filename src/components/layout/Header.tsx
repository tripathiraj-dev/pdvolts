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
  Sparkles,
  HelpCircle,
  FileText,
  Briefcase,
  Image as ImageIcon,
  Building,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  ChevronRight,
  FolderDown,
  BookOpen,
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

  // Main Dropdown Data
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

  const cablesItems = [
    {
      title: "Armored XLPE Power Cables",
      desc: "0.6/1.1kV to 33kV utility feeders with steel wire armoring",
      href: "/products?category=industrial-power-cables",
    },
    {
      title: "Building & Panel Flexible Wires",
      desc: "High-grade electrolytic copper wires with flame retardant PVC",
      href: "/products?category=building-flexible-wires",
    },
    {
      title: "Solar Photovoltaic (PV) Cables",
      desc: "TUV certified halogen-free dual insulated solar cables (1500V DC)",
      href: "/products/halogen-free-solar-pv-cable",
    },
    {
      title: "Submersible 3-Core Flat Cables",
      desc: "Water-impervious PVC jacketed cables for deep borewell pumps",
      href: "/products/submersible-3-core-flat-cable",
    },
    {
      title: "Control & Instrumentation Cables",
      desc: "Shielded and screened multicore cables for automated plants",
      href: "/products?category=control-instrumentation-cables",
    },
  ];

  const pipesItems = [
    {
      title: "Rigid uPVC Electrical Conduit Pipes",
      desc: "Heavy-duty non-metallic, self-extinguishing conduit pipes",
      href: "/products/rigid-pvc-electrical-conduit-pipes",
    },
    {
      title: "Precision Molded Terminal Blocks",
      desc: "High-temperature phenolic and nylon electrical terminal connectors",
      href: "/products/precision-molded-terminal-blocks",
    },
    {
      title: "Conduit Fittings & Junction Boxes",
      desc: "Weatherproof junction boxes, bends, tees, and industrial couplers",
      href: "/products?category=plastic-polymer-components",
    },
  ];

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all">
        {/* ============================================================
            TIER 1: TOP CORPORATE UTILITY STRIP (High-Tech Dark Bar)
           ============================================================ */}
        <div className="bg-slate-950 text-slate-300 text-xs border-b border-slate-800/80 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Quick Contact Info */}
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold tracking-wide">
                  {siteConfig.contact.phone}
                </a>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <a href={`mailto:${siteConfig.contact.salesEmail}`} className="font-semibold">
                  {siteConfig.contact.salesEmail}
                </a>
              </span>
            </div>

            {/* Industrial Live Ticker (Desktop) */}
            <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-slate-100 font-bold">99.99% ETP Copper Rods</span>
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-200 font-semibold">50,000 MT/Yr Capacity</span>
              <span className="text-slate-700">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ISO 9001:2015 & CE Certified
              </span>
            </div>

            {/* Quick Portal Access */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/faq" className="hover:text-white transition text-slate-400 hover:text-slate-200 font-medium hidden sm:inline">
                FAQ
              </Link>
              <span className="text-slate-700 hidden sm:inline">|</span>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-semibold">{user.name}</span>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold bg-amber-950/70 px-2 py-0.5 rounded border border-amber-500/40 text-[11px]"
                    >
                      <Shield className="w-3 h-3 text-amber-400" />
                      Admin
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="hover:text-white transition text-slate-300 font-medium">
                    Login
                  </Link>
                  <span className="text-slate-700">•</span>
                  <Link href="/register" className="hover:text-amber-400 transition text-amber-400 font-bold">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            TIER 2: MAIN BRAND & PRODUCT NAVIGATION BAR (Crisp Pure White)
           ============================================================ */}
        <div className="bg-white/95 backdrop-blur-md border-b-2 border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* High-Contrast Bold Brand Logo */}
              <Logo size="md" />

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                <Link
                  href="/"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === "/"
                      ? "text-brand-700 bg-brand-50 shadow-xs"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  Home
                </Link>

                {/* ⚡ Raw Materials Megamenu */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("raw-materials")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/raw-materials"
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/raw-materials")
                        ? "text-amber-900 bg-amber-100 border border-amber-300 shadow-xs"
                        : "text-slate-800 hover:text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500/30" />
                    <span>Raw Materials</span>
                    <span className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-md">
                      99.99% Cu
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  {activeDropdown === "raw-materials" && (
                    <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2.5 mb-2 border-b border-slate-100">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                          Mill-Direct Industrial Raw Materials
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
                            className="block p-2.5 rounded-xl hover:bg-amber-50/70 transition group border border-transparent hover:border-amber-200"
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
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          href="/raw-materials"
                          className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Explore Raw Materials <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/contact?subject=Raw+Material+Bulk+Procurement"
                          className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-lg transition shadow-sm"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Bulk Inquiry
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cables & Wires */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("cables")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.startsWith("/products") && !pathname.includes("plastic")
                        ? "text-brand-700 bg-brand-50 shadow-xs"
                        : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Cables & Wires</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {activeDropdown === "cables" && (
                    <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2.5 mb-2 border-b border-slate-100">
                        <span className="text-xs font-black uppercase tracking-wider text-brand-600">
                          Power & Flexible Conductor Range
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Armored XLPE, flexible wires, solar PV, and submersible cables.
                        </p>
                      </div>
                      <div className="space-y-1">
                        {cablesItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className="block p-2.5 rounded-xl hover:bg-slate-50 transition group border border-transparent hover:border-slate-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="font-bold text-sm text-slate-900 group-hover:text-brand-600">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <Link
                          href="/products"
                          className="flex items-center justify-between p-2.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span>View All Wire & Cable Products</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pipes & Polymers */}
                <div
                  className="relative"
                  onMouseEnter={() => handleMouseEnter("pipes")}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                      pathname.includes("plastic") || pathname.includes("conduit")
                        ? "text-brand-700 bg-brand-50 shadow-xs"
                        : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Pipes & Polymers</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {activeDropdown === "pipes" && (
                    <div className="absolute left-0 mt-2 w-84 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 pb-2.5 mb-2 border-b border-slate-100">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                          uPVC Conduits & Precision Polymers
                        </span>
                      </div>
                      <div className="space-y-1">
                        {pipesItems.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href}
                            className="block p-2.5 rounded-xl hover:bg-emerald-50/60 transition group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                              {item.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Manufacturing */}
                <Link
                  href="/manufacturing"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === "/manufacturing"
                      ? "text-brand-700 bg-brand-50 shadow-xs"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  Manufacturing
                </Link>

                {/* Quality Lab */}
                <Link
                  href="/quality"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === "/quality"
                      ? "text-brand-700 bg-brand-50 shadow-xs"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  Quality Lab
                </Link>

                {/* Blog */}
                <Link
                  href="/blog"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname.startsWith("/blog")
                      ? "text-brand-700 bg-brand-50 shadow-xs"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  Technical Blog
                </Link>

                {/* Downloads */}
                <Link
                  href="/downloads"
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === "/downloads"
                      ? "text-brand-700 bg-brand-50 shadow-xs"
                      : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                  }`}
                >
                  Downloads
                </Link>
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Search Button */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-medium transition"
                  title="Search Products (Ctrl+K)"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="hidden xl:inline">Search...</span>
                  <kbd className="hidden xl:inline-block px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-500 font-mono">
                    ⌘K
                  </kbd>
                </button>

                {/* User Dropdown / Login */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                    >
                      <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>

                    {userDropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-xs font-medium text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                            {user.role}
                          </span>
                        </div>

                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 font-bold hover:bg-amber-50 transition"
                          >
                            <Shield className="w-4 h-4 text-amber-600" /> Admin Control Panel
                          </Link>
                        )}

                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Client Dashboard
                        </Link>

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition font-medium"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-brand-600 transition"
                  >
                    Log In
                  </Link>
                )}

                {/* High-Impact Amber/Orange RFQ CTA */}
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs xl:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/20 hover:shadow-lg transition-all transform active:scale-95"
                >
                  <span>Request a Quote</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>

              {/* Mobile Header Actions (Clean white bar) */}
              <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
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
