import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Create Product | Admin CMS",
};

export default async function AdminNewProductPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <ProductForm categories={categories} isEdit={false} />
    </div>
  );
}
