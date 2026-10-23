import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MessageSquare, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Inquiries | Client Dashboard",
};

export default async function UserEnquiriesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login?callbackUrl=/dashboard/enquiries");

  const enquiries = await prisma.enquiry.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
    IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-200",
    CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
            My Inquiries & Messages
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review communication history and engineering responses from our technical team.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow transition text-center"
        >
          Send New Message
        </Link>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 font-heading">No Inquiries Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven&apos;t sent any contact messages from this account.
          </p>
          <Link
            href="/contact"
            className="inline-block px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
          >
            Contact Engineering Team
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-900 font-heading">{enq.subject}</h3>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      statusColorMap[enq.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(enq.createdAt)}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {enq.message}
              </div>

              {/* Staff Notes / Replies */}
              {enq.notes && enq.notes.length > 0 && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <MessageCircle className="w-4 h-4 text-blue-700" />
                    <span>PdVolts Client Services Note:</span>
                  </div>
                  {enq.notes.map((note) => (
                    <div key={note.id} className="border-t border-blue-200/60 pt-1.5">
                      <p className="leading-relaxed">{note.content}</p>
                      <span className="text-[10px] text-blue-700 block mt-1">
                        By {note.authorName} &bull; {formatDate(note.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
