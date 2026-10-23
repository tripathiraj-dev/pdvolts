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

    const downloads = await prisma.download.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ downloads });
  } catch (error) {
    console.error("Fetch downloads error:", error);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, category, description, fileUrl, fileSize, isPublished } = body;

    if (!title || !fileUrl || !category) {
      return NextResponse.json({ error: "Title, category, and file URL are required" }, { status: 400 });
    }

    const item = await prisma.download.create({
      data: {
        title,
        category,
        description: description || null,
        fileUrl,
        fileSize: fileSize || null,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, download: item }, { status: 201 });
  } catch (error) {
    console.error("Create download error:", error);
    return NextResponse.json({ error: "Failed to create download item" }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.download.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Download removed" });
  } catch (error) {
    console.error("Delete download error:", error);
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 });
  }
}
