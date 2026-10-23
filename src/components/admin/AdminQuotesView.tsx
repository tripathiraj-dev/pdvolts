"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  FileText,
  Search,
  MessageSquare,
  Download,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface QuoteNote {
  id: string;
  authorName: string;
  content: string;
  createdAt: string | Date;
}

interface Quote {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string | null;
  quantity: string;
  requirements: string | null;
  message: string | null;
  attachmentUrl: string | null;
  status: string;
  createdAt: string | Date;
  product?: { id: string; name: string; sku: string | null } | null;
  notes: QuoteNote[];
}

interface AdminQuotesViewProps {
  initialQuotes: Quote[];
}

export default function AdminQuotesView({ initialQuotes }: AdminQuotesViewProps) {
  const { success, error } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [newNote, setNewNote] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const statuses = ["NEW", "CONTACTED", "IN_PROGRESS", "QUOTED", "CONVERTED", "CLOSED"];

  const statusColorMap: Record<string, string> = {
    NEW: "bg-blue-950 text-blue-400 border-blue-800",
    CONTACTED: "bg-amber-950 text-amber-400 border-amber-800",
    IN_PROGRESS: "bg-purple-950 text-purple-400 border-purple-800",
    QUOTED: "bg-emerald-950 text-emerald-400 border-emerald-800",
    CONVERTED: "bg-teal-950 text-teal-400 border-teal-800",
    CLOSED: "bg-slate-800 text-slate-400 border-slate-700",
  };

  const handleUpdateStatus = async (quoteId: string, newStatus: string) => {
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status: newStatus });
      }
      success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      error(err.message || "Failed to update");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote || !newNote.trim()) return;

    setNoteLoading(true);
    try {
      const res = await fetch(`/api/quotes/${selectedQuote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: newNote.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to add note");

      setSelectedQuote(data.quote);
      setQuotes((prev) =>
        prev.map((q) => (q.id === selectedQuote.id ? data.quote : q))
      );
      setNewNote("");
      success("Internal estimation note added");
    } catch (err: any) {
      error(err.message || "Failed to save note");
    } finally {
      setNoteLoading(false);
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete quote");

      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
      success("Quote request archived / removed");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  const filtered = quotes.filter((q) => {
    if (statusFilter !== "ALL" && q.status !== statusFilter) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        q.name.toLowerCase().includes(query) ||
        q.company.toLowerCase().includes(query) ||
        q.email.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
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
            Commercial Pipeline
          </span>
          <h1 className="text-2xl font-extrabold text-white font-heading">
            Quote Requests (RFQ) Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming project inquiries, assign commercial estimates, and track customer conversion.
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
            placeholder="Search by company, client or RFQ ref..."
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
            All ({quotes.length})
          </button>
          {statuses.map((st) => {
            const count = quotes.filter((q) => q.status === st).length;
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

      {/* Grid: Quotes List (Left) + Detail & Notes Drawer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quotes List (7 or 12 Cols depending on selection) */}
        <div className={selectedQuote ? "lg:col-span-6 space-y-3" : "lg:col-span-12 space-y-3"}>
          {filtered.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              No quote requests match your filter.
            </div>
          ) : (
            filtered.map((q) => {
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`bg-slate-900 border p-5 rounded-2xl cursor-pointer transition-all duration-200 space-y-3 ${
                    isSelected
                      ? "border-brand-500 bg-slate-800/80 shadow-lg"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-400">
                        #{q.id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                          statusColorMap[q.status] || "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{formatDate(q.createdAt)}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{q.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{q.company}</p>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span>
                      {q.product ? q.product.name : "Custom Compound"} &bull;{" "}
                      <strong>{q.quantity}</strong>
                    </span>
                    <span className="text-brand-400 font-semibold inline-flex items-center gap-1 text-[11px]">
                      Inspect &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Quote Detail & Notes Panel */}
        {selectedQuote && (
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-400 uppercase">
                  RFQ Detail: #{selectedQuote.id.slice(-6).toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white font-heading">
                  {selectedQuote.company}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-400">
                Update Commercial Status:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedQuote.id, st)}
                    disabled={statusLoading}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition border ${
                      selectedQuote.status === st
                        ? "bg-brand-600 text-white border-brand-500 shadow"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Client Info Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Contact Name</span>
                <span className="text-white font-bold">{selectedQuote.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address</span>
                <a href={`mailto:${selectedQuote.email}`} className="text-brand-400 hover:underline">
                  {selectedQuote.email}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block">Phone</span>
                <a href={`tel:${selectedQuote.phone}`} className="text-slate-200">
                  {selectedQuote.phone}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block">Destination</span>
                <span className="text-slate-200">{selectedQuote.country || "USA"}</span>
              </div>
            </div>

            {/* Scope & Requirements */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase block mb-0.5">
                  Product / Sizing:
                </span>
                <span className="text-white font-semibold">
                  {selectedQuote.product ? selectedQuote.product.name : "Custom Compound"} (Volume: {selectedQuote.quantity})
                </span>
              </div>

              {selectedQuote.requirements && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 font-bold block mb-1">Specifications:</span>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {selectedQuote.requirements}
                  </p>
                </div>
              )}

              {selectedQuote.message && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 font-bold block mb-1">Client Message:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedQuote.message}</p>
                </div>
              )}

              {selectedQuote.attachmentUrl && (
                <div className="pt-1">
                  <a
                    href={selectedQuote.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:underline font-bold text-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Uploaded Drawing / Specs
                  </a>
                </div>
              )}
            </div>

            {/* Internal Estimator Notes */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-400" /> Internal Factory Notes
              </h4>

              {selectedQuote.notes && selectedQuote.notes.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedQuote.notes.map((n) => (
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
                <p className="text-[11px] text-slate-500 italic">No internal notes added yet.</p>
              )}

              {/* Add Note Input */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add estimator note or quote reference..."
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

            {/* Archive / Delete Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleDeleteQuote(selectedQuote.id)}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Archive RFQ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
