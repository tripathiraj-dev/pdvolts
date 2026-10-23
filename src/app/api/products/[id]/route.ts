import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        specifications: { orderBy: { order: "asc" } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      categoryId,
      shortDescription,
      fullDescription,
      sku,
      moq,
      material,
      size,
      color,
      voltageRating,
      application,
      packaging,
      isFeatured,
      isActive,
      seoTitle,
      seoDescription,
      datasheetUrl,
      images,
      specifications,
    } = body;

    // First delete old specs and images if new ones are provided
    if (specifications) {
      await prisma.productSpecification.deleteMany({
        where: { productId: params.id },
      });
    }

    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: params.id },
      });
    }

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug: slug ? slugify(slug) : undefined,
        categoryId,
        shortDescription,
        fullDescription,
        sku: sku || null,
        moq: moq || null,
        material: material || null,
        size: size || null,
        color: color || null,
        voltageRating: voltageRating || null,
        application: application || null,
        packaging: packaging || null,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        datasheetUrl: datasheetUrl || null,
        images: images && images.length > 0 ? {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            altText: img.altText || name,
            isPrimary: img.isPrimary ?? idx === 0,
            order: img.order ?? idx,
          })),
        } : undefined,
        specifications: specifications && specifications.length > 0 ? {
          create: specifications.map((s: any, idx: number) => ({
            key: s.key,
            value: s.value,
            unit: s.unit || null,
            order: s.order ?? idx,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
        specifications: true,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
