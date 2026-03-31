import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendDeviceRemovedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  let body: {
    license_key: string;
    hardware_id: string;   // device a remover
    auth_hardware_id?: string; // hardware_id do device que está fazendo a requisição (app)
    session_token?: string;    // token de sessão do portal web
  };

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

  // 2. Buscar device alvo
  const { data: device } = await supabaseAdmin
    .from("devices")
    .select("*")
    .eq("license_id", license.id)
    .eq("hardware_id", hardware_id)
    .single();

  if (!device) {
    return NextResponse.json({ error: "DEVICE_NOT_FOUND" }, { status: 404 });
  }

  // 3. Desativar device
  await supabaseAdmin
    .from("devices")
    .update({ is_active: false })
    .eq("id", device.id);

  // 4. Invalidar tokens desse device
  await supabaseAdmin
    .from("validation_tokens")
    .delete()
    .eq("hardware_id", hardware_id)
    .eq("license_id", license.id);

  // 5. Audit log
  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "deactivated",
    hardware_id,
    metadata: { device_name: device.device_name },
  });

  // 6. Email de segurança
  await sendDeviceRemovedEmail({
    to: license.email,
    deviceName: device.device_name ?? hardware_id,
  }).catch(console.error);

  return NextResponse.json({ ok: true });
}
