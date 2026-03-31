import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Autenticação simples: license_key + email como identificação do titular
// Em produção, usar Supabase Auth session (magic link)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const license_key = searchParams.get("license_key");
  const email = searchParams.get("email");

  if (!license_key || !email) {
    return NextResponse.json(
      { error: "license_key e email são obrigatórios" },
      { status: 400 }
    );
  }

  // 1. Buscar licença verificando que o email bate
  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("*")
    .eq("license_key", license_key)
    .eq("email", email.toLowerCase())
    .single();

  if (!license) {
    return NextResponse.json({ error: "LICENSE_NOT_FOUND" }, { status: 404 });
  }

  // 2. Buscar devices
  const { data: devices } = await supabaseAdmin
    .from("devices")
    .select("id, device_name, os_version, activated_at, last_seen_at, is_active, hardware_id")
    .eq("license_id", license.id)
    .order("activated_at", { ascending: false });

  const activeDevices = (devices ?? []).filter((d) => d.is_active);

  return NextResponse.json({
    license_key: license.license_key,
    plan: license.plan,
    status: license.status,
    expires_at: license.expires_at,
    asaas_customer_id: license.asaas_customer_id,
    asaas_subscription_id: license.asaas_subscription_id,
    devices: devices ?? [],
    devices_used: activeDevices.length,
    devices_max: license.max_devices,
  });
}
