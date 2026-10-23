import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShieldCheck, FileCheck, CheckCircle2, Download, ArrowRight, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Quality & Certifications | ISO 9001, CE, RoHS & Test Protocols",
  description:
    "Explore PdVolts' international accreditations, laboratory testing protocols, and download formal ISO and CE compliance certificates.",
};

export const revalidate = 60;

export default async function QualityPage() {
  const certifications = await prisma.certification.findMany({
    orderBy: { createdAt: "desc" },
  });

  const testSteps = [
    {
      step: "01",
      title: "Raw Material Metallurgical Assay",
      desc: "Every batch of continuous cast copper rod undergoes optical emission spectrometry verifying minimum 99.97% electrical conductivity purity.",
    },
    {
      step: "02",
      title: "In-Process Automated Laser Micrometry",
      desc: "Dual-axis non-contact laser diameter monitors measure insulation thickness, concentricity, and outer diameter 1,000 times per second during extrusion.",
    },
    {
      step: "03",
      title: "100% In-Line High Potential Spark Test",
      desc: "Every single millimeter of insulated wire passes through high-voltage spark electrode beads to verify dielectric integrity with zero pinhole defects.",
    },
    {
      step: "04",
      title: "Finished Drum Electrical & Mechanical Lot Release",
      desc: "Kelvin bridge conductor resistance measurements, thermal heat shock, oxygen index flammability, and water tank submersion tests prior to release.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Header */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Certified Quality Assurance
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Quality Assurance & Testing Standards
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Our uncompromising testing protocols and international accreditations guarantee that
            every PdVolts cable and component performs flawlessly under real-world industrial stress.
          </p>
        </div>
      </section>

      {/* Main Certifications Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16">
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Audited & Accredited
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              International Certifications
            </h2>
            <p className="text-sm text-slate-600">
              Valid certifications from world-renowned testing and notified bodies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                      {cert.issuingBody}
                    </span>
                    {cert.validUntil && (
                      <span className="text-xs text-slate-400">
                        Valid: {cert.validUntil}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-heading">{cert.title}</h3>

                  {cert.certificateNumber && (
                    <p className="text-xs font-mono text-slate-500">
                      Accreditation Ref: {cert.certificateNumber}
                    </p>
                  )}

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {cert.description || "Validated conforming to international manufacturing quality metrics."}
                  </p>
                </div>

                {cert.fileUrl && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-800"
                    >
                      <Download className="w-4 h-4" /> Download Certificate PDF
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4-Stage Testing Regimen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Rigorous Regimen
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Our 4-Stage Laboratory Testing Protocol
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl">
              From microscopic copper crystallographic grain structure to long-term accelerated weathering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testSteps.map((s, i) => (
              <div key={i} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl font-extrabold text-brand-600 font-heading">{s.step}</span>
                <h4 className="text-base font-bold text-slate-900 font-heading">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
