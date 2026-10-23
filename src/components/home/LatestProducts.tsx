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

export default function LatestProducts({ products }: LatestProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Featured Manufacturing Lines
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Latest Industrial Products
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Engineered conductors, specialty high-voltage feeds, and precision injection molded
              components available for immediate batch manufacturing and export.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800 transition"
          >
            Explore Complete Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((p) => {
            const primaryImg = p.images && p.images.length > 0 ? p.images[0].url : null;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Box */}
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  {primaryImg ? (
                    <img
                      src={primaryImg}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                      <Package className="w-12 h-12" />
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-brand-900/90 backdrop-blur text-brand-200 text-xs font-bold border border-brand-700/60">
                    {p.category.name}
                  </span>

                  {p.sku && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-slate-300 text-[11px] font-mono">
                      {p.sku}
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition font-heading line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Quick Specs Badges */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium">
                      {p.voltageRating && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                          <Zap className="w-3 h-3 text-amber-500" /> {p.voltageRating}
                        </span>
                      )}
                      {p.moq && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" /> MOQ: {p.moq}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/products/${p.slug}`}
                      className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                    >
                      Specifications <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/quote?productId=${p.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-700 text-white text-xs font-semibold transition"
                    >
                      Get RFQ
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
