"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Users, Search, Shield, UserCheck, UserX, Check, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: string;
  isActive: boolean;
  createdAt: string | Date;
  _count?: { quoteRequests: number; enquiries: number };
}

interface AdminUsersViewProps {
  initialUsers: UserItem[];
  currentUserId?: string;
}

export default function AdminUsersView({ initialUsers, currentUserId }: AdminUsersViewProps) {
  const { success, error } = useToast();
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const roles = ["USER", "ADMIN", "SUPER_ADMIN"];

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      success("User role updated successfully");
    } catch (err: any) {
      error(err.message || "Failed to update role");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setLoadingId(userId);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle status");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u))
      );
      success(`User account ${!currentStatus ? "activated" : "deactivated"}`);
    } catch (err: any) {
      error(err.message || "Failed to toggle status");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.company && u.company.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
          Security & Access
        </span>
        <h1 className="text-2xl font-extrabold text-white font-heading">
          User & Client Account Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage corporate user accounts, grant administrative permissions, and deactivate accounts.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company, email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 text-xs focus:ring-2 focus:ring-brand-500 outline-none"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase bg-slate-950/60">
                <th className="py-3 px-4">User & Organization</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((u) => {
                const isBusy = loadingId === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">
                          {u.company || "Independent Sourcing"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      <div>{u.email}</div>
                      {u.phone && <div className="text-[10px] text-slate-500">{u.phone}</div>}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        disabled={isBusy}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border outline-none cursor-pointer ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-purple-950 text-purple-300 border-purple-800"
                            : u.role === "ADMIN"
                            ? "bg-blue-950 text-blue-300 border-blue-800"
                            : "bg-slate-950 text-slate-300 border-slate-800"
                        }`}
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      <span>{u._count?.quoteRequests || 0} RFQs</span> &bull;{" "}
                      <span>{u._count?.enquiries || 0} Enquiries</span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                          u.isActive
                            ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                            : "bg-rose-950 text-rose-300 border-rose-800"
                        }`}
                      >
                        {u.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        disabled={isBusy}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1 ${
                          u.isActive
                            ? "bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800"
                            : "bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                        }`}
                      >
                        {isBusy ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : u.isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Activate
                          </>
                        )}
                      </button>
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
