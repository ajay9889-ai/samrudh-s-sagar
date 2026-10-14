import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_token";
const JWT_SECRET = process.env.JWT_SECRET || "default-dev-secret-do-not-use-in-prod-32-chars-long";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminJwtPayload {
  email: string;
  role: "admin";
}

/**
 * Sign a 7-day expiration JWT for the admin
 */
export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verify admin JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === "admin" && typeof payload.email === "string") {
      return {
        email: payload.email,
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if the current request has a valid admin session cookie
 */
export async function getAdminSession(): Promise<AdminJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Verify admin credentials against environment variables
 */
export async function verifyAdminCredentials(
  emailInput: string,
  passwordInput: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not configured in environment variables.");
    return false;
  }

  // Constant-time style string comparison for email
  if (emailInput.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return false;
  }

  return bcrypt.compare(passwordInput, adminPasswordHash);
}

/**
 * Check Origin header for CSRF protection on mutation requests
 */
export function verifyCsrfOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    // If no origin or host, check referer as fallback
    const referer = request.headers.get("referer");
    if (!referer) return true; // Allow non-browser clients or same-origin direct
    try {
      const refererUrl = new URL(referer);
      return refererUrl.host === host;
    } catch {
      return false;
    }
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}
