"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, HelpCircle, Edit, X, Loader2 } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

interface AdminFaqsViewProps {
  faqs: FaqItem[];
}

export default function AdminFaqsView({ faqs: initialFaqs }: AdminFaqsViewProps) {
  const { success, error } = useToast();
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "General",
    sortOrder: 0,
  });

  const categories = [
    "General",
    "Wire & Cables",
    "Plastic Manufacturing",
    "Custom Orders & OEM",
    "Quality & Standards",
    "Shipping & Logistics",
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ question: "", answer: "", category: "General", sortOrder: faqs.length });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sortOrder: faq.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const res = await fetch(`/api/faqs?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to update FAQ");
        const updated = await res.json();
        setFaqs(faqs.map((f) => (f.id === editingId ? updated : f)));
        success("FAQ updated successfully");
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to create FAQ");
        const created = await res.json();
        setFaqs([...faqs, created]);
        success("FAQ added successfully");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || "Failed to save FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ");

      setFaqs(faqs.filter((f) => f.id !== id));
      success("FAQ deleted");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Frequently Asked Questions (FAQ)</h1>
          <p className="text-slate-500 text-sm mt-1">Manage FAQs displayed across the website and product inquiries.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No FAQs created</h3>
            <p className="text-slate-500 text-sm mt-1">Click Add FAQ to add answers to common customer questions.</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{faq.question}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-1 line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                  title="Edit FAQ"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit FAQ" : "Add FAQ"}</h2>
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
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. What copper purity standards do you use?"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Provide a clear, detailed technical or operational answer..."
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
                  {editingId ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
