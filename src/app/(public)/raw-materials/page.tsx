import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  Zap,
  ArrowRight,
  Sparkles,
  Download,
  Building2,
  BadgeCheck,
  Scale,
  Microscope,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Industrial Raw Materials | Electrolytic Copper, Aluminum, PVC & XLPE | PDVolts",
  description:
    "Source certified industrial raw materials: 99.99% ETP Copper Rods, EC Grade Aluminum, Flame Retardant PVC Compounds, and Silane XLPE Polymers from PDVolts.",
};

export const revalidate = 60;

export default function RawMaterialsPage() {
  const materials = [
    {
      id: "copper-rods",
      name: "Electrolytic Copper Rods (ETP & OFC)",
      category: "Conductor Metallurgy",
      purity: "99.99% Cu Minimum",
      standard: "ASTM B49 / IS 12444",
      conductivity: "101.5% IACS (min 100%)",
      specs: [
        { label: "Available Diameters", value: "8.0 mm, 12.5 mm continuous cast coils" },
        { label: "Tensile Strength", value: "220 - 250 N/mm² (Soft Annealed)" },
        { label: "Elongation at Break", value: "Min 35% - 40%" },
        { label: "Oxygen Content", value: "OFC: < 5 ppm | ETP: 150 - 300 ppm" },
        { label: "Packaging", value: "1.5 MT - 3.0 MT strapped continuous coils" },
      ],
      description:
        "High-purity electrolytic tough-pitch (ETP) and oxygen-free high-conductivity (OFHC) continuous cast copper rods, manufactured directly from LME Grade-A copper cathodes.",
      icon: Zap,
      accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500",
    },
    {
      id: "ec-aluminum",
      name: "EC Grade Aluminum Rods",
      category: "Lightweight High-Conductivity Conductor",
      purity: "99.70% Al Minimum",
      standard: "IS 5484 / ASTM B233 / EC Grade 1370",
      conductivity: "61.8% IACS",
      specs: [
        { label: "Available Diameters", value: "7.6 mm, 9.5 mm continuous drawn rods" },
        { label: "Tensile Strength", value: "110 - 145 MPa (H12 / H14 tempers)" },
        { label: "Electrical Resistivity", value: "0.028264 Ω·mm²/m at 20°C" },
        { label: "Elongation at Break", value: "Min 14% - 18%" },
        { label: "Packaging", value: "1.0 MT - 2.0 MT steel strapped coils" },
      ],
      description:
        "Continuously cast and rolled Electrical Conductor (EC) aluminum wire rods engineered for high mechanical ductility, power transmission conductors (AAC, ACSR, AAAC), and XLPE insulated aerial cables.",
      icon: Scale,
      accentColor: "from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400",
    },
    {
      id: "pvc-compounds",
      name: "Specialized PVC Cable Compounds",
      category: "Polymer Insulation & Sheathing",
      purity: "Virgin Grade Resins (Lead-Free / RoHS)",
      standard: "IS 5831 / BS 7655 / IEC 60502-1",
      conductivity: "Volume Resistivity: > 10¹³ Ω·cm",
      specs: [
        { label: "Available Grades", value: "Type A (70°C), Type C (HR 85°C), FR & FRLS" },
        { label: "Oxygen Index", value: "FR: > 29% | FRLS: > 32% (ASTM D2863)" },
        { label: "Acid Gas Evolution", value: "< 20% by weight (FRLS grade)" },
        { label: "Shore A Hardness", value: "75 - 90 Shore A (customizable)" },
        { label: "Packaging", value: "25 kg bags / 1000 kg moisture-proof jumbo bags" },
      ],
      description:
        "Formulated with virgin suspension-grade PVC resin, high-flashpoint plasticizers, and synergistic antimony trioxide fire retardants. Excellent thermal stability and extrusion processing.",
      icon: Layers,
      accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      id: "xlpe-resins",
      name: "Silane & Peroxide Cross-Linked Polyethylene (XLPE)",
      category: "High-Dielectric Insulation",
      purity: "Virgin Cross-Linkable Polymers",
      standard: "IEC 60502 / IS 7098 / ASTM D1248",
      conductivity: "Dielectric Strength: > 22 kV/mm",
      specs: [
        { label: "Operating Temperature", value: "90°C continuous, 250°C short circuit" },
        { label: "Hot Set Elongation", value: "< 100% under 20 N/cm² at 200°C" },
        { label: "Gel Content", value: "Min 65% - 75% after curing" },
        { label: "Moisture Sensitivity", value: "Silane Sioplas two-component system" },
        { label: "Packaging", value: "25 kg aluminum-foil barrier bags" },
      ],
      description:
        "High-performance cross-linkable polyethylene compound offering superior dielectric strength, zero moisture absorption, and outstanding mechanical toughness for medium and low-voltage cable insulation.",
      icon: Sparkles,
      accentColor: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
    },
    {
      id: "masterbatches",
      name: "Engineering Polymers & Color Masterbatches",
      category: "Custom Additives & Granules",
      purity: "High-Pigment Dispersion (RoHS Compliant)",
      standard: "ISO 9001:2015 / REACH Compliant",
      conductivity: "UV-Stabilized Carbon Black & Vibrant Tints",
      specs: [
        { label: "Carrier Resins", value: "PE, EVA, Universal Polymer Carriers" },
        { label: "Pigment Loading", value: "30% - 50% high tinting strength" },
        { label: "Thermal Stability", value: "Stable up to 260°C without discoloration" },
        { label: "Shades Available", value: "Red, Black, Blue, Yellow, Green, White, Grey" },
        { label: "Packaging", value: "25 kg double-walled moisture-proof bags" },
      ],
      description:
        "Ultra-fine dispersed color masterbatches and UV-stabilizer masterbatches designed specifically for high-speed cable sheathing lines without filament clogging or pigment streaking.",
      icon: Microscope,
      accentColor: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
    },
  ];

  const satStats = [
    { label: "Pure Copper Purity", value: "99.99%", desc: "LME Grade A ETP Cathodes" },
    { label: "Annual Polymer Output", value: "25,000 MT", desc: "Virgin PVC & XLPE Compounds" },
    { label: "Spark Test Compliance", value: "100%", desc: "In-line 15kV electrode pass" },
    { label: "Standard Accreditations", value: "ASTM / IS", desc: "Tested per IEC 60502 & IS 5831" },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold uppercase tracking-widest">
            <BadgeCheck className="w-4 h-4 text-brand-400" />
            Certified Raw Materials Sourcing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Industrial Raw Materials & Polymer Supply
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Direct mill supply of 99.99% pure Continuous Cast Copper Rods, EC Grade Aluminum, Flame-Retardant PVC
            Compounds, and Silane XLPE polymers for global electrical and cable manufacturing facilities.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact?subject=Raw+Material+Bulk+Inquiry"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-900/40 transition-all hover:scale-105"
            >
              Enquire For Raw Material Supply
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/downloads"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Download Material Datasheets
            </Link>
          </div>
        </div>
      </section>

      {/* SAT / Key Metallurgy Performance Metrics */}
      <section className="bg-white border-b border-slate-200 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {satStats.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-brand-700 mt-0.5">{item.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Raw Materials Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
            Certified Industrial Materials & Polymers
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            All materials undergo rigorous optical emission spectrometry (OES), melt flow index verification, and
            dielectric testing prior to lot release.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {materials.map((mat) => {
            const Icon = mat.icon;
            return (
              <div
                key={mat.id}
                id={mat.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br border ${mat.accentColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                          {mat.category}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{mat.name}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mt-4 leading-relaxed">{mat.description}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Standard Spec</span>
                      <span className="font-bold text-slate-800">{mat.standard}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block font-medium">Purity / Conductivity</span>
                      <span className="font-bold text-emerald-700">{mat.purity}</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Technical Parameters:
                    </h4>
                    <div className="divide-y divide-slate-100 text-xs">
                      {mat.specs.map((spec, i) => (
                        <div key={i} className="py-1.5 flex justify-between items-center">
                          <span className="text-slate-500">{spec.label}</span>
                          <span className="font-semibold text-slate-900 text-right">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-medium">MOQ: Custom Bulk Lots Available</span>
                  <Link
                    href={`/contact?subject=Raw+Material+RFQ:+${encodeURIComponent(mat.name)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition"
                  >
                    Request Material Quote
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality Assay & SAT Laboratory Verification */}
      <section className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Laboratory Assays & Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
              Raw Material Metallurgical & Polymer Test Protocols
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Every incoming coil and compound batch is verified in our climate-controlled testing lab with full Material
              Test Certificate (MTC 3.1) documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-brand-400 font-mono text-sm font-bold">01 / Metallurgy</div>
              <h3 className="text-base font-bold text-white">Optical Emission Spectrometry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                24-channel arc spark spectrometer measuring Cu, Fe, Pb, Bi, and Sb elements down to 0.1 ppm resolution.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-brand-400 font-mono text-sm font-bold">02 / Conductivity</div>
              <h3 className="text-base font-bold text-white">Kelvin Double Bridge Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-precision resistance fixture measuring electrical conductivity in % IACS with temperature compensation.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-brand-400 font-mono text-sm font-bold">03 / Thermal & Flammability</div>
              <h3 className="text-base font-bold text-white">Limiting Oxygen Index (LOI)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Determines minimum oxygen concentration required to sustain polymer combustion per ASTM D2863 standards.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-brand-400 font-mono text-sm font-bold">04 / Mechanical</div>
              <h3 className="text-base font-bold text-white">Tensile & Elongation Rig</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computerized UTM tensile machine testing ultimate tensile strength, yield point, and breaking elongation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bulk Sourcing CTA Banner */}
      <section className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Looking for Contract Bulk Raw Material Sourcing?
            </h3>
            <p className="text-sm text-slate-200 max-w-xl">
              We supply continuous cast copper, aluminum rods, and compounds in containerized shipping lots with certified MTC 3.1 mill test certificates.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact?subject=Bulk+Raw+Material+Procurement"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
            >
              Direct Sales Inquiry
            </Link>
            <Link
              href="/quote"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition"
            >
              Request RFQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
