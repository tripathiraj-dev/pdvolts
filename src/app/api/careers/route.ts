import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin") === "true";

    const where: any = {};
    if (!admin) where.isActive = true;

    const careers = await prisma.career.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({ careers });
  } catch (error) {
    console.error("Fetch careers error:", error);
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      department,
      location,
      employmentType,
      experience,
      description,
      requirements,
      responsibilities,
      salaryInfo,
      deadline,
      isActive,
    } = body;

    if (!title || !department || !location || !description) {
      return NextResponse.json({ error: "Title, department, location, and description are required" }, { status: 400 });
    }

    const job = await prisma.career.create({
      data: {
        title,
        department,
        location,
        employmentType: employmentType || "Full-Time",
        experience: experience || "Entry / Mid Level",
        description,
        requirements: requirements || "",
        responsibilities: responsibilities || "",
        salaryInfo: salaryInfo || null,
        deadline: deadline || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, career: job }, { status: 201 });
  } catch (error) {
    console.error("Create career error:", error);
    return NextResponse.json({ error: "Failed to create career position" }, { status: 500 });
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

    await prisma.career.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Career deleted" });
  } catch (error) {
    console.error("Delete career error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
