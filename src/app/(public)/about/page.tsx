import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Target,
  Compass,
  Award,
  Users,
  Clock,
  Factory,
  CheckCircle2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Precision Wire & Polymer Engineering Excellence",
  description:
    "Learn about PdVolts' 28-year history in industrial wire manufacturing, cross-linked polymer research, and executive leadership team.",
};

export default async function AboutPage() {
  const teamMembers = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  const timeline = [
    {
      year: "1998",
      title: "Founding & Copper Drawing Line",
      desc: "Established initial manufacturing unit with high-speed multi-wire drawing lines for commercial electrical panel conductors.",
    },
    {
      year: "2006",
      title: "Polymer Compounding Facility",
      desc: "Invested in on-site twin-screw compounding lines for custom flame-retardant PVC and moisture-resistant formulation development.",
    },
    {
      year: "2014",
      title: "XLPE & High-Voltage Expansion",
      desc: "Inaugurated dedicated 60,000 sq.ft. tandem continuous vulcanization extrusion line for medium-voltage armored power cables.",
    },
    {
      year: "2020",
      title: "Renewable Solar PV Certification",
      desc: "Achieved dual European TÜV and EN 50618 certification for halogen-free cross-linked solar array cables.",
    },
    {
      year: "Today",
      title: "Global Supply & Innovation",
      desc: "Operating 120,000 sq.ft. of advanced facilities exporting over 85,000 metric tons annually to 45+ international markets.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header Banner */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            About {siteConfig.shortName}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Pioneering Precision in Wires, Cables & Polymer Science
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            For nearly three decades, {siteConfig.legalName} has provided the industrial nervous system
            for modern infrastructure, automotive systems, and heavy power distribution networks.
          </p>
        </div>
      </section>

      {/* Vision, Mission, and Values */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To engineer and deliver defect-free electrical conductors and high-performance polymer
                components that guarantee uninterrupted power transmission and superior safety in harsh
                environments worldwide.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                To be the world’s most trusted industrial manufacturing partner for sustainable,
                halogen-free, and high-efficiency wire and precision polymer extrusion solutions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Core Values</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span><strong>Integrity:</strong> Zero tolerance for dielectric compromise.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span><strong>Innovation:</strong> Proprietary compounding & tooling.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span><strong>Responsibility:</strong> ISO 14001 zero-waste recycling.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Our Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              A History of Industrial Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              From our first wire rod breakdown machine to automated 24/7 manufacturing plants.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 space-y-12 pb-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Year Marker Badge */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white shadow">
                  <Clock className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                    {item.year}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">{item.title}</h3>
                  <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Management & Engineering Leadership Team */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                Executive & Technical Leadership
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Guided by senior metallurgists, polymer scientists, and industrial operations experts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col group hover:shadow-lg transition"
                >
                  {member.photoUrl && (
                    <div className="h-64 w-full bg-slate-200 overflow-hidden">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading">{member.name}</h3>
                      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
                        {member.position}
                      </p>
                      {member.bio && (
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
