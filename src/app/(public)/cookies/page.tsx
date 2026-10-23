import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy | Web Navigation Privacy",
  description: "Understand the session and security cookies utilized across the PdVolts industrial web portal.",
};

export default function CookiePolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Privacy & Cookies
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Cookie Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last Updated: January 1, 2026 &bull; {siteConfig.legalName}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 font-heading">1. Strictly Necessary Cookies</h2>
          <p>
            {siteConfig.shortName} utilizes secure, HTTP-only authentication cookies (e.g.{" "}
            <code>pdvolts_session</code>) solely to maintain user login state, role-based admin routing,
            and RFQ tracker sessions. These cookies do not track activity across external websites.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">2. Functional & Analytical Cookies</h2>
          <p>
            We may utilize transient cookies to remember product category filter preferences and
            search queries to enhance catalog responsiveness.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">3. Controlling Cookies</h2>
          <p>
            You can configure your browser to reject cookies. However, logging into the Client Dashboard
            or Admin Control Panel requires accepting session tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
