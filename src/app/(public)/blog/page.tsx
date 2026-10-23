import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, Tag, ArrowRight, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Manufacturing Insights & Technical Articles | PdVolts Engineering",
  description:
    "Explore engineering articles, cable insulation comparisons (XLPE vs PVC), low-smoke zero halogen fire safety standards, and polymer compounding breakthroughs.",
};

export const revalidate = 60;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const where: any = { isPublished: true };
  if (searchParams.category) {
    where.category = searchParams.category;
  }

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const uniqueCategories = Array.from(new Set(categories.map((c) => c.category)));

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Technical Knowledgebase
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Manufacturing Insights & Technical Articles
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Written by our materials scientists and electrical engineers on cable selection,
            fire standards, and polymer innovation.
          </p>
        </div>
      </section>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
              !searchParams.category
                ? "bg-slate-900 text-white shadow"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            All Insights ({posts.length})
          </Link>
          {uniqueCategories.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${encodeURIComponent(c)}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                searchParams.category === c
                  ? "bg-brand-700 text-white shadow"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {post.coverImage && (
                <div className="relative h-52 bg-slate-950 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 backdrop-blur text-white text-xs font-semibold">
                    {post.category}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition font-heading line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                  >
                    Read Technical Analysis <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
