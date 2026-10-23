import React from "react";
import Link from "next/link";
import { Zap, Car, Building2, Sun, Cpu, ArrowRight } from "lucide-react";

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
  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-5 h-5 text-brand-400" />,
    Car: <Car className="w-5 h-5 text-emerald-400" />,
    Building2: <Building2 className="w-5 h-5 text-blue-400" />,
    Sun: <Sun className="w-5 h-5 text-amber-400" />,
    Cpu: <Cpu className="w-5 h-5 text-purple-400" />,
  };

  return (
    <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
              Versatile Mission-Critical Applications
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Industries Powered by PdVolts
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl">
              Engineered conductors and polymer components tailored for the unique stresses of
              heavy industry, renewable utilities, and high-performance vehicles.
            </p>
          </div>

          <Link
            href="/industries"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-400 hover:text-brand-300 transition"
          >
            Explore All Industry Sectors <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <div
              key={ind.id}
              className="relative rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700/80 hover:border-brand-500/80 p-6 flex flex-col justify-between group transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                  {ind.icon && iconMap[ind.icon] ? iconMap[ind.icon] : <Zap className="w-5 h-5 text-brand-400" />}
                </div>

                <h3 className="text-xl font-bold text-white font-heading group-hover:text-brand-400 transition">
                  {ind.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {ind.summary}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-brand-400">
                <span>View Engineered Solutions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
