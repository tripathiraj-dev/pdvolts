import React from "react";
import Link from "next/link";

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
  showSubtitle?: boolean;
  layout?: "horizontal" | "full" | "icon";
  size?: "sm" | "md" | "lg";
}

export default function Logo({
  variant = "dark",
  className = "",
  showSubtitle = true,
  layout = "horizontal",
  size = "md",
}: LogoProps) {
  // Size configurations
  const heightClasses = {
    sm: "h-8 sm:h-9",
    md: "h-9 sm:h-11 md:h-12",
    lg: "h-12 sm:h-14 md:h-16",
  };

  if (layout === "icon") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center group select-none ${className}`}
        aria-label="PDVOLT - Precision Wires, Cables, Polymers & Pipes"
      >
        <div className="relative p-1.5 rounded-xl bg-slate-950 border border-slate-800 shadow-md group-hover:border-amber-500/60 group-hover:scale-105 transition-all duration-300">
          <img
            src="/images/pdvolt-icon.png"
            alt="PDVOLT Emblem"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow"
          />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-slate-950"></span>
          </span>
        </div>
      </Link>
    );
  }

  if (layout === "full") {
    return (
      <Link
        href="/"
        className={`inline-flex flex-col group select-none ${className}`}
        aria-label="PDVOLT - Powering Your Projects"
      >
        <div className="relative inline-block p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl group-hover:border-amber-500/50 group-hover:scale-[1.02] transition-all duration-300">
          <img
            src="/images/pdvolt-full.png"
            alt="PDVOLT - Cables, Wires, Pipes, Raw Materials"
            className="w-52 sm:w-60 h-auto object-contain drop-shadow-lg"
          />
        </div>
      </Link>
    );
  }

  // Default: Horizontal Brand Lockup inside a high-tech obsidian capsule
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className}`}
      aria-label="PDVOLT - Precision Wires, Cables, Polymers & Pipes"
    >
      <div className="relative flex items-center bg-slate-950 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-800/90 shadow-md group-hover:border-amber-500/60 group-hover:shadow-amber-500/15 group-hover:scale-[1.02] transition-all duration-300">
        <img
          src="/images/pdvolt-horizontal.png"
          alt="PDVOLT - Powering Your Projects"
          className={`${heightClasses[size]} w-auto object-contain drop-shadow-md`}
        />
        
        {/* Subtle ambient live spark badge */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5 pointer-events-none">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-500 border border-slate-950"></span>
        </span>
      </div>
    </Link>
  );
}
