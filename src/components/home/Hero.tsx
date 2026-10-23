"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Layers,
  Factory,
  ShieldCheck,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

interface SlideData {
  id: string;
  category: string;
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  youtubeId: string;
  posterImage: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  accentColor: string;
  badgeBg: string;
}

export default function Hero() {
  const slides: SlideData[] = [
    {
      id: "raw-material",
      category: "Raw Material",
      badge: "Mill-Direct Raw Material Sourcing",
      title: "99.99% Continuous Cast Copper &",
      highlightText: "Virgin Polymer Compounds",
      description: "Direct manufacturing of ASTM B49 ETP copper rods, EC aluminum, and flame-retardant PVC/XLPE.",
      youtubeId: "C7mjlx4iJ9o",
      posterImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80",
      primaryCta: { label: "Explore Raw Materials", href: "/raw-materials" },
      secondaryCta: { label: "Request Bulk Quote", href: "/contact?subject=Raw+Material+Bulk+Supply" },
      accentColor: "from-amber-400 via-yellow-400 to-orange-500",
      badgeBg: "bg-amber-500 text-slate-950 font-black",
    },
    {
      id: "cables-wires",
      category: "Cables & Wires",
      badge: "Heavy-Duty Cable Manufacturing",
      title: "Armored Power, Flexible &",
      highlightText: "Solar PV Cables",
      description: "Precision engineered for high thermal endurance (-40°C to +105°C) and zero dielectric compromise.",
      youtubeId: "K3DxtoanDZI",
      posterImage: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1920&q=80",
      primaryCta: { label: "Browse Cable Catalog", href: "/products" },
      secondaryCta: { label: "Request Custom RFQ", href: "/quote" },
      accentColor: "from-sky-300 via-cyan-400 to-blue-400",
      badgeBg: "bg-sky-500 text-slate-950 font-black",
    },
    {
      id: "pipes-polymers",
      category: "Pipes & Polymers",
      badge: "Industrial Extrusion & Molding",
      title: "High-Impact Rigid uPVC Conduits &",
      highlightText: "Precision Moldings",
      description: "Flame-retardant, high-dielectric rigid uPVC electrical conduit pipes and terminal blocks.",
      youtubeId: "KEOUdI4Iyt8",
      posterImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1920&q=80",
      primaryCta: { label: "View Pipes & Polymers", href: "/products?category=plastic-polymer-components" },
      secondaryCta: { label: "Download Datasheets", href: "/downloads" },
      accentColor: "from-emerald-300 via-teal-400 to-green-400",
      badgeBg: "bg-emerald-500 text-slate-950 font-black",
    },
  ];

  const bottomCards = [
    {
      id: "card-raw",
      title: "Raw Materials",
      subtitle: "Copper & Polymers",
      desc: "99.99% ETP Copper Rods, EC Aluminum, Virgin PVC & XLPE Resins",
      badge: "ASTM B49 • 50,000 MT",
      href: "/raw-materials",
      icon: Zap,
      accent: "from-amber-500/20 to-orange-500/10 border-amber-300 group-hover:border-amber-500",
      iconColor: "text-amber-600 bg-amber-50 border-amber-200",
      tagColor: "bg-amber-100 text-amber-900 border-amber-200",
    },
    {
      id: "card-wires",
      title: "Cables & Wires",
      subtitle: "Power & Flexibility",
      desc: "Armored XLPE 1.1kV-33kV, Flexible Building Wires, Solar PV & Submersible",
      badge: "100% Spark Tested",
      href: "/products?category=industrial-power-cables",
      icon: Layers,
      accent: "from-sky-500/20 to-blue-500/10 border-sky-300 group-hover:border-sky-500",
      iconColor: "text-sky-600 bg-sky-50 border-sky-200",
      tagColor: "bg-sky-100 text-sky-900 border-sky-200",
    },
    {
      id: "card-pipes",
      title: "Pipes & Polymers",
      subtitle: "uPVC Conduit Systems",
      desc: "Rigid Electrical Conduits, Weatherproof Junction Boxes & Terminal Blocks",
      badge: "Self-Extinguishing UL94",
      href: "/products?category=plastic-polymer-components",
      icon: Factory,
      accent: "from-emerald-500/20 to-teal-500/10 border-emerald-300 group-hover:border-emerald-500",
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
      tagColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    },
    {
      id: "card-quality",
      title: "Quality & Testing",
      subtitle: "Laboratory Protocols",
      desc: "Optical Emission Spectrometry, 15kV In-Line Spark Testing & Lot Assurance",
      badge: "ISO 9001:2015 & CE",
      href: "/quality",
      icon: ShieldCheck,
      accent: "from-indigo-500/20 to-purple-500/10 border-indigo-300 group-hover:border-indigo-500",
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-200",
      tagColor: "bg-indigo-100 text-indigo-900 border-indigo-200",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentSlide, isPlaying]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide];

  return (
    <div className="w-full bg-slate-100">
      {/* 1. BRIGHT VIBRANT VIDEO CAROUSEL SECTION */}
      <section className="relative w-full overflow-hidden min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center bg-slate-900">
        {/* Video Slides */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                {/* Poster Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-7000 scale-102"
                  style={{ backgroundImage: `url(${slide.posterImage})` }}
                />

                {/* Bright YouTube Video Embed */}
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <iframe
                      className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%] object-cover opacity-90 pointer-events-none"
                      src={`https://www.youtube-nocookie.com/embed/${slide.youtubeId}?autoplay=1&mute=${
                        isMuted ? "1" : "0"
                      }&controls=0&loop=1&playlist=${slide.youtubeId}&playsinline=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=1`}
                      title={slide.title}
                      allow="autoplay; encrypted-media"
                      tabIndex={-1}
                    />
                  </div>
                )}

                {/* Soft Industrial Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              </div>
            );
          })}
        </div>

        {/* Minimal, Punchy Content Directly Over Video */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            {/* Small Sleek Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs shadow-md ${activeSlide.badgeBg}`}>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-ping"></span>
                <span className="truncate">{activeSlide.badge}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Feed</span>
              </span>
            </div>

            {/* Headline (Responsive font scaling for mobile) */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-heading leading-tight drop-shadow-md">
              {activeSlide.title}{" "}
              <span className={`bg-gradient-to-r ${activeSlide.accentColor} bg-clip-text text-transparent`}>
                {activeSlide.highlightText}
              </span>
            </h1>

            {/* Short 1-Line Subtitle */}
            <p className="text-xs sm:text-sm md:text-base text-slate-100 max-w-xl font-medium drop-shadow leading-relaxed line-clamp-3 sm:line-clamp-none">
              {activeSlide.description}
            </p>

            {/* Clean Action Buttons (Full-width on mobile, flex on desktop) */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-md sm:max-w-none">
              <Link
                href={activeSlide.primaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand-600 via-sky-600 to-blue-600 hover:from-brand-500 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-black/40 transition-all transform active:scale-95 text-center"
              >
                <span>{activeSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={activeSlide.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/40 shadow-sm transition active:scale-95 text-center"
              >
                {activeSlide.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Carousel Navigation & Controls at Bottom Right */}
        <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-8 z-30 flex items-center gap-1.5 sm:gap-2">
          {/* Audio & Play Controls */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20 transition shadow active:scale-95"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label="Toggle mute"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20 transition shadow active:scale-95"
            title={isPlaying ? "Pause Auto-Slide" : "Play Auto-Slide"}
            aria-label="Toggle autoplay"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
          </button>

          {/* Left / Right Arrows */}
          <button
            onClick={handlePrevSlide}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20 transition shadow active:scale-95"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur border border-white/20 transition shadow active:scale-95"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Slide Indicator Dots at Bottom Left */}
        <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-8 z-30 flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="p-1 group"
              aria-label={`Slide ${idx + 1}`}
            >
              <div
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-6 sm:w-8 bg-amber-400" : "w-2 sm:w-2.5 bg-white/50 hover:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* 2. PRODUCT CARDS DIRECTLY BELOW VIDEO (Optimized responsive padding & layout) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {bottomCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className={`group bg-white rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] flex flex-col justify-between ${card.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2.5 sm:p-3 rounded-xl border ${card.iconColor} shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${card.tagColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                    {card.title}
                  </h2>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5">{card.subtitle}</div>

                  <p className="text-xs text-slate-600 mt-2 sm:mt-2.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700 group-hover:text-brand-800">
                  <span>Explore Catalog</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
