"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2, Tag } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
}

interface GalleryViewProps {
  items: GalleryItem[];
}

export default function GalleryView({ items }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["ALL", ...Array.from(new Set(items.map((i) => i.category)))];

  const filteredItems = items.filter(
    (i) => selectedCategory === "ALL" || i.category === selectedCategory
  );

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const nextLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevLightbox = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              selectedCategory === c
                ? "bg-brand-700 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {c === "ALL" ? "All Operations" : c}
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm cursor-pointer h-72"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>

            <div className="absolute top-3 right-3 p-2 rounded-lg bg-slate-950/60 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition">
              <Maximize2 className="w-4 h-4" />
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                {item.category}
              </span>
              <h4 className="text-base font-bold leading-tight font-heading">{item.title}</h4>
              {item.description && (
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].imageUrl}
              alt={filteredItems[lightboxIndex].title}
              className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-slate-800"
            />
            <div className="mt-4 text-center text-white space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="text-xl font-bold font-heading">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                  {filteredItems[lightboxIndex].description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
