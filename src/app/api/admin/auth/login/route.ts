import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { timingSafeEqual } from "node:crypto";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_JWT_AUDIENCE,
  ADMIN_JWT_ISSUER,
  getAdminJwtSecret,
} from "@/lib/adminSession";
import {
  clearFailedLogins,
  loginRateLimit,
  recordFailedLogin,
} from "@/lib/adminLoginRateLimit";

function requestIdentifier(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";
}

function secureEqual(left: string | undefined, right: string) {
  if (!left) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(req: NextRequest) {
  const identifier = requestIdentifier(req);
  const limit = loginRateLimit(identifier);
  if (limit.blocked) {
    return NextResponse.json(
      { error: "TOO_MANY_ATTEMPTS", retry_after: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "AUTH_NOT_CONFIGURED" }, { status: 500 });
  }

  if (
    !secureEqual(email, adminEmail) ||
    !secureEqual(password, adminPassword)
  ) {
    const failed = recordFailedLogin(identifier);
    return NextResponse.json(
      { error: "INVALID_CREDENTIALS", remaining_attempts: failed.remainingAttempts },
      { status: failed.blocked ? 429 : 401 },
    );
  }

  clearFailedLogins(identifier);

  const token = await new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ADMIN_JWT_ISSUER)
    .setAudience(ADMIN_JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAdminJwtSecret());

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8h
    path: "/",
  });

  return res;
}
