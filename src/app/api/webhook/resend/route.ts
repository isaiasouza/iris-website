import { NextRequest, NextResponse } from "next/server";
import { Resend, type WebhookEventPayload } from "resend";
import { supabaseAdmin } from "@/lib/supabase";
import { sendDeliveryProblemAlert } from "@/lib/email";
import { getCoreEnv, getResendWebhookEnv } from "@/lib/env";
import {
  DELIVERY_LABELS,
  PROBLEM_STATUSES,
  deliveryUpdateFor,
  shouldReplace,
  type DeliveryStatus,
} from "@/lib/email-delivery";

/**
 * Webhook do Resend: marca em email_events se cada e-mail foi entregue,
 * atrasou, voltou ou foi marcado como spam, e avisa o administrador quando
 * um e-mail de cliente não chega.
 *
 * Configurar no Resend (Webhooks › Add endpoint):
 *   URL:     https://www.irisdownloader.com.br/api/webhook/resend
 *   Eventos: email.delivered, email.delivery_delayed, email.bounced,
 *            email.complained, email.failed, email.suppressed
 * e salvar o "Signing secret" (whsec_…) em RESEND_WEBHOOK_SECRET na Vercel.
 */
export async function POST(req: NextRequest) {
  let secret: string;
  try {
    secret = getResendWebhookEnv().RESEND_WEBHOOK_SECRET;
  } catch {
    console.error("[webhook/resend] RESEND_WEBHOOK_SECRET não configurado");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  // A assinatura é calculada sobre o corpo cru: ler como texto, nunca como JSON antes.
  const payload = await req.text();
  const headers = {
    id: req.headers.get("svix-id") ?? req.headers.get("webhook-id") ?? "",
    timestamp: req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp") ?? "",
    signature: req.headers.get("svix-signature") ?? req.headers.get("webhook-signature") ?? "",
  };

  let event: WebhookEventPayload;
  try {
    const resend = new Resend(getCoreEnv().RESEND_API_KEY);
    event = resend.webhooks.verify({ payload, headers, webhookSecret: secret });
  } catch {
    console.error("[webhook/resend] assinatura inválida");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const update = deliveryUpdateFor(event);
  const emailId = "email_id" in event.data ? event.data.email_id : undefined;
  if (!update || !emailId) {
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const { data: row, error: readError } = await supabaseAdmin
    .from("email_events")
    .select("id,to_email,subject,type,delivery_status,created_at")
    .eq("provider_id", emailId)
    .maybeSingle();

  if (readError) {
    console.error("[webhook/resend] leitura", readError.message);
    // 500 faz o Resend reenviar o evento mais tarde.
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // E-mails que o site não registra (como o próprio aviso ao administrador).
  if (!row) {
    return NextResponse.json({ ok: true, ignored: "unknown email" });
  }

  const current = row.delivery_status as DeliveryStatus | null;
  if (!shouldReplace(current, update.status)) {
    return NextResponse.json({ ok: true, kept: current });
  }

  const { error: writeError } = await supabaseAdmin
    .from("email_events")
    .update({
      delivery_status: update.status,
      delivery_detail: update.detail,
      delivery_updated_at: event.created_at || new Date().toISOString(),
    })
    .eq("id", row.id);

  if (writeError) {
    console.error("[webhook/resend] escrita", writeError.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Aviso só na primeira vez que o e-mail entra num estado de problema,
  // então um evento repetido não gera aviso repetido.
  const becameProblem = PROBLEM_STATUSES.has(update.status) && !(current && PROBLEM_STATUSES.has(current));
  if (becameProblem) {
    try {
      await sendDeliveryProblemAlert({
        adminEmail: getCoreEnv().ADMIN_EMAIL,
        customerEmail: row.to_email,
        subject: row.subject,
        type: row.type,
        statusLabel: DELIVERY_LABELS[update.status],
        detail: update.detail,
        sentAt: row.created_at,
      });
    } catch (error) {
      // O status já foi gravado; falha no aviso não deve fazer o Resend reenviar.
      console.error("[webhook/resend] aviso ao administrador", error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({ ok: true, status: update.status });
}
