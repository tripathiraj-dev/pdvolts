import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const applicationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  resumeUrl: z.string().min(1, "Resume attachment is required"),
  coverLetter: z.string().optional().nullable(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = applicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const job = await prisma.career.findUnique({
      where: { id: params.id },
    });

    if (!job || !job.isActive) {
      return NextResponse.json({ error: "This position is no longer accepting applications" }, { status: 404 });
    }

    const data = result.data;
    const application = await prisma.jobApplication.create({
      data: {
        careerId: params.id,
        fullName: data.fullName,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter || null,
        status: "NEW",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully",
        applicationId: application.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply job error:", error);
    return NextResponse.json({ error: "Failed to submit job application" }, { status: 500 });
  }
}
