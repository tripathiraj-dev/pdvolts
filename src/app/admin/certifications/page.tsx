import React from "react";
import prisma from "@/lib/prisma";
import AdminCertificationsView from "@/components/admin/AdminCertificationsView";

export const dynamic = "force-dynamic";

export default async function AdminCertificationsPage() {
  const certs = await prisma.certification.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminCertificationsView certifications={certs as any} />;
}
