import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cancelAbacateSubscription } from "@/lib/abacatepay";

export const runtime = "nodejs";

/**
 * Cancela a renovação do plano anual. O ano já pago continua valendo:
 * a licença vence sozinha em expires_at.
 */
export async function POST(req: NextRequest) {
  let body: { license_key?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const licenseKey = body.license_key?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!licenseKey || !email) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, plan, abacatepay_subscription_id")
    .eq("license_key", licenseKey)
    .eq("email", email)
    .maybeSingle();

  if (!license) {
    return NextResponse.json({ error: "Licença não encontrada." }, { status: 404 });
  }
  if (license.plan !== "annual") {
    return NextResponse.json({ error: "Plano vitalício não tem assinatura para cancelar." }, { status: 400 });
  }
  if (!license.abacatepay_subscription_id) {
    return NextResponse.json(
      { error: "Esta assinatura foi feita em outra plataforma. Fale com contato@irisdownloader.com.br para cancelar." },
      { status: 409 },
    );
  }

  try {
    await cancelAbacateSubscription(license.abacatepay_subscription_id);
  } catch (error) {
    console.error("[license/cancel]", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Não foi possível cancelar agora. Tente de novo ou fale com contato@irisdownloader.com.br." },
      { status: 502 },
    );
  }

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "subscription_cancelled",
    metadata: { reason: "user_request", source: "abacatepay" },
  });

  return NextResponse.json({ ok: true });
}
