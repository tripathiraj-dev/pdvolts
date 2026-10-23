import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import QuoteForm from "@/components/shared/QuoteForm";
import { ShieldCheck, Clock, CheckCircle2, FileText, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Request a Quote (RFQ) | Industrial Wire & Plastic Sourcing",
  description:
    "Submit your Request for Quotation for bulk industrial cables, flexible wires, conduit pipes, and custom polymer compounding.",
};

export default async function QuotePage({
  searchParams,
}: {
  searchParams: { productId?: string };
}) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, sku: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Commercial Sourcing & Estimation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Request a Commercial Quotation (RFQ)
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Direct factory pricing, custom drum lengths, containerized export dispatch, and technical submittals.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* RFQ Form (8 Cols) */}
          <div className="lg:col-span-8">
            <QuoteForm
              products={products}
              preselectedProductId={searchParams.productId}
            />
          </div>

          {/* Sourcing Benefits (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
                Commercial RFQ Guarantees
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">24-Hour Turnaround</span>
                    <p className="text-slate-500 mt-0.5">
                      Formal estimates prepared by electrical & mechanical estimators within 1 business day.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Complete Submittal Packs</span>
                    <p className="text-slate-500 mt-0.5">
                      Mill test certificates, copper assay results, and ISO 9001 documentation included.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Custom Tooling & Cuts</span>
                    <p className="text-slate-500 mt-0.5">
                      Exact customer-specified drum lengths to eliminate job-site cutting scrap.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Phone Support */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Immediate Assistance
              </span>
              <h4 className="text-base font-bold font-heading">
                Prefer to Speak with a Project Specialist?
              </h4>
              <p className="text-xs text-slate-300">
                For urgent tender deadlines or major grid infrastructure procurements:
              </p>
              <div className="pt-1 flex items-center gap-2 text-brand-300 font-bold text-sm">
                <Phone className="w-4 h-4" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
