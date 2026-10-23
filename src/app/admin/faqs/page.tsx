import React from "react";
import prisma from "@/lib/prisma";
import AdminFaqsView from "@/components/admin/AdminFaqsView";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: "asc" },
  });

  return <AdminFaqsView faqs={faqs as any} />;
}
