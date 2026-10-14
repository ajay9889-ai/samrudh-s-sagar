import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);

    // Rate-limit: 3 submissions per hour per IP
    const rateCheck = checkRateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Too many contact submissions. Please try again later.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid submission data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, message, honeypot } = parsed.data;

    // Honeypot check: if filled, reject silently or return friendly success without saving
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Thanks, your message has been sent.",
      });
    }

    // Save message to database
    const saved = await prisma.message.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
      },
    });

    // Send email notification (keeps saved message even if email fails)
    try {
      await sendContactNotification({
        name: saved.name,
        email: saved.email,
        message: saved.message,
        createdAt: saved.createdAt,
      });
    } catch (emailErr) {
      console.error("Email notification error (message kept in DB):", emailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thanks, your message has been sent.",
      id: saved.id,
    });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
