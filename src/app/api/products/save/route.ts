import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const saved = await prisma.savedProduct.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: {
            category: true,
            images: { take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ saved: saved.map((s) => s.product) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch saved products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { productId } = body;

    const existing = await prisma.savedProduct.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.savedProduct.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: "Product removed from saved items" });
    }

    await prisma.savedProduct.create({
      data: {
        userId: session.id,
        productId,
      },
    });

    return NextResponse.json({ saved: true, message: "Product bookmarked to dashboard" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to bookmark product" }, { status: 500 });
  }
}
