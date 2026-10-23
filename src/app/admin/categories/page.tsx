import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import AdminCategoriesView from "@/components/admin/AdminCategoriesView";

export const metadata: Metadata = {
  title: "Category Taxonomy Management | Admin CMS",
};

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div>
      <AdminCategoriesView initialCategories={categories} />
    </div>
  );
}
