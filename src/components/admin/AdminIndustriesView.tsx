"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, Factory, Upload, Loader2, X, Edit, Zap } from "lucide-react";
import { slugify } from "@/lib/utils";

interface IndustryItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  imageUrl: string | null;
  icon: string | null;
  order: number;
}

interface AdminIndustriesViewProps {
  industries: IndustryItem[];
}

export default function AdminIndustriesView({ industries: initialItems }: AdminIndustriesViewProps) {
  const { success, error } = useToast();
  const [industries, setIndustries] = useState<IndustryItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    imageUrl: "",
    icon: "Zap",
    order: 0,
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      summary: "",
      description: "",
      imageUrl: "",
      icon: "Zap",
      order: industries.length,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ind: IndustryItem) => {
    setEditingId(ind.id);
    setForm({
      title: ind.title,
      slug: ind.slug,
      summary: ind.summary || "",
      description: ind.description,
      imageUrl: ind.imageUrl || "",
      icon: ind.icon || "Zap",
      order: ind.order,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "industries");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: json.url }));
      success("Industry image uploaded");
    } catch (err: any) {
      error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
      };

      if (editingId) {
        const res = await fetch(`/api/industries?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to update industry");
        const json = await res.json();
        const updated = json.industry || json;
        setIndustries(industries.map((i) => (i.id === editingId ? updated : i)));
        success("Industry sector updated");
      } else {
        const res = await fetch("/api/industries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create industry");
        const json = await res.json();
        const created = json.industry || json;
        setIndustries([...industries, created]);
        success("Industry sector added");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || "Failed to save industry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this industry sector?")) return;

    try {
      const res = await fetch(`/api/industries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete industry");

      setIndustries(industries.filter((i) => i.id !== id));
      success("Industry sector removed");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Industries & Applications</h1>
          <p className="text-slate-500 text-sm mt-1">Manage sectors served (Automotive, Solar, Telecom, Construction).</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" /> Add Industry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industries.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Factory className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No industries added yet</h3>
            <p className="text-slate-500 text-sm mt-1">Add application sectors catered by your manufacturing capabilities.</p>
          </div>
        ) : (
          industries.map((ind) => (
            <div
              key={ind.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                  {ind.imageUrl ? (
                    <Image
                      src={ind.imageUrl}
                      alt={ind.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      <Factory className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                    {ind.title}
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold text-primary-700 mb-1">{ind.summary}</p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ind.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <span className="text-xs text-slate-400">Slug: /{ind.slug}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(ind)}
                    className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit Industry"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ind.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Industry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? "Edit Industry Sector" : "Add Industry Sector"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Industry Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: slugify(e.target.value),
                    })
                  }
                  placeholder="e.g. Solar & Renewable Energy"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Summary
                </label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="e.g. High-efficiency photovoltaic cabling & UV resistant conduit systems"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Sector Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="URL or click Upload"
                    className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe electrical wiring and molded plastic components supplied to this sector..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Sector" : "Save Sector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
