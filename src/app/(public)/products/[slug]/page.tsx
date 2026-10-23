import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  Package,
  ShieldCheck,
  Zap,
  Download,
  FileText,
  Mail,
  ChevronRight,
  CheckCircle2,
  Share2,
  Tag,
  ArrowRight,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.seoTitle || `${product.name} | ${siteConfig.name}`,
    description: product.seoDescription || product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      type: "website",
    },
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      specifications: { orderBy: { order: "asc" } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products in same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 3,
    include: {
      category: true,
      images: { take: 1 },
    },
  });

  // Schema.org Product JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku || undefined,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
  };

  const primaryImage =
    product.images.length > 0
      ? product.images[0].url
      : "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/products" className="hover:text-slate-900 transition">
              Products
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-slate-900 transition"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Main Overview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Product Images Gallery (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-96 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isFeatured && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs uppercase shadow">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <div
                      key={img.id}
                      className="relative h-20 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer"
                    >
                      <img src={img.url} alt={img.altText || ""} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Quality & Assurance Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 block">Factory Batch Certified</span>
                  <p>Accompanied by Routine Test Report (RTR) and Type Test Certificates upon dispatch.</p>
                </div>
              </div>
            </div>

            {/* Right: Product Key Info & CTA (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                    {product.category.name}
                  </span>
                  {product.sku && (
                    <span className="text-xs font-mono text-slate-400">SKU: {product.sku}</span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading">
                  {product.name}
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  {product.shortDescription}
                </p>
              </div>

              {/* Key Technical Highlights Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {product.voltageRating && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Voltage Rating</span>
                    <span className="font-bold text-slate-900">{product.voltageRating}</span>
                  </div>
                )}
                {product.material && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Core Material</span>
                    <span className="font-bold text-slate-900 line-clamp-1">{product.material}</span>
                  </div>
                )}
                {product.moq && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Minimum Order (MOQ)</span>
                    <span className="font-bold text-slate-900">{product.moq}</span>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Dimensions / Size</span>
                    <span className="font-bold text-slate-900">{product.size}</span>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Color Standard</span>
                    <span className="font-bold text-slate-900">{product.color}</span>
                  </div>
                )}
                {product.packaging && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Packaging Type</span>
                    <span className="font-bold text-slate-900">{product.packaging}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href={`/quote?productId=${product.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md transition transform active:scale-98"
                >
                  <FileText className="w-4 h-4" /> Request Commercial Quote (RFQ)
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition"
                >
                  <Mail className="w-4 h-4 text-brand-600" /> Contact Engineer
                </Link>

                {product.datasheetUrl && (
                  <a
                    href={product.datasheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition"
                  >
                    <Download className="w-4 h-4" /> PDF Datasheet
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Detailed Engineering Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Detailed Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
                Product Description & Technical Characteristics
              </h2>
              <div className="prose prose-slate text-sm text-slate-700 leading-relaxed max-w-none whitespace-pre-line">
                {product.fullDescription}
              </div>
            </div>

            {/* Specifications Table */}
            {product.specifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
                  Technical Specifications Table
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 text-xs font-semibold uppercase">
                        <th className="py-3 px-4">Parameter</th>
                        <th className="py-3 px-4">Standard / Value</th>
                        <th className="py-3 px-4">Unit / Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {product.specifications.map((spec) => (
                        <tr key={spec.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-semibold text-slate-900">{spec.key}</td>
                          <td className="py-3 px-4 text-slate-700">{spec.value}</td>
                          <td className="py-3 px-4 text-slate-400 text-xs font-mono">{spec.unit || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Applications & Deployment Verticals */}
            {product.application && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-slate-900 font-heading border-b border-slate-200 pb-3">
                  Recommended Industrial Applications
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {product.application}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar & Related Products (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct RFQ Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-bold font-heading">Need Custom Quantities or Tooling?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We manufacture to order for large infrastructure projects, custom lengths, and customized
                packaging configurations.
              </p>
              <Link
                href={`/quote?productId=${product.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow transition"
              >
                Configure RFQ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Related Products in Category */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
                  Related Products
                </h3>
                <div className="space-y-4">
                  {relatedProducts.map((rel) => {
                    const img = rel.images && rel.images.length > 0 ? rel.images[0].url : null;
                    return (
                      <Link
                        key={rel.id}
                        href={`/products/${rel.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-200">
                          {img ? (
                            <img src={img} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition line-clamp-1">
                            {rel.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {rel.shortDescription}
                          </span>
                          <span className="text-[10px] font-bold text-brand-700 mt-1 inline-flex items-center gap-0.5">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
