import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import GalleryView from "@/components/shared/GalleryView";

export const metadata: Metadata = {
  title: "Media Gallery | Extrusion Bays, Testing Chambers & Facilities",
  description:
    "View high-resolution photography of PdVolts' manufacturing lines, high-voltage testing laboratories, precision injection molds, and export warehouse.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
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
            Visual Portfolio
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Industrial Media & Plant Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Take a visual tour inside our extrusion floors, polymer laboratories, and finished goods warehouse.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <GalleryView items={images} />
      </div>
    </div>
  );
}
