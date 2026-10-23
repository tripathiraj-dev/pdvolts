import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const productCreateSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  shortDescription: z.string().min(5, "Short description is required"),
  fullDescription: z.string().min(10, "Full description is required"),
  sku: z.string().optional().nullable(),
  moq: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  voltageRating: z.string().optional().nullable(),
  application: z.string().optional().nullable(),
  packaging: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  datasheetUrl: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string(),
    altText: z.string().optional(),
    isPrimary: z.boolean().optional(),
    order: z.number().optional(),
  })).optional(),
  specifications: z.array(z.object({
    key: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    order: z.number().optional(),
  })).optional(),
});

// GET /api/products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const activeOnly = searchParams.get("active") !== "all";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const where: any = {};

    if (activeOnly) {
      where.isActive = true;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortDescription: { contains: search } },
        { sku: { contains: search } },
        { material: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        specifications: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const result = productCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const data = result.data;
    let baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Check slug collision
    const existing = await prisma.product.findUnique({ where: { slug: baseSlug } });
    if (existing) {
      baseSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: baseSlug,
        categoryId: data.categoryId,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        sku: data.sku || null,
        moq: data.moq || null,
        material: data.material || null,
        size: data.size || null,
        color: data.color || null,
        voltageRating: data.voltageRating || null,
        application: data.application || null,
        packaging: data.packaging || null,
        isFeatured: data.isFeatured ?? false,
        isActive: data.isActive ?? true,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        datasheetUrl: data.datasheetUrl || null,
        images: data.images && data.images.length > 0 ? {
          create: data.images.map((img, i) => ({
            url: img.url,
            altText: img.altText || data.name,
            isPrimary: img.isPrimary ?? i === 0,
            order: img.order ?? i,
          })),
        } : undefined,
        specifications: data.specifications && data.specifications.length > 0 ? {
          create: data.specifications.map((spec, i) => ({
            key: spec.key,
            value: spec.value,
            unit: spec.unit || null,
            order: spec.order ?? i,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
