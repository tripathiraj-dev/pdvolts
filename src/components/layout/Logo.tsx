import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  showSubtitle?: boolean;
}

export default function Logo({ variant = "dark", className = "", showSubtitle = true }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3.5 group select-none ${className}`}
      aria-label="PDVolts - Precision Wires, Polymers & Pipes"
    >
      {/* High-Tech Industrial Voltage & Wire Core Emblem */}
      <div className="relative w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 border border-brand-500/30 shadow-lg shadow-brand-950/40 group-hover:border-brand-400 group-hover:shadow-brand-500/25 group-hover:scale-105 transition-all duration-300">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-brand-500/15 via-amber-500/15 to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-1"
        >
          <defs>
            {/* Hexagon Metallic Wire Gradient */}
            <linearGradient id="pdShieldGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Lightning High Voltage Spark Gradient */}
            <linearGradient id="pdSparkGrad" x1="12" y1="6" x2="28" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>

            {/* Copper Conductor Coil Glow */}
            <radialGradient id="pdCoreGlow" cx="20" cy="20" r="14" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Ambient Conductor Glow */}
          <circle cx="20" cy="20" r="13" fill="url(#pdCoreGlow)" />

          {/* Precision Hexagonal Industrial Frame */}
          <path
            d="M20 3.5L34.5 11.5V28.5L20 36.5L5.5 28.5V11.5L20 3.5Z"
            stroke="url(#pdShieldGrad)"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* Inner Wire Core Strands Ring */}
          <circle
            cx="20"
            cy="20"
            r="8.5"
            stroke="#64748b"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            className="opacity-60"
          />

          {/* Dynamic High-Voltage Volt Lightning Surge */}
          <path
            d="M22 7L13.5 19H22.5L18 33L28.5 18H20.5L24 7Z"
            fill="url(#pdSparkGrad)"
            className="filter drop-shadow-[0_0_5px_rgba(245,158,11,0.7)]"
          />

          {/* Copper Core Micro-Contacts */}
          <circle cx="10" cy="20" r="1.4" fill="#fbbf24" />
          <circle cx="30" cy="20" r="1.4" fill="#38bdf8" />
        </svg>

        {/* Live Spark Indicator Dot */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-slate-900"></span>
        </span>
      </div>

      {/* Brand Wordmark & Industrial Subtitle */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline tracking-tight font-extrabold leading-none">
          <span className="text-2xl sm:text-[27px] font-black bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-blue-500 transition-colors">
            PD
          </span>
          <span
            className={`text-2xl sm:text-[27px] font-black ${
              isLight ? "text-white" : "text-slate-900"
            } tracking-tight group-hover:text-brand-600 transition-colors ml-0.5`}
          >
            VOLTS
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500 ml-1 shadow-sm shadow-amber-500/50" />
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-[10px] font-bold tracking-[0.22em] uppercase leading-none ${
                isLight ? "text-slate-300" : "text-slate-500"
              }`}
            >
              Wires • Polymers • Pipes
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-brand-500 opacity-70" />
            <span
              className={`text-[9px] font-extrabold uppercase tracking-wider ${
                isLight ? "text-amber-400" : "text-amber-600"
              }`}
            >
              ISO 9001
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
