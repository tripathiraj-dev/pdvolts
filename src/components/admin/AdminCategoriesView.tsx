"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit, Trash2, Layers, Loader2, X, Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
  _count?: { products: number };
}

interface AdminCategoriesViewProps {
  initialCategories: Category[];
}

export default function AdminCategoriesView({ initialCategories }: AdminCategoriesViewProps) {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    order: 0,
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "", description: "", image: "", order: categories.length + 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      order: cat.order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? { ...c, ...data.category } : c))
        );
        success("Category updated successfully");
      } else {
        setCategories((prev) => [...prev, data.category]);
        success("Category created successfully");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");

      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
      success("Category removed");
    } catch (err: any) {
      error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Catalog Taxonomy
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Product Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define industrial classification groups, featured banners, and category sorting order.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" /> Add New Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            {cat.image ? (
              <div className="h-36 bg-slate-950 overflow-hidden relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[10px] font-mono">
                  Order #{cat.order}
                </span>
              </div>
            ) : (
              <div className="h-28 bg-slate-950 flex items-center justify-center text-slate-700">
                <Layers className="w-8 h-8" />
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-base font-bold text-white font-heading">{cat.name}</h3>
                <span className="text-[11px] font-mono text-brand-400 block mb-1">/{cat.slug}</span>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">
                  {cat._count?.products || 0} Products
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-brand-400 hover:text-white hover:bg-brand-900/50 transition"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-heading">
                {editingCategory ? "Edit Category" : "Add Product Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Industrial Power Cables"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. industrial-power-cables"
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary of products in this category..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Save className="w-3.5 h-3.5" /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
