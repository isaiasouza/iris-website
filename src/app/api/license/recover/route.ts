import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLicenseRecoveryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: { email?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  }

  const { data: licenses } = await supabaseAdmin
    .from("licenses")
    .select("id, license_key, plan, status, expires_at, max_devices, name")
    .eq("email", email)
    .order("created_at", { ascending: false });

  if (!licenses || licenses.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const ids = licenses.map((license) => license.id);
  const { data: devices } = await supabaseAdmin
    .from("devices")
    .select("license_id")
    .in("license_id", ids)
    .eq("is_active", true);

  const activeCounts = new Map<string, number>();
  for (const device of devices ?? []) {
    activeCounts.set(device.license_id, (activeCounts.get(device.license_id) ?? 0) + 1);
  }

  await sendLicenseRecoveryEmail({
    to: email,
    name: licenses[0].name ?? "Cliente",
    licenses: licenses.map((license) => ({
      licenseKey: license.license_key,
      plan: license.plan,
      status: license.status,
      expiresAt: license.expires_at,
      devicesUsed: activeCounts.get(license.id) ?? 0,
      devicesMax: license.max_devices,
    })),
  });

  return NextResponse.json({ ok: true });
}
