import React from "react";
import {
  ShieldCheck,
  Cpu,
  TrendingDown,
  Wrench,
  Truck,
  CheckCircle2,
  HeadphonesIcon,
  Smile,
} from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Uncompromising Quality",
      description: "Virgin electrolytic copper (99.97% purity) and high-density polymer compounds inspected under ASTM & IEC standards.",
    },
    {
      icon: Cpu,
      title: "Advanced Tandem Extrusion",
      description: "State-of-the-art dual-head extruders with automated optical laser feedback keeping diameter tolerances to ±0.01mm.",
    },
    {
      icon: TrendingDown,
      title: "Competitive OEM Pricing",
      description: "Vertically integrated copper drawing and polymer compounding eliminating middleman markups for project estimators.",
    },
    {
      icon: Wrench,
      title: "Tailored Custom Engineering",
      description: "Custom conductor strandings, oil-resistant jackets, flame-retardant masterbatch coloration, and proprietary mold tooling.",
    },
    {
      icon: Truck,
      title: "Rapid Global Dispatch",
      description: "Comprehensive finished goods warehouse inventory and sea-worthy export pallet packaging dispatched within 48 to 72 hours.",
    },
    {
      icon: CheckCircle2,
      title: "In-House Certified Lab",
      description: "Every drum passes 100% in-line spark testing, Kelvin micro-ohm resistance tests, and complete mechanical elongation checks.",
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Technical Support",
      description: "Direct consultation with qualified materials science and electrical engineers for sizing calculations and submittals.",
    },
    {
      icon: Smile,
      title: "Trusted Customer Loyalty",
      description: "Over 1,450 long-term EPC contractors, power utilities, and industrial OEMs relying on PdVolts infrastructure across 45 nations.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Manufacturing Superiority
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Why Industry Leaders Choose PdVolts
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Decades of technical mastery combined with heavy capital investments in robotic extrusion lines,
            delivering uncompromised electrical safety and mechanical endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-50 hover:bg-brand-50/50 border border-slate-200 hover:border-brand-200 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-100 group-hover:bg-brand-600 text-brand-700 group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
