import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { Calendar, ChevronRight, ArrowLeft, Tag, Share2, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seoTitle || `${post.title} | ${siteConfig.name}`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
    },
  };
}

export const revalidate = 60;

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Related articles in same category
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      id: { not: post.id },
      isPublished: true,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const tagsList = post.tags ? post.tags.split(",").map((t) => t.trim()) : [];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-slate-900 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link href="/blog" className="hover:text-slate-900 transition">
              Technical Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-sm">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Article Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.publishedAt)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
            {post.title}
          </h1>

          <p className="text-base text-slate-600 leading-relaxed italic border-l-4 border-brand-600 pl-4">
            {post.excerpt}
          </p>

          {post.coverImage && (
            <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-950 mt-6">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed whitespace-pre-line text-slate-800">
            {post.content}
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tags:
              </span>
              {tagsList.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
          <Link
            href="/quote"
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
          >
            Request Sourcing Quote
          </Link>
        </div>
      </article>
    </div>
  );
}
