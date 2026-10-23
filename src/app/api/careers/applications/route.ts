import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const applications = await prisma.jobApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        career: { select: { id: true, title: true, department: true } },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
