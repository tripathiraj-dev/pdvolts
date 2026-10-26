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
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12 md:h-14",
    lg: "h-14 sm:h-16 md:h-20",
  };

  const isDarkBg = variant === "light";

  if (layout === "icon") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center group select-none ${className}`}
        aria-label="PDVOLT - Precision Wires, Cables, Polymers & Pipes"
      >
        <div className="relative p-0.5 transition-transform duration-200 group-hover:scale-105">
          <img
            src="/images/pdvolt-brand-master.png"
            alt="PDVOLT Emblem"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-sm"
          />
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
        <div className="relative inline-block transition-transform duration-200 group-hover:scale-[1.02]">
          <img
            src="/images/pdvolt-brand-master.png"
            alt="PDVOLT - Precision Wires, Cables, Polymers & Pipes"
            className="w-44 sm:w-56 h-auto object-contain drop-shadow-md"
          />
        </div>
      </Link>
    );
  }

  // Default Horizontal Lockup: New 3D Brand Logo + Bold Typography Lockup
  return (
    <Link
      href="/"
      className={`inline-flex items-center group select-none shrink-0 ${className}`}
      aria-label="PDVOLT - Precision Wires, Cables, Polymers & Pipes"
    >
      <div className="flex items-center gap-2 sm:gap-2.5 transition-transform duration-200 group-hover:scale-[1.02]">
        {/* New 3D Logo Mark */}
        <img
          src="/images/pdvolt-brand-master.png"
          alt="PDVOLT Brand Logo"
          className={`${heightClasses[size]} w-auto object-contain shrink-0 drop-shadow-sm`}
        />

        {/* Wordmark typography in matching industrial blue & electric orange */}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline font-black font-heading tracking-tight text-xl sm:text-2xl">
            <span className={isDarkBg ? "text-white" : "text-[#0B3B82]"}>PD</span>
            <span className="text-[#FF6B00]">VOLT</span>
          </div>

          {showSubtitle && (
            <span
              className={`text-[8px] sm:text-[9.5px] font-bold uppercase tracking-widest mt-0.5 ${
                isDarkBg ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Cables • Polymers • Pipes
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


