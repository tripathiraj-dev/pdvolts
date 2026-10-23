"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, Award, Upload, Loader2, X, FileText } from "lucide-react";

interface CertificationItem {
  id: string;
  title: string;
  certificateNumber: string | null;
  issuingBody: string | null;
  description: string | null;
  imageUrl: string | null;
  fileUrl: string | null;
  validUntil: string | null;
}

interface AdminCertificationsViewProps {
  certifications: CertificationItem[];
}

export default function AdminCertificationsView({ certifications: initialCerts }: AdminCertificationsViewProps) {
  const { success, error } = useToast();
  const [certs, setCerts] = useState<CertificationItem[]>(initialCerts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    certificateNumber: "",
    issuingBody: "",
    description: "",
    imageUrl: "",
    fileUrl: "",
    validUntil: "",
    isFeatured: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "pdf") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") setUploadingImg(true);
    else setUploadingPdf(true);

    const data = new FormData();
    data.append("file", file);
    data.append("folder", "certifications");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      if (type === "image") setForm((prev) => ({ ...prev, imageUrl: json.url }));
      else setForm((prev) => ({ ...prev, fileUrl: json.url }));
      success(`${type === "image" ? "Certificate image" : "PDF document"} uploaded`);
    } catch (err: any) {
      error(err.message || "Upload failed");
    } finally {
      if (type === "image") setUploadingImg(false);
      else setUploadingPdf(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save certification");
      const json = await res.json();
      const newCert = json.certification || json;

      setCerts([newCert, ...certs]);
      setIsModalOpen(false);
      setForm({
        title: "",
        certificateNumber: "",
        issuingBody: "",
        description: "",
        imageUrl: "",
        fileUrl: "",
        validUntil: "",
        isFeatured: true,
      });
      success("Certification created successfully");
    } catch (err: any) {
      error(err.message || "Failed to create certification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const res = await fetch(`/api/certifications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete certification");

      setCerts(certs.filter((c) => c.id !== id));
      success("Certification deleted");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Quality & ISO Certifications</h1>
          <p className="text-slate-500 text-sm mt-1">Manage standard accreditations, compliance badges, and certificates.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/20"
        >
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No certifications listed</h3>
          <p className="text-slate-500 text-sm mt-1">Upload your ISO, CE, RoHS, and industry compliance certificates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  {cert.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-50">
                      <Image src={cert.imageUrl} alt={cert.title} fill className="object-contain p-2" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                      <Award className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-md mb-1">
                      {cert.certificateNumber || "Accreditation"}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{cert.title}</h3>
                    {cert.issuingBody && (
                      <p className="text-xs text-slate-500 mt-0.5">Issued by: {cert.issuingBody}</p>
                    )}
                  </div>
                </div>

                {cert.description && (
                  <p className="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed">{cert.description}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {cert.fileUrl ? (
                    <a
                      href={cert.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Certificate PDF
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400">No PDF attached</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Certificate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Add Certification</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. ISO 9001:2015 Quality Management System"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Certificate Number / Standard
                  </label>
                  <input
                    type="text"
                    value={form.certificateNumber}
                    onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })}
                    placeholder="e.g. ISO 9001:2015"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Issuing Body *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.issuingBody}
                    onChange={(e) => setForm({ ...form, issuingBody: e.target.value })}
                    placeholder="e.g. TÜV SÜD / Bureau Veritas"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Badge / Logo Image
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="Image URL or upload"
                    className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200">
                    {uploadingImg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Certificate PDF
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.fileUrl}
                    onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                    placeholder="PDF URL or upload"
                    className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200">
                    {uploadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    <span>PDF</span>
                    <input type="file" accept=".pdf" onChange={(e) => handleFileUpload(e, "pdf")} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Scope
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail the scope of certification and compliance benchmarks..."
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
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
