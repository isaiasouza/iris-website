import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "iris_admin_session";

export function getAdminJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (!cookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await jwtVerify(cookie.value, getAdminJwtSecret());
    return null; // OK
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
