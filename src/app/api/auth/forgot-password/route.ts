import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email } = result.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always respond with success message to prevent user email enumeration attack
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, password reset instructions have been dispatched.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: expiry,
      },
    });

    sendPasswordResetEmail(user.email, resetToken).catch((err) =>
      console.error("Failed to send password reset email:", err)
    );

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, password reset instructions have been dispatched.",
    });
  } catch (error) {
    console.error("Forgot Password API Error:", error);
    return NextResponse.json({ error: "Failed to process password reset request." }, { status: 500 });
  }
}
