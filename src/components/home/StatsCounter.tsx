"use client";

import React from "react";
import { Award, Factory, Users, Globe2, Layers } from "lucide-react";
import { siteConfig } from "@/config/site";

interface StatsCounterProps {
  customStats?: {
    statsYears?: string;
    statsCapacity?: string;
    statsClients?: string;
    statsCountries?: string;
    statsProducts?: string;
  };
}

export default function StatsCounter({ customStats }: StatsCounterProps) {
  const statsList = [
    {
      icon: Award,
      label: "Years Manufacturing",
      value: customStats?.statsYears || "28+",
      description: "Pioneering wire & polymer engineering since 1998",
    },
    {
      icon: Factory,
      label: "Annual Capacity",
      value: customStats?.statsCapacity || "85,000 MT",
      description: "High-speed extrusion lines operating 24/7",
    },
    {
      icon: Users,
      label: "Enterprise Clients",
      value: customStats?.statsClients || "1,450+",
      description: "Contractors, OEMs & public utility partners",
    },
    {
      icon: Globe2,
      label: "Export Markets",
      value: customStats?.statsCountries || "45+",
      description: "Direct sea freight & global distribution network",
    },
    {
      icon: Layers,
      label: "Certified SKUs",
      value: customStats?.statsProducts || "500+",
      description: "UL, CE, RoHS & ISO accredited formulations",
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-10 sm:py-14 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-6 lg:divide-x lg:divide-slate-800">
          {statsList.map((stat, idx) => {
            const Icon = stat.icon;
            const isLastOnMobile = idx === 4;
            return (
              <div
                key={idx}
                className={`p-3.5 sm:p-4 lg:p-0 rounded-2xl bg-slate-950/60 lg:bg-transparent border border-slate-800/80 lg:border-0 ${
                  idx > 0 ? "lg:pl-6" : ""
                } ${isLastOnMobile ? "col-span-2 md:col-span-1" : ""}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 text-brand-400">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
