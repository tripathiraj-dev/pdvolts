import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  FileText,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Client Dashboard | Overview",
};

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [quotes, enquiries, savedProducts] = await Promise.all([
    prisma.quoteRequest.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: true },
    }),
    prisma.enquiry.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.savedProduct.findMany({
      where: { userId: session.id },
      take: 4,
      include: {
        product: {
          include: { category: true, images: { take: 1 } },
        },
      },
    }),
  ]);

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
    QUOTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CONVERTED: "bg-teal-50 text-teal-700 border-teal-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Corporate Client Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Welcome back, {session.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track your industrial Requests for Quotation (RFQ), communicate with factory estimators,
            and manage saved manufacturing specifications.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900">{quotes.length}</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Quote Requests</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900">{enquiries.length}</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Submitted Inquiries</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold font-heading text-slate-900">{savedProducts.length}</span>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Saved Products</p>
          </div>
        </div>
      </div>

      {/* Recent RFQ Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" /> Recent Quotation Requests (RFQ)
          </h2>
          <Link
            href="/dashboard/quotes"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No quote requests submitted yet.{" "}
            <Link href="/quote" className="text-brand-700 font-bold underline">
              Create your first RFQ
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="py-2.5 px-3">RFQ Ref</th>
                  <th className="py-2.5 px-3">Product / Scope</th>
                  <th className="py-2.5 px-3">Volume</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-brand-700">
                      #{q.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {q.product ? q.product.name : "Custom Compound / Spec"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{q.quantity}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          statusColorMap[q.status] || "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDate(q.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Contact Inquiries */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" /> Recent Technical Inquiries
          </h2>
          <Link
            href="/dashboard/enquiries"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {enquiries.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No contact messages sent yet.{" "}
            <Link href="/contact" className="text-brand-700 font-bold underline">
              Reach out to our team
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{enq.subject}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{enq.message}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      statusColorMap[enq.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-[11px] text-slate-400">{formatDate(enq.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
