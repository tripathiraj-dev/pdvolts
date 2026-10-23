import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminEnquiriesView from "@/components/admin/AdminEnquiriesView";

export const metadata: Metadata = {
  title: "Contact Inquiries Management | Admin CMS",
};

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div>
      <AdminEnquiriesView initialEnquiries={enquiries as any} />
    </div>
  );
}
