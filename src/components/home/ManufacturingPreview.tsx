"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Factory, Cog, Flame, ShieldCheck, CheckCircle2, Award } from "lucide-react";

export default function ManufacturingPreview() {
  const infraHighlights = [
    {
      icon: Factory,
      title: "120,000 Sq.Ft Heavy Plant",
      pills: ["Continuous Rod Breakdown", "Dual-Line Extruders", "Automatic Winders"],
    },
    {
      icon: Cog,
      title: "Siemens PLC Laser Control",
      pills: ["±0.01mm Tolerance", "Closed-Loop Laser Feedback", "600m/min Speed"],
    },
    {
      icon: Flame,
      title: "Dedicated Polymer Compounding",
      pills: ["Virgin PVC Resins", "Oxygen Index >29%", "Low Smoke Zero Halogen"],
    },
    {
      icon: ShieldCheck,
      title: "100% Spark & Dielectric Testing",
      pills: ["15kV High-Potential", "Kelvin Micro-Ohm Bridge", "Zero Defect Guarantee"],
    },
  ];

  const certifications = [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "CE Compliant",
    "RoHS Verified",
    "IS 694 / IS 7098",
    "IEC 60228",
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual Side (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="PDVOLT Wire Extrusion Facility"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80";
                }}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
              
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 rounded">
                  Primary Extrusion Bay
                </span>
                <p className="text-sm font-bold text-white">
                  Tandem line applying dual-layer cross-linked insulation at high speeds
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> NABL Accredited Lab
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-amber-300 border border-amber-300/30">
                    50,000 MT Annual Capacity
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Side (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
                Industrial Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                World-Class Manufacturing & Testing Protocols
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                Integrated copper drawing, compounding, and in-line robotic inspection ensuring zero insulation breakdown across mission-critical circuits.
              </p>
            </div>

            {/* 4 Infrastructure Compact Feature Tiles with Small Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {infraHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.title}
                      </h4>
                    </div>

                    {/* Small badges just like in nav */}
                    <div className="flex flex-wrap gap-1">
                      {item.pills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/80"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Accreditations Strip */}
            <div className="pt-2 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">
                  Certified Standards:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {certifications.map((c, cIdx) => (
                  <span
                    key={cIdx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1 flex items-center gap-4">
              <Link
                href="/manufacturing"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-600 transition"
              >
                Tour Manufacturing Facility <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/quality"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 transition"
              >
                View Testing Certificates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

