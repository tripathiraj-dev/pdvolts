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
    <section className="bg-slate-900 text-white py-14 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {statsList.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className={`pt-4 lg:pt-0 ${idx > 0 ? "lg:pl-6" : ""}`}>
                <div className="flex items-center gap-2 mb-2 text-brand-400">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
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
