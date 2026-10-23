import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/shared/ContactForm";
import { siteConfig } from "@/config/site";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | Manufacturing Headquarters & Global Inquiries",
  description:
    "Contact PdVolts Industrial headquarters in Houston, TX for direct sales, engineering consultations, and international distributor support.",
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Page Banner */}
      <section className="bg-slate-950 text-white py-14 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-15 pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Global Connect
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Contact Our Engineering & Sales Teams
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We operate worldwide to supply custom cable solutions and polymer formulations. Reach out
            directly or submit your inquiry below.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Address Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          {/* Contact Information & Maps (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
                Corporate Headquarters & Works
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Plant Location</span>
                    <span>{siteConfig.contact.address.full}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Sales & Dispatch</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-brand-600">
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Email Inquiries</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-brand-600 block">
                      General: {siteConfig.contact.email}
                    </a>
                    <a href={`mailto:${siteConfig.contact.salesEmail}`} className="hover:text-brand-600 block">
                      Sales: {siteConfig.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Operating Hours</span>
                    <span>{siteConfig.contact.hours}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Follow Our Updates
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand-600 hover:text-white transition"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand-600 hover:text-white transition"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand-600 hover:text-white transition"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-brand-600 hover:text-white transition"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Google Maps Location Embed */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-64">
              <iframe
                title="PdVolts Manufacturing Plant Location"
                src={siteConfig.contact.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
