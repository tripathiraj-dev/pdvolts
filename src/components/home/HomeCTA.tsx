import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function HomeCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-900/80 border border-brand-700/60 text-brand-300 text-xs font-semibold uppercase tracking-wider">
          Enterprise Sourcing & Custom Tooling
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading">
          Looking for a Reliable Manufacturing Partner?
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Whether you need a custom compound formulation, high-volume project drum delivery, or technical
          submittal packages, our industrial engineering team is ready to assist.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/quote"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl transition transform active:scale-98"
          >
            Request a Quote <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg border border-slate-700 hover:border-slate-500 bg-slate-900/60 text-white font-semibold text-base transition"
          >
            <PhoneCall className="w-4 h-4 text-brand-400" /> Contact Engineering Team
          </Link>
        </div>

        <p className="text-xs text-slate-400 pt-2">
          Direct Sales:{" "}
          <a href={`tel:${siteConfig.contact.phone}`} className="text-brand-300 hover:underline">
            {siteConfig.contact.phone}
          </a>{" "}
          &bull; Typically responds within 2 business hours
        </p>
      </div>
    </section>
  );
}
