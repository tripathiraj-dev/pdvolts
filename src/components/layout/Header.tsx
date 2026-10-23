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
    },
    {
      title: "EC Grade Aluminum Wire Rods",
      desc: "High conductivity IS 5484 EC 1370 grade aluminum rods for conductors",
      href: "/raw-materials#ec-aluminum",
    },
    {
      title: "Specialized PVC Cable Compounds",
      desc: "Virgin FR, FRLS, and Type C heat-resistant polymer granules",
      href: "/raw-materials#pvc-compounds",
    },
    {
      title: "Silane & Peroxide Curable XLPE",
      desc: "High-dielectric cross-linkable polyethylene for power insulation",
      href: "/raw-materials#xlpe-resins",
    },
    {
      title: "Color & UV Masterbatches",
      desc: "High pigment dispersion masterbatches for high-speed extruders",
      href: "/raw-materials#masterbatches",
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

  // Secondary Bottom Navigation Bar Links
  const secondaryLinks = [
    { label: "About Us", href: "/about" },
    { label: "Manufacturing Plant", href: "/manufacturing" },
    { label: "Quality Lab", href: "/quality" },
    { label: "Industries", href: "/industries" },
    { label: "Downloads & Specs", href: "/downloads" },
    { label: "Factory Gallery", href: "/gallery" },
    { label: "Technical Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "FAQs", href: "/faq" },
  ];

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b-2 border-slate-200 shadow-md transition-all overflow-x-clip">
        {/* Top Corporate Strip */}
        <div className="hidden lg:block bg-slate-950 text-slate-300 text-xs border-b border-slate-800 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Quick Contact Info */}
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${siteConfig.contact.phone}`} className="font-semibold tracking-wide">
                  {siteConfig.contact.phone}
                </a>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold">
                  {siteConfig.contact.email}
                </a>
              </span>
            </div>

            {/* SAT / Industrial Live Performance Ticker */}
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-slate-100 font-bold">99.99% ETP Copper</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-200 font-semibold">50,000 MT/Yr Capacity</span>
              <span className="text-slate-700">|</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ISO 9001:2015 & CE Certified
              </span>
            </div>

            {/* Quick Links & Portal Access */}
            <div className="flex items-center gap-4">
              <Link href="/faq" className="hover:text-white transition text-slate-400 hover:text-slate-200 font-medium">
                FAQ
              </Link>
              <span className="text-slate-700">|</span>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-500/40 text-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Admin Panel
                </Link>
              ) : (
                <Link href="/login" className="hover:text-white transition text-slate-300 hover:text-white font-medium">
                  Client / Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Thick & Distinct Primary Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22 py-2">
            {/* Bold Brand Logo */}
            <Logo variant="dark" />

            {/* Main Primary Links (Kept strictly to core 5 items so it never overflows screen width) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Home */}
              <Link
                href="/"
                className={`px-3.5 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all ${
                  pathname === "/"
                    ? "text-brand-700 bg-brand-50 shadow-sm"
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
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all ${
                    pathname.startsWith("/raw-materials")
                      ? "text-amber-900 bg-amber-100 border border-amber-300 shadow-sm"
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
                    <div className="space-y-1.5">
                      {rawMaterialItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block p-2.5 rounded-xl hover:bg-amber-50/70 transition group"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
                            {item.title}
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
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all ${
                    pathname.startsWith("/products") && !pathname.includes("plastic")
                      ? "text-brand-700 bg-brand-50 shadow-sm"
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
                        High performance cables engineered for extreme thermal and mechanical endurance.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      {cablesItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className="block p-2.5 rounded-xl hover:bg-slate-50 transition group"
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
                        className="flex items-center justify-between p-2 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
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
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all ${
                    pathname.includes("plastic") || pathname.includes("conduit")
                      ? "text-brand-700 bg-brand-50 shadow-sm"
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
                    <div className="space-y-1.5">
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

              {/* Enquiry */}
              <Link
                href="/contact"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm xl:text-[15px] font-bold transition-all ${
                  pathname === "/contact"
                    ? "text-brand-700 bg-brand-50 shadow-sm"
                    : "text-slate-700 hover:text-brand-600 hover:bg-slate-100"
                }`}
              >
                <span>Enquiry</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </Link>
            </nav>

            {/* Right Action Icons & Primary CTA Buttons */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Global Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition"
                title="Search Products & Materials (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Button */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition shadow-sm"
                  title="Admin Dashboard"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin</span>
                </Link>
              )}

              {/* User Session or Login */}
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
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-brand-600 transition"
                  >
                    Log In
                  </Link>
                </div>
              )}

              {/* Primary High-Impact CTA Button */}
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs xl:text-sm font-extrabold text-white bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 hover:from-brand-800 hover:to-sky-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Actions & Hamburger */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-600 hover:text-brand-600 rounded-lg"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 hover:text-slate-950 rounded-xl border border-slate-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Sub-Navigation Strip (Clean corporate & technical links below main nav) */}
        <div className="hidden lg:block bg-slate-100/90 border-t border-slate-200/80 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-600 font-semibold overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-black uppercase text-slate-400 mr-2 tracking-wider">
                Explore:
              </span>
              {secondaryLinks.map((item, idx) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <React.Fragment key={item.href}>
                    <Link
                      href={item.href}
                      className={`px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                        isActive
                          ? "text-brand-700 bg-white shadow-xs font-bold"
                          : "hover:text-brand-700 hover:bg-white/80"
                      }`}
                    >
                      {item.label}
                    </Link>
                    {idx < secondaryLinks.length - 1 && <span className="text-slate-300">•</span>}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-medium shrink-0 pl-4 hidden xl:block">
              Continuous Extrusion & Wire Drawing Plant
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-8 space-y-4 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
            {/* Direct Raw Material Highlight in Mobile */}
            <Link
              href="/raw-materials"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold text-sm shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-600" />
                <span>Raw Materials Supply</span>
              </div>
              <span className="text-xs bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black">
                99.99% Cu
              </span>
            </Link>

            {/* Main Links */}
            <div className="grid grid-cols-2 gap-2 py-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Cables & Wires
              </Link>
              <Link
                href="/products?category=plastic-polymer-components"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Pipes & Polymers
              </Link>
              <Link
                href="/manufacturing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Manufacturing
              </Link>
              <Link
                href="/quality"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Quality Lab
              </Link>
              <Link
                href="/industries"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Industries
              </Link>
              <Link
                href="/downloads"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Downloads
              </Link>
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Blog
              </Link>
              <Link
                href="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                Careers
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-slate-800 hover:bg-slate-50"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 text-sm rounded-xl font-bold text-brand-700 bg-brand-50"
              >
                Enquiry & Contact
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 shadow-md"
              >
                Request a Quote
              </Link>

              {user ? (
                <div className="flex gap-2 pt-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-bold border border-slate-300 rounded-xl text-slate-800"
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 text-center py-2.5 text-sm font-black bg-amber-100 text-amber-900 border border-amber-300 rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Shield className="w-4 h-4 text-amber-700" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-sm font-bold border-2 border-slate-300 rounded-xl text-slate-800"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-sm font-bold bg-brand-700 text-white rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Quick Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
