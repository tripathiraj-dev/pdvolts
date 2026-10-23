import React from "react";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Commercial Quotation & Supply Terms",
  description: "Terms and conditions governing quotation validity, manufacturing tolerances, and international export dispatch.",
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Commercial Agreement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Last Updated: January 1, 2026 &bull; {siteConfig.legalName}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 font-heading">1. Quotations & Validity</h2>
          <p>
            Due to international copper and polymer resin raw material market volatility (e.g. London Metal
            Exchange spot pricing), all commercial price quotations issued by {siteConfig.legalName} are
            valid for a period of fourteen (14) calendar days unless explicitly specified in writing.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">2. Manufacturing & Length Tolerances</h2>
          <p>
            Standard industrial continuous wire drawing and drum winding operations adhere to international
            manufacturing tolerances of &plusmn;2% on total drum length orders, unless stricter precision
            tolerances are agreed upon prior to formal contract signing.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">3. Testing & Inspection</h2>
          <p>
            All production runs undergo standard in-house lot release testing according to applicable IEC,
            ASTM, BS, or UL standards. Third-party witness testing charges are billed separately unless
            stipulated in the purchase order.
          </p>

          <h2 className="text-xl font-bold text-slate-900 font-heading">4. Export & Freight Delivery</h2>
          <p>
            Export consignments are governed by standard Incoterms&reg; 2020 (e.g. FOB, CIF, CFR, EXW).
            Packaging conforms to ISPM-15 phytosanitary wood treatment regulations for international maritime
            containers.
          </p>
        </div>
      </div>
    </div>
  );
}
