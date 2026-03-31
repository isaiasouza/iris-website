import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  let body: {
    name: string;
    email: string;
    plan: "annual" | "lifetime";
    expires_at?: string;
    max_devices?: number;
    send_email: boolean;
    internal_note?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.name || !body.email || !body.plan) {
    return NextResponse.json({ error: "name, email e plan são obrigatórios" }, { status: 400 });
  }

  const license_key = generateLicenseKey();
  const max_devices = body.max_devices ?? (body.plan === "lifetime" ? 3 : 1);
  const expires_at = body.expires_at ?? (
    body.plan === "annual"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null
  );

  const { data, error } = await supabaseAdmin
    .from("licenses")
    .insert({
      license_key,
      plan: body.plan,
      status: "active",
      email: body.email,
      name: body.name,
      max_devices,
      expires_at,
      internal_note: body.internal_note ?? null,
      cakto_transaction_id: null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin.from("license_events").insert({
    license_id: data.id,
    event: "issued_manually",
    metadata: { by: "admin", send_email: body.send_email },
  }).then(() => {});

  if (body.send_email) {
    await sendLicenseEmail({
      to: body.email,
      name: body.name,
      licenseKey: license_key,
      plan: body.plan,
    });
  }

  return NextResponse.json({ ok: true, license: { id: data.id, license_key } });
}
