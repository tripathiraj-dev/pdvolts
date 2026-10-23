import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductCatalogView from "@/components/products/ProductCatalogView";

export const metadata: Metadata = {
  title: "Industrial Products Catalog | Wires, Cables & Polymer Formulations",
  description:
    "Explore PdVolts' catalog of armored XLPE power cables, flexible building wires, PVC conduit systems, and precision injection molded components.",
};

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { isFeatured: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Manufacturing Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Industrial Wires, Cables & Polymer Products
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Browse our full spectrum of heavy utility power cables, flame-retardant panel conductors,
            and precision molded components.
          </p>
        </div>
      </section>

      {/* Main Catalog View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <ProductCatalogView
          products={products as any}
          categories={categories}
          initialCategory={searchParams.category}
        />
      </div>
    </div>
  );
}
