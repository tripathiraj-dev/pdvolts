import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  order: z.number().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin required." }, { status: 403 });
    }

    const body = await req.json();
    const result = categorySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    const category = await prisma.productCategory.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        image: data.image || null,
        order: data.order ?? 0,
      },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
