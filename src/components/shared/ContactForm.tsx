"use client";

import React, { useState, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import { Mail, CheckCircle2, Loader2, Send, Upload, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";

export default function ContactForm() {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    attachmentUrl: "",
    attachmentName: "",
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
    data.append("folder", "enquiry-attachments");

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
      setForm((prev) => ({
        ...prev,
        attachmentUrl: json.url,
        attachmentName: file.name,
      }));
      success("Attachment uploaded successfully", file.name);
    } catch (err: any) {
      error(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = () => {
    setForm((prev) => ({ ...prev, attachmentUrl: "", attachmentName: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          subject: form.subject,
          message: form.message,
          attachmentUrl: form.attachmentUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit message");

      setSubmitted(true);
      success("Your message has been received by our client services team.");
    } catch (err: any) {
      error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 font-heading">
          Message Received!
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you for reaching out to PDVOLT. Our technical representative will review your
          inquiry and respond promptly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              company: "",
              subject: "",
              message: "",
              attachmentUrl: "",
              attachmentName: "",
            });
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-brand-700 transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const isImageAttachment = form.attachmentUrl && (
    form.attachmentUrl.match(/\.(jpeg|jpg|png|webp|gif|svg)$/i) ||
    form.attachmentUrl.startsWith("data:image/")
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-5"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-xl font-bold text-slate-900 font-heading">Send Us a Direct Message</h2>
        <p className="text-xs text-slate-500 mt-1">
          Have an inquiry regarding custom compounds, technical datasheets, drawings, or bulk exports?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Smith"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Corporate Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            placeholder="Apex Contracting Corp."
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Subject <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="e.g. Inquiring regarding custom armored cable or pipe specifications"
          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Please describe your requirements, specifications, or inquiry..."
          className="w-full px-3.5 py-3 rounded-xl border border-slate-300 text-base sm:text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
        />
      </div>

      {/* Attachment Upload Field */}
      <div className="pt-1">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
          Attach Drawing / Sample Image / Specification (Optional)
        </label>
        
        {form.attachmentUrl ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="flex items-center gap-3 overflow-hidden">
              {isImageAttachment ? (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-amber-300 bg-white shrink-0">
                  <img
                    src={form.attachmentUrl}
                    alt="Uploaded thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {form.attachmentName || "Attached File"}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready to submit with inquiry
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={removeAttachment}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.dwg,.dxf"
              className="hidden"
              id="enquiry-file-input"
            />
            <label
              htmlFor="enquiry-file-input"
              className={`flex items-center justify-center gap-2 p-3.5 border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/30 rounded-xl cursor-pointer transition text-xs font-semibold text-slate-600 ${
                uploading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Uploading attachment...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Upload Cable/Pipe Photo, Technical Drawing or Specification PDF (Max 10MB)</span>
                </>
              )}
            </label>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm shadow-md transition disabled:opacity-60 active:scale-[0.99]"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting Inquiry...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Direct Message
          </>
        )}
      </button>
    </form>
  );
}
