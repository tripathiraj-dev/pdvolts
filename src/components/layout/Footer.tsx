import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import Logo from "./Logo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { title: "Armored XLPE Power Cables", href: "/products/armored-xlpe-power-cable" },
    { title: "Multicore Flexible Cables", href: "/products/multicore-flexible-copper-cable" },
    { title: "Single Core FR PVC Wires", href: "/products/single-core-fr-pvc-insulated-wire" },
    { title: "Submersible Flat Cables", href: "/products/submersible-3-core-flat-cable" },
    { title: "Halogen-Free Solar PV Cables", href: "/products/halogen-free-solar-pv-cable" },
    { title: "Precision Molded Terminal Blocks", href: "/products/precision-molded-terminal-blocks" },
    { title: "Rigid uPVC Conduit Pipes", href: "/products/rigid-pvc-electrical-conduit-pipes" },
  ];

  const quickLinks = [
    { title: "About Our Company", href: "/about" },
    { title: "Raw Materials (99.99% Cu / Polymers)", href: "/raw-materials" },
    { title: "Manufacturing Infrastructure", href: "/manufacturing" },
    { title: "Quality & Certifications", href: "/quality" },
    { title: "Industries & Applications", href: "/industries" },
    { title: "Product Catalogues & PDFs", href: "/downloads" },
    { title: "Industrial Media Gallery", href: "/gallery" },
    { title: "Careers & Openings", href: "/careers" },
    { title: "Technical Insights & News", href: "/blog" },
    { title: "Frequently Asked Questions", href: "/faq" },
    { title: "Request a Formal Quotation", href: "/quote" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Corporate Overview (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-slate-400 leading-relaxed pr-4 mt-3">
              {siteConfig.description}
            </p>

            <div className="pt-2 flex items-center gap-3 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Certified ISO 9001:2015, ISO 14001, CE & RoHS Compliant</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (1 Col) */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
              Corporate
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.slice(0, 7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition duration-150"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Verticals (1 Col) */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
              Featured Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-block transition duration-150"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (1 Col) */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-500 pl-2.5">
              Headquarters
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-1" />
              <span>{siteConfig.contact.address.full}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition">
                {siteConfig.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-brand-400 shrink-0" />
              <a href={`mailto:${siteConfig.contact.salesEmail}`} className="hover:text-white transition">
                {siteConfig.contact.salesEmail}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <span>{siteConfig.contact.hours}</span>
            </div>

            <div className="pt-2">
              <Link
                href="/quote"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition"
              >
                Submit Request for Quotation (RFQ) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition">
              Terms & Conditions
            </Link>
            <Link href="/cookies" className="hover:text-slate-300 transition">
              Cookie Policy
            </Link>
            <Link href="/admin" className="hover:text-slate-300 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
