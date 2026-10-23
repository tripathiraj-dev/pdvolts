import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <BlogForm initialPost={post} isEdit={true} />
    </div>
  );
}
