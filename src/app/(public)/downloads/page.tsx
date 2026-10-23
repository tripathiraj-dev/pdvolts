import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DownloadList from "@/components/shared/DownloadList";

export const metadata: Metadata = {
  title: "Download Center | Product Catalogues, Engineering Tables & Datasheets",
  description:
    "Download official 2026 PdVolts product directories, conductor ampacity lookup charts, and polymer chemical compatibility matrices.",
};

export const revalidate = 60;

export default async function DownloadsPage() {
  const downloads = await prisma.download.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Technical Resource Center
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Download Catalogues & Engineering Documents
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Access high-resolution product catalogues, wire ampacity lookup charts, and material safety data sheets (MSDS).
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <DownloadList initialItems={downloads} />
      </div>
    </div>
  );
}
