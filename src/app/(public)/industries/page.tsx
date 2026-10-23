import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Zap, Car, Building2, Sun, Cpu, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries & Applications | Engineered Wire & Polymer Solutions",
  description:
    "Discover how PdVolts powers critical utilities, automotive harnesses, commercial buildings, solar farms, and OEM automation equipment.",
};

export const revalidate = 60;

export default async function IndustriesPage() {
  const industries = await prisma.industry.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  const iconMap: Record<string, React.ReactNode> = {
    Zap: <Zap className="w-6 h-6 text-brand-500" />,
    Car: <Car className="w-6 h-6 text-emerald-500" />,
    Building2: <Building2 className="w-6 h-6 text-blue-500" />,
    Sun: <Sun className="w-6 h-6 text-amber-500" />,
    Cpu: <Cpu className="w-6 h-6 text-purple-500" />,
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Engineered Verticals
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Industries Powered by PdVolts
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Delivering robust transmission conductors, heat-resistant automotive wires, and precision
            polymer enclosures tailored for the most demanding operating parameters.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {industries.map((ind, idx) => (
          <div
            key={ind.id}
            className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image (5 Cols) */}
            <div className={`lg:col-span-5 h-72 sm:h-80 w-full overflow-hidden bg-slate-950 ${idx % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
              {ind.imageUrl ? (
                <img
                  src={ind.imageUrl}
                  alt={ind.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <Zap className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Content (7 Cols) */}
            <div className={`lg:col-span-7 p-6 sm:p-10 space-y-4 ${idx % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                {ind.icon && iconMap[ind.icon] ? iconMap[ind.icon] : <Zap className="w-6 h-6 text-brand-500" />}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                {ind.title}
              </h2>

              <p className="text-sm font-semibold text-brand-700">
                {ind.summary}
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                {ind.description}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                >
                  View Certified Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/quote"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
                >
                  Request Application RFQ
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
