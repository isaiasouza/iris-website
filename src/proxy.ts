import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/adminSession";
const LOGIN_PATH = "/admin/login";

function redirectToLogin(req: NextRequest, clearCookie = false) {
  const url = req.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = "";
  url.searchParams.set("from", `${req.nextUrl.pathname}${req.nextUrl.search}`);
  const response = NextResponse.redirect(url);
  if (clearCookie) {
    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return response;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Deixa a página de login passar sem verificação
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);

  if (!cookie?.value) {
    return redirectToLogin(req);
  }

  try {
    await verifyAdminSession(cookie.value);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req, true);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
