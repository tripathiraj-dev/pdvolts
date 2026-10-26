"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Mail,
  Phone,
  Globe,
  Package,
} from "lucide-react";

interface ProductOption {
  id: string;
  name: string;
  sku: string | null;
}

interface QuoteFormProps {
  products: ProductOption[];
  preselectedProductId?: string;
}

export default function QuoteForm({ products, preselectedProductId }: QuoteFormProps) {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rfqRef, setRfqRef] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "United States",
    productId: preselectedProductId || "",
    quantity: "",
    requirements: "",
    message: "",
    attachmentUrl: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      error("File size exceeds 10MB limit");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "rfq-attachments");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const json = await res.json();
      setFormData((prev) => ({ ...prev, attachmentUrl: json.url }));
      success("Drawing / specification attachment uploaded successfully");
    } catch (err: any) {
      error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      setSubmitted(true);
      setRfqRef(data.quote.id);
      success("Request for Quotation successfully submitted");
    } catch (err: any) {
      error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 font-heading">
            Quotation Request Received!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Thank you, <strong>{formData.name}</strong>. Your Request for Quotation has been assigned
            reference <strong>#{rfqRef.slice(-6).toUpperCase()}</strong>.
          </p>
          <p className="text-xs text-slate-500">
            A confirmation has been sent to <strong>{formData.email}</strong>. Our commercial
            estimators will prepare formal pricing within 24 business hours.
          </p>
        </div>

        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              company: "",
              email: "",
              phone: "",
              country: "United States",
              productId: "",
              quantity: "",
              requirements: "",
              message: "",
              attachmentUrl: "",
            });
          }}
          className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-brand-700 transition"
        >
          Submit Another RFQ
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6"
    >
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 font-heading">
          Commercial Request for Quotation (RFQ)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide your project parameters, required drum lengths, or custom polymer specifications.
        </p>
      </div>

      {/* Row 1: Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Company / Organization <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Apex Electrical EPC Ltd."
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Row 2: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Corporate Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      {/* Row 3: Country & Product Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Destination Country / Port
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="India / United States / Middle East / Europe"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Product Line
          </label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          >
            <option value="">-- Custom Engineering / Other --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.sku ? `(${p.sku})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Quantity */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Estimated Volume / Quantity <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="e.g. 5,000 Meters / 2 Drums / 10 MT Pellets"
          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
        />
      </div>

      {/* Row 5: Requirements */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Technical Specifications & Standards
        </label>
        <textarea
          rows={3}
          value={formData.requirements}
          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          placeholder="Specify conductor stranding, insulation rating, color code, drum lagging or required third-party witness testing..."
          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
        />
      </div>

      {/* File Attachment Upload */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Attach Specification Sheet / Technical Drawing (PDF, DOC, DWG up to 10MB)
        </label>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
            {uploading ? (
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-amber-600" />
            )}
            <span>{formData.attachmentUrl ? "Replace File" : "Choose File / Drawing"}</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.dwg,.dxf"
            />
          </label>
          {formData.attachmentUrl && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 truncate max-w-xs">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Attachment uploaded
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-md transition disabled:opacity-60 min-h-[48px] active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing RFQ Submission...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" /> Submit Request for Quotation
            </>
          )}
        </button>
      </div>
    </form>
  );
}
