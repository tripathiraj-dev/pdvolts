import React from "react";
import Link from "next/link";
import { ArrowRight, Factory, Cog, Flame, ShieldAlert } from "lucide-react";

export default function ManufacturingPreview() {
  const highlights = [
    {
      icon: Factory,
      title: "120,000 Sq.Ft. Facility",
      desc: "Integrated heavy manufacturing plant featuring continuous rod breakdown, dual-line extruders, and automated drum winders.",
    },
    {
      icon: Cog,
      title: "Automated Line Controls",
      desc: "Siemens PLC automation with closed-loop laser gauge feedback maintaining jacket wall thickness accuracy within ±0.01mm.",
    },
    {
      icon: Flame,
      title: "Dedicated Polymer Compounding",
      desc: "Twin-screw compounding lines creating virgin PVC, high-oxygen index FR, and Low Smoke Zero Halogen (LSZH) pellets on-site.",
    },
    {
      icon: ShieldAlert,
      title: "Environmental & Zero-Waste",
      desc: "100% closed-circuit water cooling and internal polymer granulation lines recycling all clean scrap back into secondary protective ducting.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase (5 Cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300 group">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="PdVolts Wire Manufacturing Extrusion Facility"
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
                  Primary Extrusion Bay
                </span>
                <p className="text-sm font-semibold">
                  Tandem line applying dual-layer cross-linked insulation at 600m/minute
                </p>
              </div>
            </div>
          </div>

          {/* Details (7 Cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Infrastructure & Technological Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              World-Class Manufacturing Infrastructure
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We combine high-volume production output with aerospace-grade precision. By synthesizing
              our own polymer masterbatches and drawing copper in-house, we exercise absolute authority
              over material purity and thermal ratings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {highlights.map((h, idx) => {
                const Icon = h.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{h.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link
                href="/manufacturing"
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800 transition"
              >
                Tour Our Manufacturing Capabilities <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
