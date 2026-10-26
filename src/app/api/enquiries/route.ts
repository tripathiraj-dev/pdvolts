import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { sendContactEnquiryReceiptEmail, sendAdminEnquiryNotificationEmail } from "@/lib/email";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachmentUrl: z.string().optional().nullable(),
});

// POST: Public contact message submission
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = enquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const session = await getSessionUser();
    const data = result.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        userId: session?.id || null,
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject,
        message: data.message,
        attachmentUrl: data.attachmentUrl || null,
        status: "NEW",
      },
    });

    sendContactEnquiryReceiptEmail(enquiry.email, enquiry.name, enquiry.subject).catch((err) =>
      console.error("Failed to send contact receipt email:", err)
    );

    sendAdminEnquiryNotificationEmail(enquiry).catch((err) =>
      console.error("Failed to send admin enquiry notification email:", err)
    );

    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

// GET: Admin enquiries list (or user's own enquiries)
export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

    const where: any = {};
    if (!isAdmin) {
      where.userId = session.id;
    }
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search && isAdmin) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { email: { contains: search } },
        { subject: { contains: search } },
      ];
    }

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}
