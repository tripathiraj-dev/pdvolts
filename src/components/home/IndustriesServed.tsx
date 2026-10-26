import React from "react";
import Link from "next/link";
import { Zap, Sun, Building2, Train, Factory, Flame, ArrowRight } from "lucide-react";

interface Industry {
  id: string;
  title: string;
  slug: string;
  summary: string;
  icon: string | null;
  imageUrl: string | null;
}

interface IndustriesServedProps {
  industries: Industry[];
}

export default function IndustriesServed({ industries }: IndustriesServedProps) {
  const defaultSectors = [
    {
      title: "Solar & Renewable Power",
      icon: Sun,
      pills: ["UV Resistant", "IEC 62930", "-40°C to +120°C"],
      color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    },
    {
      title: "Power Utilities & Grids",
      icon: Zap,
      pills: ["Armored XLPE", "1.1kV - 33kV", "100% Spark Tested"],
      color: "text-sky-400 bg-sky-400/10 border-sky-400/30",
    },
    {
      title: "Commercial & Infra EPC",
      icon: Building2,
      pills: ["FR PVC Wires", "IS 694", "Low Smoke Zero Halogen"],
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    },
    {
      title: "Railways & Metro Transit",
      icon: Train,
      pills: ["Fire Survival", "Anti-Rodent", "Heavy Mechanical"],
      color: "text-rose-400 bg-rose-400/10 border-rose-400/30",
    },
    {
      title: "Industrial Automation",
      icon: Factory,
      pills: ["Class 5 Flexible", "Oil Resistant", "CNC & Robotics"],
      color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/30",
    },
    {
      title: "Oil, Gas & Chemical",
      icon: Flame,
      pills: ["Hydrocarbon Proof", "Lead-Free", "ATEX Compliant"],
      color: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full inline-block">
              Sector Deployments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Industries Powered by PDVOLT
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Engineered conductors and polymer components tailored for the unique stresses of heavy utilities and infrastructure.
            </p>
          </div>

          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition group shrink-0"
          >
            <span>Explore All Sectors</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Compact Grid with Mini Badges (No bloated paragraphs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {defaultSectors.map((sector, idx) => {
            const Icon = sector.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex items-start gap-3.5 group"
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${sector.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-2 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition truncate">
                    {sector.title}
                  </h3>

                  {/* Clean Mini Pills */}
                  <div className="flex flex-wrap gap-1">
                    {sector.pills.map((p, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

