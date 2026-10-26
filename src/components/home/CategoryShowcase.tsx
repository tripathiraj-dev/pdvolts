"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
}

interface CategoryShowcaseProps {
  categories: Category[];
}

const CATEGORY_PILLS: Record<string, string[]> = {
  "industrial-power-cables": ["Armored XLPE", "1.1kV - 33kV", "IS 7098", "Underground"],
  "building-flexible-wires": ["99.97% Pure Cu", "Flame Retardant", "Class 5 Flex", "IS 694"],
  "control-instrumentation-cables": ["Overall Screened", "Twisted Pairs", "Flame Retardant", "PLC Ready"],
  "plastic-polymer-components": ["Precision Molding", "UL94 V-0 Rated", "High Dielectric"],
  "custom-extrusions-conduits": ["Rigid uPVC Conduits", "Impact Resistant", "Weatherproof"],
};

const DEFAULT_CATEGORY_FALLBACK = "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80";

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full inline-block">
              Manufacturing Spectrum
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Industrial Product Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Engineered conductors, high-temperature polymers, and rigid uPVC conduits manufactured to global standards.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 group shrink-0"
          >
            <span>View Complete Product Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const pills = CATEGORY_PILLS[cat.slug] || ["Industrial Grade", "Custom Sizing", "100% Tested"];
            const imageSrc = cat.image || DEFAULT_CATEGORY_FALLBACK;

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Category Image Header */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_CATEGORY_FALLBACK;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  {cat._count && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-white text-[11px] font-bold border border-slate-700">
                      {cat._count.products} Products
                    </span>
                  )}
                </div>

                {/* Category Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition font-heading">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description || "Precision engineered industrial components and wiring."}
                    </p>

                    {/* Small crisp pills like in nav */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {pills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700 border-t border-slate-100">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

