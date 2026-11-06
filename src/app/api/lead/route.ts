import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isBot, leadRateLimited, parseLead } from "@/lib/lead";

/** Para onde vai quem se cadastrou, por produto. */
const DOWNLOADS = {
  irislink: "/irislink/IRISLink_v0.1.5.dmg",
} as const;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  // Robô recebe "ok" e nada é gravado.
  if (isBot(body)) return NextResponse.json({ ok: true, downloadUrl: DOWNLOADS.irislink });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (leadRateLimited(ip)) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const parsed = parseLead(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { lead } = parsed;
  const now = new Date().toISOString();

  // Upsert por (email, produto): baixar de novo atualiza nome e WhatsApp.
  const { data: existing, error: readError } = await supabaseAdmin
    .from("leads")
    .select("id, downloads")
    .eq("email", lead.email)
    .eq("product", lead.product)
    .maybeSingle();

  const { error } = readError
    ? { error: readError }
    : existing
      ? await supabaseAdmin
          .from("leads")
          .update({
            name: lead.name,
            whatsapp: lead.whatsapp,
            consent_marketing: true,
            consent_at: now,
            downloads: (existing.downloads ?? 0) + 1,
            updated_at: now,
          })
          .eq("id", existing.id)
      : await supabaseAdmin.from("leads").insert({
          ...lead,
          consent_marketing: true,
          consent_at: now,
        });

  if (error) {
    console.error("[lead] falha ao salvar contato", { product: lead.product, code: error.code, message: error.message });
    return NextResponse.json({ error: "SAVE_FAILED", downloadUrl: DOWNLOADS[lead.product] }, { status: 500 });
  }

  return NextResponse.json({ ok: true, downloadUrl: DOWNLOADS[lead.product] });
}
