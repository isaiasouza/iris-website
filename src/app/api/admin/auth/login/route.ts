import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getAdminJwtSecret } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, password } = body;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json(
      { error: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  const token = await new SignJWT({ role: "admin", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAdminJwtSecret());

  const res = NextResponse.json({ ok: true });
  res.cookies.set("iris_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8h
    path: "/",
  });

  return res;
}
