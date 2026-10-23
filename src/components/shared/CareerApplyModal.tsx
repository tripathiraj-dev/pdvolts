"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { X, Upload, CheckCircle2, Loader2, Send } from "lucide-react";

interface Career {
  id: string;
  title: string;
  department: string;
}

interface CareerApplyModalProps {
  career: Career | null;
  onClose: () => void;
}

export default function CareerApplyModal({ career, onClose }: CareerApplyModalProps) {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: "",
  });

  if (!career) return null;

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      error("Resume size exceeds 10MB limit");
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("folder", "resumes");

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
      setForm((prev) => ({ ...prev, resumeUrl: json.url }));
      success("Resume attached successfully");
    } catch (err: any) {
      error(err.message || "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resumeUrl) {
      error("Please upload your CV / Resume document");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/careers/${career.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");

      setSubmitted(true);
      success("Application successfully submitted to PdVolts HR");
    } catch (err: any) {
      error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              Application Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              Thank you for your interest in joining PdVolts. Our Talent Acquisition department will
              review your background and qualifications.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {career.department}
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-heading">
                Apply for: {career.title}
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Marcus Vance"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="marcus@example.com"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Upload Resume / CV (PDF, DOCX up to 10MB) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
                  {uploading ? (
                    <Loader2 className="w-4 h-4 text-brand-600 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-brand-600" />
                  )}
                  <span>{form.resumeUrl ? "Replace Resume" : "Attach File"}</span>
                  <input
                    type="file"
                    onChange={handleResumeUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
                {form.resumeUrl && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Resume Attached
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cover Note / Relevant Experience
              </label>
              <textarea
                rows={3}
                value={form.coverLetter}
                onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                placeholder="Briefly describe your background in wire drawing, polymer compounding, or industrial engineering..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow transition disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
