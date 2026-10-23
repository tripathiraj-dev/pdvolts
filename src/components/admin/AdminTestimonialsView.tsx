"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, MessageSquare, Star, Upload, Loader2, X, Check } from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  designation: string | null;
  company: string | null;
  avatarUrl: string | null;
  rating: number;
  feedback: string;
  isFeatured: boolean;
  sortOrder: number;
}

interface AdminTestimonialsViewProps {
  testimonials: TestimonialItem[];
}

export default function AdminTestimonialsView({ testimonials: initialItems }: AdminTestimonialsViewProps) {
  const { success, error } = useToast();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    designation: "",
    company: "",
    avatarUrl: "",
    rating: 5,
    feedback: "",
    isFeatured: true,
    sortOrder: 0,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "testimonials");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm((prev) => ({ ...prev, avatarUrl: json.url }));
      success("Client photo uploaded");
    } catch (err: any) {
      error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save testimonial");
      const created = await res.json();

      setTestimonials([created, ...testimonials]);
      setIsModalOpen(false);
      setForm({
        clientName: "",
        designation: "",
        company: "",
        avatarUrl: "",
        rating: 5,
        feedback: "",
        isFeatured: true,
        sortOrder: 0,
      });
      success("Client testimonial saved");
    } catch (err: any) {
      error(err.message || "Failed to save testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFeatured = async (item: TestimonialItem) => {
    try {
      const res = await fetch(`/api/testimonials?id=${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !item.isFeatured }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setTestimonials((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, isFeatured: !t.isFeatured } : t))
      );
      success(`Testimonial ${!item.isFeatured ? "featured on homepage" : "unfeatured"}`);
    } catch (err: any) {
      error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete testimonial");

      setTestimonials(testimonials.filter((t) => t.id !== id));
      success("Testimonial deleted");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Client Reviews & Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">Manage industrial client feedback and enterprise endorsements.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No testimonials added yet</h3>
            <p className="text-slate-500 text-sm mt-1">Add client endorsements and partner ratings.</p>
          </div>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${idx < t.rating ? "fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => toggleFeatured(t)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      t.isFeatured
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {t.isFeatured ? "★ Featured" : "Standard"}
                  </button>
                </div>

                <p className="text-slate-700 text-sm italic leading-relaxed line-clamp-4">
                  &ldquo;{t.feedback}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {t.avatarUrl ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                      <Image src={t.avatarUrl} alt={t.clientName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-700 flex items-center justify-center flex-shrink-0 text-sm">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{t.clientName}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {t.designation ? `${t.designation}, ` : ""}
                      {t.company || ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add Client Review</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    placeholder="e.g. Head of Procurement"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Bharat Infra Ltd"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Rating (1-5)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={5}>5 Stars (★★★★★)</option>
                    <option value={4}>4 Stars (★★★★☆)</option>
                    <option value={3}>3 Stars (★★★☆☆)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Client Avatar Photo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.avatarUrl}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
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
                  Review / Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.feedback}
                  onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                  placeholder="What was the client's experience with the products, tolerance, delivery timeline..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                />
                <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700">
                  Feature on Website Homepage
                </label>
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
