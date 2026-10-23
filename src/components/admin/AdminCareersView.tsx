"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Plus, Trash2, Briefcase, Users, FileText, CheckCircle, Clock, X, ExternalLink, Loader2 } from "lucide-react";
import { formatDate, slugify } from "@/lib/utils";

interface CareerItem {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string | null;
  openings: number;
  description: string;
  isActive: boolean;
  applications?: any[];
}

interface ApplicationItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string | null;
  resumeUrl: string;
  status: string;
  createdAt: string | Date;
  career: {
    id: string;
    title: string;
    department: string;
  };
}

interface AdminCareersViewProps {
  careers: CareerItem[];
  applications: ApplicationItem[];
}

export default function AdminCareersView({
  careers: initialCareers,
  applications: initialApplications,
}: AdminCareersViewProps) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<"positions" | "applications">("positions");
  const [careers, setCareers] = useState<CareerItem[]>(initialCareers);
  const [applications, setApplications] = useState<ApplicationItem[]>(initialApplications);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    department: "Engineering & Production",
    location: "Manufacturing Plant, Gujarat",
    type: "Full-time",
    experience: "3-5 years",
    openings: 1,
    description: "",
    requirements: "",
    responsibilities: "",
    salaryRange: "Best in industry",
    isActive: true,
  });

  const departments = [
    "Engineering & Production",
    "Quality Assurance",
    "Maintenance & Electrical",
    "Supply Chain & Logistics",
    "Sales & Business Development",
    "Human Resources & Admin",
  ];

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        slug: form.slug || slugify(form.title),
      };

      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create position");
      }

      const newCareer = await res.json();
      setCareers([newCareer, ...careers]);
      setIsModalOpen(false);
      setForm({
        title: "",
        slug: "",
        department: "Engineering & Production",
        location: "Manufacturing Plant, Gujarat",
        type: "Full-time",
        experience: "3-5 years",
        openings: 1,
        description: "",
        requirements: "",
        responsibilities: "",
        salaryRange: "Best in industry",
        isActive: true,
      });
      success("Job position posted successfully");
    } catch (err: any) {
      error(err.message || "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCareerActive = async (career: CareerItem) => {
    try {
      const res = await fetch(`/api/careers/${career.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !career.isActive }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setCareers((prev) =>
        prev.map((c) => (c.id === career.id ? { ...c, isActive: !c.isActive } : c))
      );
      success(`Position set to ${!career.isActive ? "Active" : "Closed"}`);
    } catch (err: any) {
      error(err.message || "Failed to update position");
    }
  };

  const handleDeleteCareer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    try {
      const res = await fetch(`/api/careers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete position");

      setCareers((prev) => prev.filter((c) => c.id !== id));
      success("Job position removed");
    } catch (err: any) {
      error(err.message || "Failed to delete");
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/careers/applications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status } : a))
      );
      success(`Application status updated to ${status}`);
    } catch (err: any) {
      error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Careers & Recruitment</h1>
          <p className="text-slate-500 text-sm mt-1">Manage open vacancies and candidate job applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("positions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "positions"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Openings ({careers.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "applications"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Applications ({applications.length})
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-600/20"
          >
            <Plus className="w-4 h-4" /> Post Opening
          </button>
        </div>
      </div>

      {activeTab === "positions" ? (
        <div className="space-y-4">
          {careers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No job openings created</h3>
              <p className="text-slate-500 text-sm mt-1">Click Post Opening to publish job opportunities.</p>
            </div>
          ) : (
            careers.map((career) => (
              <div
                key={career.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-slate-900 text-base">{career.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                        career.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {career.isActive ? "Active" : "Closed"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-primary-600">{career.department}</span>
                    <span>•</span>
                    <span>{career.location}</span>
                    <span>•</span>
                    <span>{career.type}</span>
                    <span>•</span>
                    <span>{career.experience || "Freshers / Experienced"}</span>
                    <span>•</span>
                    <span>{career.openings} Openings</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => toggleCareerActive(career)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      career.isActive
                        ? "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {career.isActive ? "Close Job" : "Reopen Job"}
                  </button>
                  <button
                    onClick={() => handleDeleteCareer(career.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Job Opening"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Applications Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-900">No applications received yet</h3>
              <p className="text-slate-500 text-sm mt-1">Applications from prospective candidates will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Resume & Pitch</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div>
                          <p className="font-bold text-slate-900">{app.fullName}</p>
                          <p className="text-xs text-slate-500">{app.email}</p>
                          <p className="text-xs text-slate-500">{app.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 text-xs block">{app.career?.title}</span>
                        <span className="text-[11px] text-slate-400">{app.career?.department}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Resume
                          </a>
                          {app.coverLetter && (
                            <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{app.coverLetter}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">{formatDate(app.createdAt)}</td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={app.status}
                          onChange={(e) => updateAppStatus(app.id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="REVIEWED">Reviewed</option>
                          <option value="SHORTLISTED">Shortlisted</option>
                          <option value="REJECTED">Rejected</option>
                          <option value="HIRED">Hired</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`mailto:${app.email}?subject=Regarding your application for ${app.career?.title}`}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                        >
                          Email
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Position Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Post New Job Opening</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCareer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: slugify(e.target.value),
                    });
                  }}
                  placeholder="e.g. Senior Plastic Injection Molding Engineer"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Job Type
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    placeholder="e.g. 3-5 years"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.openings}
                    onChange={(e) => setForm({ ...form, openings: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Job Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Overview of the position and daily operations..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Key Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  placeholder="• B.Tech in Plastics / Electrical&#10;• 3+ years experience with PLC extruders"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-xs"
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
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
