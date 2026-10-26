"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Zap } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  sku: string | null;
  moq: string | null;
  voltageRating: string | null;
  category: { name: string };
  images: { url: string; altText: string | null }[];
}

interface LatestProductsProps {
  products: Product[];
}

const DEFAULT_PRODUCT_IMG = "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80";

export default function LatestProducts({ products }: LatestProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="space-y-1.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full inline-block">
              Featured Manufacturing Lines
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              Latest Industrial Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Engineered conductors, high-voltage feeds, and precision injection molded components available for immediate batch manufacturing and export.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition group shrink-0"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p) => {
            const primaryImg = p.images && p.images.length > 0 && p.images[0].url ? p.images[0].url : DEFAULT_PRODUCT_IMG;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Box */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={primaryImg}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PRODUCT_IMG;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-white text-[11px] font-bold border border-slate-700">
                    {p.category.name}
                  </span>

                  {p.sku && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-slate-300 text-[10px] font-mono">
                      {p.sku}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition font-heading line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-bold">
                      {p.voltageRating && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          <Zap className="w-3 h-3 text-amber-500" /> {p.voltageRating}
                        </span>
                      )}
                      {p.moq && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" /> MOQ: {p.moq}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-xs font-bold text-slate-800 hover:text-amber-600 inline-flex items-center gap-1"
                    >
                      Specifications <ArrowRight className="w-3 h-3" />
                    </Link>

                    <Link
                      href={`/quote?productId=${p.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold transition"
                    >
                      Quick RFQ
                    </Link>
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
