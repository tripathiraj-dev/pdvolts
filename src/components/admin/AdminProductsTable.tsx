"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import {
  Edit,
  Trash2,
  Package,
  Plus,
  Search,
  Check,
  X,
  ExternalLink,
  Zap,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  moq: string | null;
  voltageRating: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string | Date;
  category: { id: string; name: string };
  images: { url: string }[];
}

interface AdminProductsTableProps {
  products: Product[];
  categories: Category[];
}

export default function AdminProductsTable({
  products: initialProducts,
  categories,
}: AdminProductsTableProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p))
      );
      success(`Product marked ${!product.isActive ? "Active" : "Inactive"}`);
    } catch (err: any) {
      error(err.message || "Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      success("Product removed from catalog");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter !== "ALL" && p.category.id !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="ALL">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin/products/new"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase bg-slate-950/60">
                <th className="py-3 px-4">Product Name & Category</th>
                <th className="py-3 px-4">SKU / Model</th>
                <th className="py-3 px-4">Voltage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((p) => {
                const img = p.images && p.images.length > 0 ? p.images[0].url : null;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                          {img ? (
                            <img src={img} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white block truncate max-w-xs">{p.name}</span>
                          <span className="text-[11px] text-brand-400 font-semibold">{p.category.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">{p.sku || "-"}</td>

                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {p.voltageRating || "-"}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleActive(p)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition border ${
                          p.isActive
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {p.isActive ? "Active" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      {p.isFeatured ? (
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold uppercase">
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="View Live Product"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-1.5 rounded-lg text-brand-400 hover:text-white hover:bg-brand-900/60 transition"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="p-1 rounded text-slate-400 hover:bg-slate-800"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
