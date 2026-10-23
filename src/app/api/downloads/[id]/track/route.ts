import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.download.update({
      where: { id: params.id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to track download" }, { status: 500 });
  }
}
