import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ industries });
  } catch (error) {
    console.error("Fetch industries error:", error);
    return NextResponse.json({ error: "Failed to fetch industries" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, summary, description, icon, imageUrl, order, isPublished } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const industry = await prisma.industry.create({
      data: {
        title,
        slug: slug ? slugify(slug) : slugify(title),
        summary: summary || "",
        description,
        icon: icon || "Zap",
        imageUrl: imageUrl || null,
        order: order ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, industry }, { status: 201 });
  } catch (error) {
    console.error("Create industry error:", error);
    return NextResponse.json({ error: "Failed to create industry" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await req.json();
    const { title, slug, summary, description, icon, imageUrl, order, isPublished } = body;

    const updated = await prisma.industry.update({
      where: { id },
      data: {
        title,
        slug: slug ? slugify(slug) : undefined,
        summary,
        description,
        icon,
        imageUrl,
        order: order !== undefined ? Number(order) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
      },
    });

    return NextResponse.json({ success: true, industry: updated });
  } catch (error) {
    console.error("Update industry error:", error);
    return NextResponse.json({ error: "Failed to update industry" }, { status: 500 });
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

    await prisma.industry.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Industry removed" });
  } catch (error) {
    console.error("Delete industry error:", error);
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}

