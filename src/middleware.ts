import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "iris_admin_session";
const LOGIN_PATH = "/admin/login";

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET ?? "";
  return new TextEncoder().encode(secret);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Deixa a página de login passar sem verificação
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME);

  if (!cookie?.value) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(cookie.value, getSecret());
    return NextResponse.next();
  } catch {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
