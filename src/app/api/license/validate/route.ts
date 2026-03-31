import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signValidationToken, tokenExpiresAt } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let body: { license_key: string; hardware_id: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { license_key, hardware_id } = body;
  if (!license_key || !hardware_id) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  // 1. Buscar licença
  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("*")
    .eq("license_key", license_key)
    .single();

  if (!license) {
    return NextResponse.json({ error: "LICENSE_NOT_FOUND" }, { status: 404 });
  }

  // 2. Verificar status e expiração
  if (license.status === "suspended") {
    return NextResponse.json({ error: "LICENSE_SUSPENDED" }, { status: 403 });
  }
  if (license.status === "cancelled") {
    return NextResponse.json({ error: "LICENSE_CANCELLED" }, { status: 403 });
  }
  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    await supabaseAdmin.from("licenses").update({ status: "expired" }).eq("id", license.id);
    return NextResponse.json({ error: "LICENSE_EXPIRED" }, { status: 403 });
  }

  // 3. Verificar que o device está cadastrado e ativo
  const { data: device } = await supabaseAdmin
    .from("devices")
    .select("id")
    .eq("license_id", license.id)
    .eq("hardware_id", hardware_id)
    .eq("is_active", true)
    .single();

  if (!device) {
    return NextResponse.json({ error: "DEVICE_NOT_REGISTERED" }, { status: 403 });
  }

  // 4. Atualizar last_seen_at
  await supabaseAdmin
    .from("devices")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", device.id);

  // 5. Gerar novo token (renovar TTL)
  const expiresAt = tokenExpiresAt();
  const token = await signValidationToken({
    license_id: license.id,
    hardware_id,
    plan: license.plan,
    expires_at: expiresAt.toISOString(),
  });

  await supabaseAdmin.from("validation_tokens").upsert({
    hardware_id,
    license_id: license.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // 6. Audit log
  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "validated",
    hardware_id,
    ip_address: ip,
  });

  return NextResponse.json({
    ok: true,
    plan: license.plan,
    validation_token: token,
    token_expires_at: expiresAt.toISOString(),
    expires_at: license.expires_at,
  });
}
