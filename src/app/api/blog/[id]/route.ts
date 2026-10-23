import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Get blog post error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, category, tags, isPublished, seoTitle, seoDescription } = body;

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title,
        slug: slug ? slugify(slug) : undefined,
        excerpt,
        content,
        coverImage: coverImage || null,
        category,
        tags: tags || null,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
