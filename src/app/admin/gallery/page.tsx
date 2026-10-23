import React from "react";
import prisma from "@/lib/prisma";
import AdminGalleryView from "@/components/admin/AdminGalleryView";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { order: "asc" },
  });

  return <AdminGalleryView images={images as any} />;
}
