import React from "react";
import prisma from "@/lib/prisma";
import AdminDownloadsView from "@/components/admin/AdminDownloadsView";

export const dynamic = "force-dynamic";

export default async function AdminDownloadsPage() {
  const downloads = await prisma.download.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminDownloadsView downloads={downloads as any} />;
}
