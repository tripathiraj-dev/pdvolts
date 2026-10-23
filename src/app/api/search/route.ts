import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({
        products: [],
        blogs: [],
        faqs: [],
      });
    }

    const [products, blogs, faqs] = await Promise.all([
      prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
            { material: { contains: q } },
            { sku: { contains: q } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          category: { select: { name: true } },
          images: { take: 1, select: { url: true } },
        },
      }),
      prisma.blogPost.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { tags: { contains: q } },
          ],
        },
        take: 4,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
        },
      }),
      prisma.faq.findMany({
        where: {
          isPublished: true,
          OR: [
            { question: { contains: q } },
            { answer: { contains: q } },
          ],
        },
        take: 4,
        select: {
          id: true,
          question: true,
          answer: true,
          category: true,
        },
      }),
    ]);

    return NextResponse.json({
      products,
      blogs,
      faqs,
    });
  } catch (error) {
    console.error("Global search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
