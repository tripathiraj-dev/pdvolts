import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Factory,
  Cpu,
  Layers,
  ShieldCheck,
  Flame,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Manufacturing Infrastructure | Continuous Extrusion & Polymer Compounding",
  description:
    "Take a tour of PdVolts' 120,000 sq.ft. manufacturing complex, featuring high-speed tandem wire drawing, automated extrusion, and advanced testing chambers.",
};

export default function ManufacturingPage() {
  const lineDetails = [
    {
      title: "Continuous Multi-Wire Breakdown & Annealing",
      desc: "High-precision continuous rod breakdown converting 8mm electrolytic copper rods down to 0.2mm fine wires in an oxygen-depleted nitrogen annealing chamber to guarantee optimum tensile ductility.",
      specs: ["Purity: 99.97% EC Copper", "Speeds: Up to 1,800 m/min", "Automated spool tension controls"],
    },
    {
      title: "Tandem Dual-Head Extrusion Lines",
      desc: "Simultaneous co-extrusion of primary insulation and tough outer protective sheathing. Equipped with laser diameter gauges providing real-time ±0.01mm feedback to automated servo extruders.",
      specs: ["Extrusion polymers: XLPE, PVC, HFFR, PE", "Dual-plane optical laser gauge", "In-line 15 kV spark tester"],
    },
    {
      title: "Precision Polymer Compounding & Masterbatch",
      desc: "Twin-screw continuous compounding line synthesizing our proprietary flame-retardant and oil-resistant thermoplastic compounds directly on-site, cutting lead times and ensuring zero batch variance.",
      specs: ["Capacity: 35,000 MT/year", "LOI flammability control > 29%", "Custom Pantone/RAL color matching"],
    },
    {
      title: "Robotic Cable Drum Winders & Packing",
      desc: "Automated traversing winders that lay uniform layers across heavy-duty wooden drums. Each drum is strapped, lagged with protective wooden battens, and shrink-wrapped for international maritime transit.",
      specs: ["Drum sizes: 500m to 2,000m spools", "ISPM-15 export certified timber", "Barcode lot traceability"],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Industrial Facility & Technology
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Advanced Manufacturing Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Operating across 120,000 square feet of state-of-the-art facilities engineered for high-volume
            production, automated dimensional tolerances, and zero environmental waste.
          </p>
        </div>
      </section>

      {/* Facilities Overview Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lineDetails.map((line, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-heading">{line.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{line.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Technical Specifications
                </span>
                {line.specs.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Plant Tour Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Facility Inspection
            </span>
            <h3 className="text-2xl font-bold font-heading">
              Interested in Scheduling a Factory Audit or Witness Test?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              We welcome client technical representatives, EPC auditors, and third-party inspectors
              (Lloyd’s, Bureau Veritas, SGS) to inspect raw materials and observe lot testing.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 px-6 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow transition"
          >
            Arrange Plant Visit <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
