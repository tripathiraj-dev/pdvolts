import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CareersListView from "@/components/shared/CareersListView";

export const metadata: Metadata = {
  title: "Careers & Open Positions | Polymer Science & Extrusion Engineering",
  description:
    "Join the manufacturing and materials engineering team at PdVolts. Explore opportunities in polymer process engineering, quality lab inspection, and technical sales.",
};

export const revalidate = 60;

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Talent & Careers
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Build the Future of Industrial Infrastructure
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Grow your engineering, manufacturing, or commercial sales career with an established global
            manufacturer of precision wire, cable, and polymer products.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <CareersListView careers={careers} />
      </div>
    </div>
  );
}
