import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin") === "true";
    const category = searchParams.get("category");

    const where: any = {};
    if (!admin) where.isPublished = true;
    if (category && category !== "ALL") where.category = category;

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("Fetch faqs error:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { question, answer, category, order, isPublished } = body;

    if (!question || !answer || !category) {
      return NextResponse.json({ error: "Question, answer, and category are required" }, { status: 400 });
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        category,
        order: order ?? 0,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error) {
    console.error("Create faq error:", error);
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, question, answer, category, order, isPublished } = body;

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        order: order !== undefined ? Number(order) : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
      },
    });

    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("Update faq error:", error);
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
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

    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("Delete faq error:", error);
    return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
  }
}
