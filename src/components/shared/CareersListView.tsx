"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import CareerApplyModal from "./CareerApplyModal";

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  description: string;
  requirements: string;
  responsibilities: string;
  salaryInfo: string | null;
  deadline: string | null;
}

interface CareersListViewProps {
  careers: Career[];
}

export default function CareersListView({ careers }: CareersListViewProps) {
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);

  return (
    <>
      <div className="space-y-6">
        {careers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 font-heading">
              No Current Openings
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Our hiring pipelines are currently filled. Please check back regularly or email your
              resume directly to careers@pdvolts.com.
            </p>
          </div>
        ) : (
          careers.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition space-y-6"
            >
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                      {job.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                      {job.employmentType}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading pt-1">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {job.experience}
                    </span>
                    {job.salaryInfo && (
                      <span className="flex items-center gap-1 text-slate-700 font-semibold">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {job.salaryInfo}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="shrink-0 px-6 py-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow transition flex items-center gap-1.5"
                >
                  Apply for Position <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Job Description */}
              <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>

              {/* Responsibilities & Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs">
                {job.responsibilities && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                      Key Responsibilities
                    </h4>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {job.responsibilities}
                    </p>
                  </div>
                )}
                {job.requirements && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                      Qualifications & Skills
                    </h4>
                    <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <CareerApplyModal career={selectedJob} onClose={() => setSelectedJob(null)} />
    </>
  );
}
