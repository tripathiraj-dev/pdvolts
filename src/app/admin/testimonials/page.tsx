import React from "react";
import prisma from "@/lib/prisma";
import AdminTestimonialsView from "@/components/admin/AdminTestimonialsView";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
  });

  return <AdminTestimonialsView testimonials={testimonials as any} />;
}
