import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin") === "true";

    const where: any = {};
    if (!admin) where.isPublished = true;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { clientName, company, position, content, rating, avatarUrl, isPublished, order } = body;

    if (!clientName || !company || !content) {
      return NextResponse.json({ error: "Client name, company, and testimonial content are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        company,
        position: position || "Procurement Director",
        content,
        rating: rating ? Number(rating) : 5,
        avatarUrl: avatarUrl || null,
        isPublished: isPublished ?? true,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, testimonial }, { status: 201 });
  } catch (error) {
    console.error("Create testimonial error:", error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, clientName, company, position, content, rating, avatarUrl, isPublished, order } = body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        clientName,
        company,
        position,
        content,
        rating: rating !== undefined ? Number(rating) : undefined,
        avatarUrl: avatarUrl || null,
        isPublished: isPublished !== undefined ? isPublished : undefined,
        order: order !== undefined ? Number(order) : undefined,
      },
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("Update testimonial error:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
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

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Testimonial removed" });
  } catch (error) {
    console.error("Delete testimonial error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
