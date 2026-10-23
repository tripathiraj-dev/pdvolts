import React from "react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  position: string;
  content: string;
  rating: number;
  avatarUrl: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
            Client Endorsements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
            What Industrial Partners Say
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            From electrical grid contractors to robotic automation designers, discover why leading
            enterprises trust PdVolts as their primary manufacturing supplier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between relative shadow-sm hover:shadow-md transition"
            >
              <Quote className="w-10 h-10 text-brand-200 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center gap-3">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-brand-700 text-white font-bold text-sm flex items-center justify-center">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.clientName}</h4>
                  <p className="text-xs text-slate-500">
                    {t.position}, <span className="font-medium text-slate-700">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
