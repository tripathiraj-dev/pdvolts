import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Package,
  FileText,
  MessageSquare,
  Users,
  BookOpen,
  Briefcase,
  Star,
  Award,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard | Management Cockpit",
};

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboardOverview() {
  const [
    totalProducts,
    totalQuotes,
    totalEnquiries,
    totalUsers,
    totalBlogs,
    totalApplications,
    totalTestimonials,
    totalCertifications,
    recentQuotes,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.quoteRequest.count(),
    prisma.enquiry.count(),
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.jobApplication.count(),
    prisma.testimonial.count(),
    prisma.certification.count(),
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: true },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const kpis = [
    { label: "Total Products", count: totalProducts, href: "/admin/products", icon: Package, color: "text-blue-400 bg-blue-950/60 border-blue-800" },
    { label: "Quote Requests (RFQ)", count: totalQuotes, href: "/admin/quotes", icon: FileText, color: "text-amber-400 bg-amber-950/60 border-amber-800" },
    { label: "Contact Inquiries", count: totalEnquiries, href: "/admin/enquiries", icon: MessageSquare, color: "text-emerald-400 bg-emerald-950/60 border-emerald-800" },
    { label: "Registered Users", count: totalUsers, href: "/admin/users", icon: Users, color: "text-purple-400 bg-purple-950/60 border-purple-800" },
    { label: "Technical Articles", count: totalBlogs, href: "/admin/blog", icon: BookOpen, color: "text-cyan-400 bg-cyan-950/60 border-cyan-800" },
    { label: "Job Applications", count: totalApplications, href: "/admin/careers", icon: Briefcase, color: "text-rose-400 bg-rose-950/60 border-rose-800" },
  ];

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-950 text-blue-400 border-blue-800",
    CONTACTED: "bg-amber-950 text-amber-400 border-amber-800",
    IN_PROGRESS: "bg-purple-950 text-purple-400 border-purple-800",
    QUOTED: "bg-emerald-950 text-emerald-400 border-emerald-800",
    CONVERTED: "bg-teal-950 text-teal-400 border-teal-800",
    CLOSED: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            Executive Manufacturing Cockpit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on customer RFQs, active product formulations, and site inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Plus className="w-4 h-4" /> Write Article
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((k, idx) => {
          const Icon = k.icon;
          return (
            <Link
              key={idx}
              href={k.href}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 group flex items-start justify-between"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {k.label}
                </span>
                <div className="text-3xl font-extrabold font-heading text-white">{k.count}</div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 group-hover:translate-x-0.5 transition">
                  <span>Manage Records</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <div className={`p-3 rounded-xl border ${k.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-Column Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quote Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Incoming RFQs & Commercial Inquiries
            </h2>
            <Link
              href="/admin/quotes"
              className="text-xs font-bold text-brand-400 hover:underline"
            >
              View Pipeline &rarr;
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No RFQs recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{q.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({q.company})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {q.product ? q.product.name : "Custom Compound"} &bull; {q.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        statusColorMap[q.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {q.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(q.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Recent Contact Messages
            </h2>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-brand-400 hover:underline"
            >
              Manage Inquiries &rarr;
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No inquiries submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{enq.name}</span>
                      <span className="text-[10px] text-slate-500">({enq.email})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{enq.subject}</p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        statusColorMap[enq.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(enq.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
