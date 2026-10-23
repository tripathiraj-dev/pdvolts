import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().min(5, "Excerpt is required"),
  content: z.string().min(20, "Content is required"),
  coverImage: z.string().optional().nullable(),
  category: z.string().min(2, "Category is required"),
  tags: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const adminMode = searchParams.get("admin") === "true";

    const where: any = {};
    if (!adminMode) {
      where.isPublished = true;
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Fetch blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch blog articles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const body = await req.json();
    const result = blogSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;
    let baseSlug = data.slug ? slugify(data.slug) : slugify(data.title);

    const existing = await prisma.blogPost.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: baseSlug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        category: data.category,
        tags: data.tags || null,
        isPublished: data.isPublished ?? true,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
