"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Package, FileText, HelpCircle, ArrowRight, Loader2 } from "lucide-react";

interface SearchResult {
  products: { id: string; name: string; slug: string; shortDescription: string; category?: { name: string } }[];
  blogs: { id: string; title: string; slug: string; excerpt: string; category: string }[];
  faqs: { id: string; question: string; answer: string; category: string }[];
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({ products: [], blogs: [], faqs: [] });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ products: [], blogs: [], faqs: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled externally or we can expose a toggle
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ products: [], blogs: [], faqs: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.products.length + results.blogs.length + results.faqs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search industrial wires, polymer products, guides, FAQs..."
            className="w-full text-base bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
          />
          {loading && <Loader2 className="w-5 h-5 text-brand-500 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-4 divide-y divide-slate-100">
          {query.trim().length >= 2 && !loading && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500">
              <p className="text-base font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1 text-slate-400">
                Try searching for &ldquo;Copper&rdquo;, &ldquo;XLPE&rdquo;, &ldquo;Conduit&rdquo;, or &ldquo;PVC&rdquo;
              </p>
            </div>
          )}

          {/* Products Group */}
          {results.products.length > 0 && (
            <div className="py-2 first:pt-0">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-brand-600" /> Products & Components
              </h4>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition group"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition">
                        {p.name}
                      </span>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.shortDescription}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blog Articles Group */}
          {results.blogs.length > 0 && (
            <div className="py-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" /> Technical Articles & News
              </h4>
              <div className="space-y-1">
                {results.blogs.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition group"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition">
                        {b.title}
                      </span>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{b.excerpt}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs Group */}
          {results.faqs.length > 0 && (
            <div className="py-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Frequently Asked Questions
              </h4>
              <div className="space-y-1">
                {results.faqs.map((f) => (
                  <Link
                    key={f.id}
                    href="/faq"
                    onClick={onClose}
                    className="block p-2.5 rounded-lg hover:bg-slate-50 transition"
                  >
                    <p className="text-sm font-semibold text-slate-900">{f.question}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{f.answer}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Search in catalog, articles & knowledgebase</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
