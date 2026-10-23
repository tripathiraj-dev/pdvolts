import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const admin = searchParams.get("admin") === "true";

    const where: any = {};
    if (!admin) where.isPublished = true;
    if (category && category !== "ALL") where.category = category;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, imageUrl, isPublished, order } = body;

    if (!title || !imageUrl || !category) {
      return NextResponse.json({ error: "Title, category, and image are required" }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        title,
        description: description || null,
        category,
        imageUrl,
        isPublished: isPublished ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: "Failed to add gallery image" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.galleryImage.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Gallery image removed" });
  } catch (error) {
    console.error("Delete gallery image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
