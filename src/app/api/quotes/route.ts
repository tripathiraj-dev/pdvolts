import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { sendQuoteConfirmationEmail, sendAdminQuoteNotificationEmail } from "@/lib/email";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Contact phone is required"),
  country: z.string().optional(),
  productId: z.string().optional().nullable(),
  quantity: z.string().min(1, "Quantity or volume is required"),
  requirements: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  attachmentUrl: z.string().optional().nullable(),
});

// POST: Submit a new Quote Request (RFQ)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = quoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const session = await getSessionUser();
    const data = result.data;

    const newQuote = await prisma.quoteRequest.create({
      data: {
        userId: session?.id || null,
        name: data.name,
        company: data.company,
        email: data.email.toLowerCase().trim(),
        phone: data.phone,
        country: data.country || "United States",
        productId: data.productId || null,
        quantity: data.quantity,
        requirements: data.requirements || null,
        message: data.message || null,
        attachmentUrl: data.attachmentUrl || null,
        status: "NEW",
      },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    });

    // Send confirmation email to client
    sendQuoteConfirmationEmail(
      newQuote.email,
      newQuote.name,
      newQuote.id,
      newQuote.quantity,
      newQuote.requirements || undefined
    ).catch((err) => console.error("Quote email confirmation failed:", err));

    // Send instant alert email to Admin / Owner
    sendAdminQuoteNotificationEmail({
      id: newQuote.id,
      name: newQuote.name,
      company: newQuote.company,
      email: newQuote.email,
      phone: newQuote.phone,
      country: newQuote.country,
      productName: newQuote.product?.name || null,
      quantity: newQuote.quantity,
      requirements: newQuote.requirements,
      message: newQuote.message,
      createdAt: newQuote.createdAt,
    }).catch((err) => console.error("Admin quote notification failed:", err));

    return NextResponse.json({ success: true, quote: newQuote }, { status: 201 });
  } catch (error) {
    console.error("Quote Request Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit quote request" }, { status: 500 });
  }
}

// GET: Retrieve quote requests (Admin sees all, authenticated user sees their own)
export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";

    // Build filter
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
        { id: { contains: search } },
      ];
    }

    const quotes = await prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, slug: true, sku: true } },
        notes: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Fetch Quotes Error:", error);
    return NextResponse.json({ error: "Failed to retrieve quotes" }, { status: 500 });
  }
}
