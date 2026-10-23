"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Save, ArrowLeft, Loader2, Upload, BookOpen } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  initialPost?: any;
  isEdit?: boolean;
}

export default function BlogForm({ initialPost, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    title: initialPost?.title || "",
    slug: initialPost?.slug || "",
    excerpt: initialPost?.excerpt || "",
    content: initialPost?.content || "",
    coverImage: initialPost?.coverImage || "",
    category: initialPost?.category || "Technical Guide",
    tags: initialPost?.tags || "",
    isPublished: initialPost?.isPublished ?? true,
    seoTitle: initialPost?.seoTitle || "",
    seoDescription: initialPost?.seoDescription || "",
  });

  const categories = [
    "Technical Guide",
    "Polymer Science",
    "Electrical Codes & Standards",
    "Manufacturing Updates",
    "Case Studies",
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "blog");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm({ ...form, coverImage: json.url });
      success("Cover image uploaded");
    } catch (err: any) {
      error(err.message || "Failed to upload image");
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/blog/${initialPost.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save article");

      success(isEdit ? "Article updated" : "Article published successfully");
      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      error(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {isEdit ? `Edit Article: ${initialPost.title}` : "Write Manufacturing Article"}
            </h1>
            <p className="text-xs text-slate-400">
              Publish technical analysis, standard comparisons, and polymer research to the public portal.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save Article Changes" : "Publish Article"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Selecting the Right Cable Insulation: PVC vs XLPE"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="selecting-cable-insulation-pvc-vs-xlpe"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Executive Excerpt <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief 2-line overview shown on blog list cards..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Full Article Content (Markdown format) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={14}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write full technical article content here using standard markdown..."
                className="w-full px-3.5 py-3 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs font-mono leading-relaxed outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Publishing Options
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="XLPE, PVC, Engineering, Solar"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-slate-200">
                Published & Visible Publicly
              </span>
            </label>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cover Photo
              </h3>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold transition">
                {uploadingImg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>Upload</span>
                <input type="file" onChange={handleImageUpload} className="hidden" accept="image/*" />
              </label>
            </div>

            {form.coverImage ? (
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={form.coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs">
                No cover image selected
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
