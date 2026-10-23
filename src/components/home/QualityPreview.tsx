import React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, FileCheck, ArrowRight } from "lucide-react";

interface Certification {
  id: string;
  title: string;
  issuingBody: string;
  certificateNumber: string | null;
  validUntil: string | null;
  description: string | null;
}

interface QualityPreviewProps {
  certifications: Certification[];
}

export default function QualityPreview({ certifications }: QualityPreviewProps) {
  const testingProtocols = [
    {
      title: "100% In-Line Spark Testing",
      desc: "Up to 15 kV high-potential spark tester detecting micro-pinholes during high-speed extrusion.",
    },
    {
      title: "Conductor Resistance Analysis",
      desc: "Micro-ohmmeter Kelvin bridge verifying 99.97% pure copper conductivity conforming to IEC 60228.",
    },
    {
      title: "Tensile & Elongation Testing",
      desc: "Automated universal tensile test benches verifying polymer jacket elasticity before and after thermal aging.",
    },
    {
      title: "Flammability & Oxygen Index",
      desc: "ASTM D 2863 oxygen index chamber verifying flame retardance (LOI > 29%) and zero toxic halogen emissions.",
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Quality Philosophy & Protocols */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Quality Assurance & Laboratory Protocols
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Tested to Extremes. Certified for Life.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Every meter of wire and every polymer formulation exiting our facilities adheres to an
              unforgiving quality control regimen. Our accredited in-house testing lab guarantees complete
              traceability from raw ingot to dispatch drum.
            </p>

            <div className="space-y-4 pt-2">
              {testingProtocols.map((t, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/quality"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
              >
                Explore Laboratory Testing Protocols <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Key Accreditations Card Grid */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-brand-600" />
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    International Accreditations
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Audit Validated
                </span>
              </div>

              <div className="space-y-3">
                {certifications.slice(0, 4).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-500">{cert.issuingBody}</p>
                      {cert.certificateNumber && (
                        <p className="text-[11px] font-mono text-slate-400">
                          Ref: {cert.certificateNumber}
                        </p>
                      )}
                    </div>
                    <FileCheck className="w-5 h-5 text-brand-500 shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/downloads"
                  className="text-xs font-bold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
                >
                  Download Formal ISO & CE PDF Certificates <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
