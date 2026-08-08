import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/adminSession";

export { getAdminJwtSecret } from "@/lib/adminSession";

export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  if (!cookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await verifyAdminSession(cookie.value);
    return null; // OK
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
