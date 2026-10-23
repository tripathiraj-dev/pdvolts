import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quote = await prisma.quoteRequest.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
    if (!isAdmin && quote.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Get Quote Detail Error:", error);
    return NextResponse.json({ error: "Failed to fetch quote details" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
    }

    const body = await req.json();
    const { status, noteContent } = body;

    // Update status if provided
    if (status) {
      await prisma.quoteRequest.update({
        where: { id: params.id },
        data: { status },
      });
    }

    // Add internal note if provided
    if (noteContent && noteContent.trim()) {
      await prisma.enquiryNote.create({
        data: {
          quoteRequestId: params.id,
          authorName: session.name,
          content: noteContent.trim(),
        },
      });
    }

    const updated = await prisma.quoteRequest.findUnique({
      where: { id: params.id },
      include: {
        product: true,
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error("Update Quote Error:", error);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.quoteRequest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Delete Quote Error:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
