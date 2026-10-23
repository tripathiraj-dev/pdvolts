"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface ProductSpecification {
  id?: string;
  key: string;
  value: string;
  unit?: string | null;
}

interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

interface ProductFormProps {
  initialProduct?: any;
  categories: Category[];
  isEdit?: boolean;
}

export default function ProductForm({ initialProduct, categories, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    categoryId: initialProduct?.categoryId || (categories[0]?.id || ""),
    shortDescription: initialProduct?.shortDescription || "",
    fullDescription: initialProduct?.fullDescription || "",
    sku: initialProduct?.sku || "",
    moq: initialProduct?.moq || "",
    material: initialProduct?.material || "",
    size: initialProduct?.size || "",
    color: initialProduct?.color || "",
    voltageRating: initialProduct?.voltageRating || "",
    application: initialProduct?.application || "",
    packaging: initialProduct?.packaging || "",
    isFeatured: initialProduct?.isFeatured ?? false,
    isActive: initialProduct?.isActive ?? true,
    seoTitle: initialProduct?.seoTitle || "",
    seoDescription: initialProduct?.seoDescription || "",
    datasheetUrl: initialProduct?.datasheetUrl || "",
  });

  const [images, setImages] = useState<ProductImage[]>(
    initialProduct?.images || [
      {
        url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
        altText: "Product Sample",
        isPrimary: true,
      },
    ]
  );

  const [specs, setSpecs] = useState<ProductSpecification[]>(
    initialProduct?.specifications || [
      { key: "Conductor Class", value: "Class 2 Stranded Copper", unit: "IEC 60228" },
      { key: "Insulation Material", value: "Cross-linked Polyethylene (XLPE)", unit: "90°C" },
    ]
  );

  // Specifications Handlers
  const addSpec = () => {
    setSpecs([...specs, { key: "", value: "", unit: "" }]);
  };

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index: number, field: "key" | "value" | "unit", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "products");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Image upload failed");
      const json = await res.json();

      setImages([
        ...images,
        {
          url: json.url,
          altText: form.name || "Product Image",
          isPrimary: images.length === 0,
        },
      ]);
      success("Product image uploaded successfully");
    } catch (err: any) {
      error(err.message || "Failed to upload image");
    } finally {
      setUploadingImg(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    setImages(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        images,
        specifications: specs.filter((s) => s.key.trim() && s.value.trim()),
      };

      const url = isEdit ? `/api/products/${initialProduct.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      success(isEdit ? "Product updated successfully" : "Product created successfully");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      error(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              {isEdit ? `Edit: ${initialProduct.name}` : "Create New Manufacturing Product"}
            </h1>
            <p className="text-xs text-slate-400">
              Configure product details, dimensions, technical specs table, and uploaded photography.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-900/30 transition disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "Save Product Changes" : "Publish New Product"}
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 Cols): Basic Details, Description, Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Primary Information */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-brand-400">
              General Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Armored XLPE Power Cable"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Product Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  SKU / Model Number
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="PD-XLPE-4C-50"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Voltage Rating
                </label>
                <input
                  type="text"
                  value={form.voltageRating}
                  onChange={(e) => setForm({ ...form, voltageRating: e.target.value })}
                  placeholder="0.6/1.1 kV"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Minimum Order (MOQ)
                </label>
                <input
                  type="text"
                  value={form.moq}
                  onChange={(e) => setForm({ ...form, moq: e.target.value })}
                  placeholder="500 Meters / 1 MT"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Short Summary / Excerpt <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="High-level product overview for catalog cards and search results..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Engineering Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={form.fullDescription}
                onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                placeholder="Detailed technical description, conductor stranding, dielectric formulas, and environmental performance..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-950 text-white text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Card: Specifications Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider text-brand-400">
                Technical Specifications Table
              </h3>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold transition border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Parameter
              </button>
            </div>

            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Conductor)"
                    value={spec.key}
                    onChange={(e) => updateSpec(idx, "key", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 99.97% Pure Copper)"
                    value={spec.value}
                    onChange={(e) => updateSpec(idx, "value", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. IEC 60228)"
                    value={spec.unit || ""}
                    onChange={(e) => updateSpec(idx, "unit", e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Images, Status, Attributes, SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Publishing Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Publishing Controls
            </h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-brand-600 focus:ring-brand-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Active in Public Catalog
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Mark as Featured Product
                </span>
              </label>
            </div>
          </div>

          {/* Card: Images Upload & Gallery */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Photography
              </h3>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-bold transition border border-slate-700">
                {uploadingImg ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Upload</span>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group h-28"
                >
                  <img src={img.url} alt={img.altText || ""} className="w-full h-full object-cover" />
                  {img.isPrimary && (
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-brand-600 text-[9px] font-bold text-white uppercase">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(idx)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-brand-600 text-white text-[10px] font-bold transition"
                        title="Set as Primary"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 rounded bg-rose-900/80 hover:bg-rose-700 text-white transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Dimensions & Materials */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Attributes & Packaging
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Conductor / Material
              </label>
              <input
                type="text"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="Class 2 Electrolytic Copper / XLPE"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Dimensions / Sizing
              </label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                placeholder="16 sq.mm to 400 sq.mm"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                Packaging
              </label>
              <input
                type="text"
                value={form.packaging}
                onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                placeholder="500m / 1000m Wooden Drums"
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
