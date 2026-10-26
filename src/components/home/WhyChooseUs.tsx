import React from "react";
import {
  ShieldCheck,
  Cpu,
  Zap,
  Truck,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
  const highlights = [
    {
      icon: Zap,
      title: "Mill-Direct Metallurgical Purity",
      desc: "Continuous cast oxygen-free copper and virgin polymer compounds manufactured directly without middleman markups.",
      badges: ["99.99% ETP Cu", "ASTM B49", "IS 12444", "Virgin Polymers"],
      color: "from-amber-500/10 to-orange-500/5 border-amber-200 text-amber-600",
      pillBg: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      icon: Cpu,
      title: "Automated Laser Extrusion",
      desc: "Siemens PLC tandem lines with automated optical laser feedback maintaining dielectric insulation accuracy.",
      badges: ["±0.01mm Tolerance", "600m/min Speed", "Tandem Extrusion"],
      color: "from-sky-500/10 to-blue-500/5 border-sky-200 text-sky-600",
      pillBg: "bg-sky-50 text-sky-800 border-sky-200",
    },
    {
      icon: ShieldCheck,
      title: "100% In-Line Spark Testing",
      desc: "Every drum passes 15kV high-potential spark testing, Kelvin micro-ohm resistance tests, and elongation checks.",
      badges: ["15kV Spark Tested", "Zero Dielectric Flaws", "ISO 9001:2015"],
      color: "from-emerald-500/10 to-teal-500/5 border-emerald-200 text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      icon: Truck,
      title: "Rapid Global Dispatch",
      desc: "Comprehensive warehouse inventory and sea-worthy export pallet packaging dispatched on tight project timelines.",
      badges: ["48-72 Hr Dispatch", "Custom Drum Packaging", "45+ Countries"],
      color: "from-indigo-500/10 to-purple-500/5 border-indigo-200 text-indigo-600",
      pillBg: "bg-indigo-50 text-indigo-800 border-indigo-200",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Concise Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
              Engineering Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Why Project Leaders Rely on PDVOLT
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Precision conductors, virgin polymer compounding, and 100% spark-tested reliability for mission-critical infrastructure.
            </p>
          </div>

          <Link
            href="/quality"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition group shrink-0"
          >
            <span>View Testing Accreditations</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* 4 Crisp High-Impact Cards with Small Mini-Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`p-5 sm:p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between ${item.color}`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-black text-slate-900 font-heading mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Small Clean Pill Badges (just like in the Nav ticker) */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/60">
                  {item.badges.map((b, bIdx) => (
                    <span
                      key={bIdx}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${item.pillBg}`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

