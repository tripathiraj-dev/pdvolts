"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Package,
  Zap,
  ShieldCheck,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  categoryId: string;
  category: { name: string; slug: string };
  sku: string | null;
  moq: string | null;
  material: string | null;
  voltageRating: string | null;
  isFeatured: boolean;
  images: { url: string; altText: string | null }[];
}

interface ProductCatalogViewProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

const DEFAULT_CATALOG_IMG = "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80";

export default function ProductCatalogView({
  products,
  categories,
  initialCategory,
}: ProductCatalogViewProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory !== "all" && p.category.slug !== selectedCategory) {
        return false;
      }

      // Featured filter
      if (featuredOnly && !p.isFeatured) {
        return false;
      }

      // Search match
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.shortDescription.toLowerCase().includes(query);
        const matchesSku = p.sku ? p.sku.toLowerCase().includes(query) : false;
        const matchesMat = p.material ? p.material.toLowerCase().includes(query) : false;
        return matchesName || matchesDesc || matchesSku || matchesMat;
      }

      return true;
    });
  }, [products, selectedCategory, featuredOnly, search]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, conductor type, voltage or SKU..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Featured Toggle Button */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold border transition flex items-center gap-2 ${
                featuredOnly
                  ? "bg-brand-50 border-brand-500 text-brand-700"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {featuredOnly && <Check className="w-3.5 h-3.5" />}
              Featured Wires & Polymers
            </button>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category.slug === c.slug).length;
            const isSelected = selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? "bg-brand-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Catalog Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            No Manufacturing Products Match Your Filter
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try modifying your search criteria or reset category filters to view our standard product lines.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setFeaturedOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const primaryImg = p.images && p.images.length > 0 ? p.images[0].url : null;
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Visual Image Header */}
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  <img
                    src={primaryImg || DEFAULT_CATALOG_IMG}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_CATALOG_IMG;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-900/90 backdrop-blur text-white text-xs font-semibold">
                    {p.category.name}
                  </span>

                  {p.isFeatured && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold text-[10px] uppercase">
                      Featured
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {p.sku || "SKU: PENDING"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition font-heading line-clamp-1">
                      <Link href={`/products/${p.slug}`}>{p.name}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {p.shortDescription}
                    </p>

                    {/* Metadata tags */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                      {p.voltageRating && (
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500" /> {p.voltageRating}
                        </span>
                      )}
                      {p.moq && (
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium inline-flex items-center gap-1">
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
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-brand-700 text-white text-xs font-semibold transition shadow"
                    >
                      Request RFQ
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
