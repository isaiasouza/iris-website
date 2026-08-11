import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cancelSubscription } from "@/lib/asaas";
import { getAsaasEnv } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    getAsaasEnv();
  } catch (error) {
    console.error(
      "[license/cancel] Asaas unavailable",
      error instanceof Error ? error.message : "unknown"
    );
    return NextResponse.json(
      { error: "PAYMENT_PROVIDER_UNAVAILABLE" },
      { status: 503 }
    );
  }

  let body: { license_key: string; email: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { license_key, email } = body;

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("*")
    .eq("license_key", license_key)
    .eq("email", email.toLowerCase())
    .single();

  if (!license) {
    return NextResponse.json({ error: "LICENSE_NOT_FOUND" }, { status: 404 });
  }

  if (license.plan !== "annual") {
    return NextResponse.json({ error: "Plano vitalício não tem assinatura para cancelar." }, { status: 400 });
  }

  if (license.asaas_subscription_id) {
    await cancelSubscription(license.asaas_subscription_id);
  }

  await supabaseAdmin
    .from("licenses")
    .update({ status: "cancelled" })
    .eq("id", license.id);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "cancelled",
    metadata: { reason: "user_request" },
  });

  return NextResponse.json({ ok: true });
}
