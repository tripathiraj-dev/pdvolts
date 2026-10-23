import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, Search, HelpCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4 bg-slate-50">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-100 text-brand-700 font-extrabold text-3xl font-heading">
            404
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            Page Not Found
          </h1>

          <p className="text-slate-600 text-base leading-relaxed">
            The industrial product, document, or page you are requesting may have been updated,
            relocated, or is no longer in service.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow transition"
            >
              <Home className="w-4 h-4" /> Return to Homepage
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-300 hover:bg-white text-slate-800 font-bold text-sm transition"
            >
              <Search className="w-4 h-4" /> Browse Catalog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
