import React from "react";
import prisma from "@/lib/prisma";
import AdminIndustriesView from "@/components/admin/AdminIndustriesView";

export const dynamic = "force-dynamic";

export default async function AdminIndustriesPage() {
  const industries = await prisma.industry.findMany({
    orderBy: { order: "asc" },
  });

  return <AdminIndustriesView industries={industries as any} />;
}
