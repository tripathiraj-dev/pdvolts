import React from "react";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import StatsCounter from "@/components/home/StatsCounter";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import IndustriesServed from "@/components/home/IndustriesServed";
import ManufacturingPreview from "@/components/home/ManufacturingPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LatestProducts from "@/components/home/LatestProducts";
import LatestBlog from "@/components/home/LatestBlog";
import HomeCTA from "@/components/home/HomeCTA";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [
    categories,
    products,
    industries,
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
      {/* 1. Hero Section (Video Carousel + 4 Sleek Category Cards) */}
      <Hero />

      {/* 2. Key Dynamic Statistics Counter */}
      <StatsCounter customStats={settingsMap} />

      {/* 3. Product Categories Showcase (With small pill badges) */}
      <CategoryShowcase categories={categories} />

      {/* 4. Why Choose Us (4 High-Impact Cards with Mini-Badges) */}
      <WhyChooseUs />

      {/* 5. Manufacturing & Certified Quality Protocols */}
      <ManufacturingPreview />

      {/* 6. Industries Served (Compact Industrial Sector Strip) */}
      <IndustriesServed industries={industries} />

      {/* 7. Featured Industrial Products */}
      <LatestProducts products={products as any} />

      {/* 8. Client Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. Technical News & Insights */}
      <LatestBlog posts={blogPosts} />

      {/* 10. Direct Project RFQ Call-to-Action */}
      <HomeCTA />
    </div>
  );
}

