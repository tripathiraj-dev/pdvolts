import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminProductsTable from "@/components/admin/AdminProductsTable";

export const metadata: Metadata = {
  title: "Product Catalog Management | Admin CMS",
};

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        images: { orderBy: { order: "asc" } },
      },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <AdminProductsTable products={products as any} categories={categories} />
    </div>
  );
}
