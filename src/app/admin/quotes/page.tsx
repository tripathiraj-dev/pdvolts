import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminQuotesView from "@/components/admin/AdminQuotesView";

export const metadata: Metadata = {
  title: "RFQ & Quotes Pipeline | Admin CMS",
};

export const revalidate = 0;

export default async function AdminQuotesPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, sku: true } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div>
      <AdminQuotesView initialQuotes={quotes as any} />
    </div>
  );
}
