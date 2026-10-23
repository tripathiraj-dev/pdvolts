import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Download, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Quote Requests | Client Dashboard",
};

export default async function UserQuotesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login?callbackUrl=/dashboard/quotes");

  const quotes = await prisma.quoteRequest.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
    QUOTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CONVERTED: "bg-teal-50 text-teal-700 border-teal-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            My Requests for Quotation (RFQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review status updates, factory pricing submittals, and engineering notes on your inquiries.
          </p>
        </div>
        <Link
          href="/quote"
          className="px-5 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow transition text-center"
        >
          Submit New RFQ
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">No Quotations Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not submitted any RFQs under this account yet.
          </p>
          <Link
            href="/quote"
            className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
          >
            Request Quotation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-brand-700">
                    RFQ #{q.id.slice(-6).toUpperCase()}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      statusColorMap[q.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(q.createdAt)}</span>
              </div>

              {/* Product & Volume Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Product Scope</span>
                  <span className="font-bold text-slate-900">
                    {q.product ? q.product.name : "Custom Cable / Compounding Formulation"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Requested Volume</span>
                  <span className="font-bold text-slate-900">{q.quantity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Delivery Destination</span>
                  <span className="font-bold text-slate-900">{q.country || "Not specified"}</span>
                </div>
              </div>

              {/* Requirements & Notes */}
              {q.requirements && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Technical Requirements:</span>
                  <p className="leading-relaxed">{q.requirements}</p>
                </div>
              )}

              {/* Factory Commercial Notes */}
              {q.notes && q.notes.length > 0 && (
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <MessageSquare className="w-4 h-4 text-emerald-700" />
                    <span>PdVolts Commercial Estimator Note:</span>
                  </div>
                  {q.notes.map((note) => (
                    <div key={note.id} className="border-t border-emerald-200/60 pt-1.5">
                      <p className="leading-relaxed">{note.content}</p>
                      <span className="text-[10px] text-emerald-700 block mt-1">
                        By {note.authorName} &bull; {formatDate(note.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {q.attachmentUrl && (
                <div className="pt-2">
                  <a
                    href={q.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" /> View Uploaded Drawing Attachment
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
