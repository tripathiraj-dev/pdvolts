import React from "react";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import StatsCounter from "@/components/home/StatsCounter";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import IndustriesServed from "@/components/home/IndustriesServed";
import QualityPreview from "@/components/home/QualityPreview";
import ManufacturingPreview from "@/components/home/ManufacturingPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LatestProducts from "@/components/home/LatestProducts";
import LatestBlog from "@/components/home/LatestBlog";
import HomeCTA from "@/components/home/HomeCTA";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [
    categories,
    products,
    industries,
    certifications,
    testimonials,
    blogPosts,
    siteSettings,
  ] = await Promise.all([
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { isFeatured: "desc" },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" }, take: 1 },
      },
    }),
    prisma.industry.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
    }),
    prisma.certification.findMany({
      where: { isFeatured: true },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.testimonial.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { order: "asc" },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  siteSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Dynamic Statistics Counter */}
      <StatsCounter customStats={settingsMap} />

      {/* 3. Company Introduction */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Corporate Overview
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                Engineering Integrity into Every Strand and Polymer
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Founded with a mission to eliminate dielectric compromise and insulation failure in
                high-demand industrial power circuits, {siteConfig.legalName} has grown into an
                internationally recognized manufacturer of industrial conductors, flexible wires, and
                precision injection-molded polymer components.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Vertically integrated copper drawing & continuous polymer extrusion",
                  "NABL/ISO 17025 accredited laboratory with 100% dielectric spark verification",
                  "Direct export shipments to over 45 countries with custom drum packaging",
                  "Custom compounding capability for specialized flame and oil ratings",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-brand-700 text-white font-bold text-sm shadow transition"
                >
                  Learn More About Our Company <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
                    alt="Wire Extrusion"
                    className="w-full h-56 object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 mt-6">
                  <img
                    src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80"
                    alt="Cable Testing Lab"
                    className="w-full h-56 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Categories Showcase */}
      <CategoryShowcase categories={categories} />

      {/* 5. Why Choose Us Grid */}
      <WhyChooseUs />

      {/* 6. Industries Served */}
      <IndustriesServed industries={industries} />

      {/* 7. Manufacturing & Infrastructure Preview */}
      <ManufacturingPreview />

      {/* 8. Quality, Testing & Accreditations Preview */}
      <QualityPreview certifications={certifications} />

      {/* 9. Latest Products Showcase */}
      <LatestProducts products={products as any} />

      {/* 10. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 11. Latest News & Insights */}
      <LatestBlog posts={blogPosts} />

      {/* 12. Final CTA */}
      <HomeCTA />
    </div>
  );
}
