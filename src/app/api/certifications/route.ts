import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const certs = await prisma.certification.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ certifications: certs });
  } catch (error) {
    console.error("Fetch certifications error:", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, issuingBody, certificateNumber, validUntil, fileUrl, imageUrl, description, isFeatured } = body;

    if (!title || !issuingBody) {
      return NextResponse.json({ error: "Title and issuing body are required" }, { status: 400 });
    }

    const cert = await prisma.certification.create({
      data: {
        title,
        issuingBody,
        certificateNumber: certificateNumber || null,
        validUntil: validUntil || null,
        fileUrl: fileUrl || null,
        imageUrl: imageUrl || null,
        description: description || null,
        isFeatured: isFeatured ?? true,
      },
    });

    return NextResponse.json({ success: true, certification: cert }, { status: 201 });
  } catch (error) {
    console.error("Create certification error:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
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

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Certification removed" });
  } catch (error) {
    console.error("Delete certification error:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
