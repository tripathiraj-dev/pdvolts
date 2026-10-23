"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  MessageSquare,
  Search,
  MessageCircle,
  Trash2,
  X,
  Send,
  Loader2,
  Mail,
  Phone,
  Building,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EnquiryNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string | Date;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string | Date;
  notes: EnquiryNote[];
}

interface AdminEnquiriesViewProps {
  initialEnquiries: Enquiry[];
}

export default function AdminEnquiriesView({ initialEnquiries }: AdminEnquiriesViewProps) {
  const { success, error } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);

  const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "CLOSED"];

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-950 text-blue-400 border-blue-800",
    CONTACTED: "bg-amber-950 text-amber-400 border-amber-800",
    IN_PROGRESS: "bg-purple-950 text-purple-400 border-purple-800",
    CLOSED: "bg-slate-800 text-slate-400 border-slate-700",
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
      success(`Enquiry marked as ${status}`);
    } catch (err: any) {
      error(err.message || "Failed to update");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNote.trim()) return;

    setNoteLoading(true);
    try {
      const res = await fetch(`/api/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: newNote.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to add note");

      setSelectedEnquiry(data.enquiry);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? data.enquiry : e))
      );
      setNewNote("");
      success("Note added to enquiry log");
    } catch (err: any) {
      error(err.message || "Failed to add note");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete enquiry");

      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      success("Enquiry removed");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  const filtered = enquiries.filter((e) => {
    if (statusFilter !== "ALL" && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        (e.company && e.company.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
            Client Inquiries
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Contact Messages & Support Inquiries
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming general communications, track resolutions, and record engineering responses.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject, email, or name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === "ALL"
                ? "bg-brand-600 text-white shadow"
                : "bg-slate-950 text-slate-400 hover:bg-slate-800"
            }`}
          >
            All ({enquiries.length})
          </button>
          {statuses.map((st) => {
            const count = enquiries.filter((e) => e.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-brand-600 text-white shadow"
                    : "bg-slate-950 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className={selectedEnquiry ? "lg:col-span-6 space-y-3" : "lg:col-span-12 space-y-3"}>
          {filtered.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              No inquiries found.
            </div>
          ) : (
            filtered.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`bg-slate-900 border p-5 rounded-2xl cursor-pointer transition-all duration-200 space-y-3 ${
                    isSelected
                      ? "border-brand-500 bg-slate-800/80 shadow-lg"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        statusColorMap[enq.status] || "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[11px] text-slate-500">{formatDate(enq.createdAt)}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{enq.subject}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      From: <strong className="text-slate-200">{enq.name}</strong>{" "}
                      {enq.company ? `(${enq.company})` : ""}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {enq.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Enquiry Detail Panel */}
        {selectedEnquiry && (
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-brand-400 uppercase">
                  Inquiry Details
                </span>
                <h3 className="text-base font-bold text-white font-heading">
                  {selectedEnquiry.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-400">
                Update Status:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedEnquiry.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition border ${
                      selectedEnquiry.status === st
                        ? "bg-brand-600 text-white border-brand-500 shadow"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Meta */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Sender Name</span>
                <span className="text-white font-bold">{selectedEnquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email</span>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-brand-400 hover:underline">
                  {selectedEnquiry.email}
                </a>
              </div>
              {selectedEnquiry.phone && (
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-slate-200">{selectedEnquiry.phone}</span>
                </div>
              )}
              {selectedEnquiry.company && (
                <div>
                  <span className="text-slate-500 block">Company</span>
                  <span className="text-slate-200">{selectedEnquiry.company}</span>
                </div>
              )}
            </div>

            {/* Full Message */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedEnquiry.message}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-brand-400" /> Internal Resolution Log
              </h4>

              {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedEnquiry.notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1"
                    >
                      <p className="text-slate-200 leading-relaxed">{n.content}</p>
                      <span className="text-[10px] text-slate-500 block">
                        By {n.authorName} &bull; {formatDate(n.createdAt)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">No notes logged yet.</p>
              )}

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Log client response or action taken..."
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white text-xs outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={noteLoading}
                  className="px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  {noteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Save
                </button>
              </form>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDelete(selectedEnquiry.id)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Enquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
