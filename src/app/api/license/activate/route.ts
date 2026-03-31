import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signValidationToken, tokenExpiresAt } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  let body: {
    license_key: string;
    hardware_id: string;
    device_name?: string;
    os_version?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { license_key, hardware_id, device_name, os_version } = body;

  if (!license_key || !hardware_id) {
    return NextResponse.json(
      { error: "license_key e hardware_id são obrigatórios" },
      { status: 400 }
    );
  }

  // 1. Buscar licença
  const { data: license, error: licErr } = await supabaseAdmin
    .from("licenses")
    .select("*")
    .eq("license_key", license_key)
    .single();

  if (licErr || !license) {
    return NextResponse.json({ error: "LICENSE_NOT_FOUND" }, { status: 404 });
  }

  // 2. Verificar status
  if (license.status === "suspended") {
    return NextResponse.json({ error: "LICENSE_SUSPENDED" }, { status: 403 });
  }
  if (license.status === "cancelled") {
    return NextResponse.json({ error: "LICENSE_CANCELLED" }, { status: 403 });
  }

  // 3. Verificar expiração (plano anual)
  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    await supabaseAdmin.from("licenses").update({ status: "expired" }).eq("id", license.id);
    return NextResponse.json({ error: "LICENSE_EXPIRED" }, { status: 403 });
  }

  // 4. Verificar se device já está ativo (reativação)
  const { data: existingDevice } = await supabaseAdmin
    .from("devices")
    .select("id, is_active")
    .eq("license_id", license.id)
    .eq("hardware_id", hardware_id)
    .single();

  if (existingDevice) {
    // Reativar device existente
    await supabaseAdmin
      .from("devices")
      .update({ is_active: true, last_seen_at: new Date().toISOString(), device_name, os_version })
      .eq("id", existingDevice.id);
  } else {
    // 5. Verificar limite de dispositivos
    const { count } = await supabaseAdmin
      .from("devices")
      .select("id", { count: "exact", head: true })
      .eq("license_id", license.id)
      .eq("is_active", true);

    const devicesUsed = count ?? 0;

    if (devicesUsed >= license.max_devices) {
      return NextResponse.json(
        {
          error: "DEVICE_LIMIT_REACHED",
          devices_used: devicesUsed,
          devices_max: license.max_devices,
        },
        { status: 403 }
      );
    }

    // 6. Inserir novo device
    await supabaseAdmin.from("devices").insert({
      license_id: license.id,
      hardware_id,
      device_name: device_name ?? "Mac desconhecido",
      os_version: os_version ?? "desconhecido",
    });
  }

  // 7. Gerar validation token
  const expiresAt = tokenExpiresAt();
  const token = await signValidationToken({
    license_id: license.id,
    hardware_id,
    plan: license.plan,
    expires_at: expiresAt.toISOString(),
  });

  // 8. Salvar token em cache
  await supabaseAdmin.from("validation_tokens").upsert({
    hardware_id,
    license_id: license.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  // 9. Contar devices atualizados
  const { count: finalCount } = await supabaseAdmin
    .from("devices")
    .select("id", { count: "exact", head: true })
    .eq("license_id", license.id)
    .eq("is_active", true);

  // 10. Registrar evento
  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "activated",
    hardware_id,
    ip_address: ip,
    metadata: { device_name, os_version },
  });

  return NextResponse.json({
    ok: true,
    plan: license.plan,
    validation_token: token,
    token_expires_at: expiresAt.toISOString(),
    devices_used: finalCount ?? 1,
    devices_max: license.max_devices,
    expires_at: license.expires_at,
  });
}
