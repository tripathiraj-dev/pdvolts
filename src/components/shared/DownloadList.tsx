"use client";

import React, { useState } from "react";
import { Download, FileText, CheckCircle2, Search } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  fileUrl: string;
  fileSize: string | null;
  downloadCount: number;
}

interface DownloadListProps {
  initialItems: DownloadItem[];
}

export default function DownloadList({ initialItems }: DownloadListProps) {
  const [items, setItems] = useState<DownloadItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const categories = ["ALL", ...Array.from(new Set(initialItems.map((i) => i.category)))];

  const handleDownload = async (item: DownloadItem) => {
    // Increment download count via API
    fetch(`/api/downloads/${item.id}/track`, { method: "POST" }).catch(() => {});
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, downloadCount: i.downloadCount + 1 } : i))
    );
  };

  const filtered = items.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Search & Category Filter */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === c
                  ? "bg-brand-700 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {c === "ALL" ? "All Documents" : c}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brochures, PDFs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Downloads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                  {item.category}
                </span>
                {item.fileSize && (
                  <span className="text-xs font-mono text-slate-400">{item.fileSize}</span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-900 font-heading">{item.title}</h3>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {item.description || "Official engineering document from PdVolts."}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Downloaded <strong>{item.downloadCount}</strong> times
              </span>

              <a
                href={item.fileUrl}
                download
                onClick={() => handleDownload(item)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-brand-700 text-white text-xs font-semibold shadow transition"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
