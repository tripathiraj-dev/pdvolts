import React from "react";
import prisma from "@/lib/prisma";
import AdminCareersView from "@/components/admin/AdminCareersView";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      applications: true,
    },
  });

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      career: {
        select: {
          id: true,
          title: true,
          department: true,
        },
      },
    },
  });

  return <AdminCareersView careers={careers as any} applications={applications as any} />;
}
