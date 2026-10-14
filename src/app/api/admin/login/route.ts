import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas";
import {
  verifyAdminCredentials,
  signAdminToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);

    // Rate-limit: 5 attempts per 15 minutes per IP
    const rateCheck = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again after 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const isValid = await verifyAdminCredentials(email, password);

    if (!isValid) {
      // Generic error on failure
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate signed JWT
    const token = await signAdminToken(email);

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
