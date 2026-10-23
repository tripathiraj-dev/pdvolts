import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Corporate Data Governance",
  description: "Learn how PdVolts protects client commercial data, drawings, and contact records.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Legal & Governance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last Updated: January 1, 2026 &bull; {siteConfig.legalName}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 font-heading">1. Overview</h2>
          <p>
            {siteConfig.legalName} (&ldquo;{siteConfig.shortName}&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;)
            respects the confidential nature of commercial RFQs, technical drawings, and corporate contact
            information provided by prospective purchasers, EPC contractors, and distributors.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">2. Data We Collect</h2>
          <p>
            When utilizing our Request for Quotation (RFQ) portal or establishing a corporate account, we
            collect:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-600">
            <li>Contact details: Full name, business email address, phone number, company name.</li>
            <li>Technical parameters: Conductor specs, volumes, CAD drawings, and site delivery locations.</li>
            <li>Account credentials: Hashed passwords stored via industry-standard bcrypt algorithms.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 font-heading">3. Confidentiality of Engineering Drawings</h2>
          <p>
            Proprietary technical blueprints, cable cross-sections, and custom injection molding CAD files
            uploaded via our secure portal are strictly restricted to our estimation and production tooling
            engineers. We do not license, disclose, or distribute client blueprints to unauthorized third
            parties.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">4. Contact Us</h2>
          <p>
            For inquiries regarding our corporate data policies, please write to{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-600 underline">
              {siteConfig.contact.email}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
