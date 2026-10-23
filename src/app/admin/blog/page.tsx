import React from "react";
import prisma from "@/lib/prisma";
import AdminBlogTable from "@/components/admin/AdminBlogTable";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminBlogTable posts={posts as any} />
    </div>
  );
}
