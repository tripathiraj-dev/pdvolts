import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import FaqAccordion from "@/components/shared/FaqAccordion";
import Link from "next/link";
import { HelpCircle, Mail, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Orders, Technical & Standards",
  description:
    "Find answers to common questions about PdVolts' manufacturing lead times, export packing, minimum order quantities (MOQ), and type testing certificates.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Support & Knowledge
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know regarding technical standards, batch test reports, custom compounding, and export logistics.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        <FaqAccordion faqs={faqs} />

        {/* Still have questions banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Still Have Technical or Procurement Questions?
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Our materials science specialists and sales engineers are available to review your project schedule.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow transition"
            >
              Contact Engineering
            </Link>
            <Link
              href="/quote"
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
            >
              Request Custom RFQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
