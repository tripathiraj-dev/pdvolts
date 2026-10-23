import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit Product | Admin CMS",
};

export default async function AdminEditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: "asc" } },
        specifications: { orderBy: { order: "asc" } },
      },
    }),
    prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <ProductForm initialProduct={product} categories={categories} isEdit={true} />
    </div>
  );
}
