import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!enquiry) return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
    if (!isAdmin && enquiry.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("Get enquiry error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiry" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { status, noteContent } = body;

    if (status) {
      await prisma.enquiry.update({
        where: { id: params.id },
        data: { status },
      });
    }

    if (noteContent && noteContent.trim()) {
      await prisma.enquiryNote.create({
        data: {
          enquiryId: params.id,
          authorName: session.name,
          content: noteContent.trim(),
        },
      });
    }

    const updated = await prisma.enquiry.findUnique({
      where: { id: params.id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.enquiry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
