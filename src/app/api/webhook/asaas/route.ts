import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail, sendPaymentFailedEmail } from "@/lib/email";
import { cancelSubscription, getCustomer } from "@/lib/asaas";

// Verificação do token de segurança do webhook Asaas
function verifyWebhookToken(req: NextRequest): boolean {
  const token = req.headers.get("asaas-webhook-token");
  return token === process.env.ASAAS_WEBHOOK_TOKEN;
}

// Cria licença após pagamento confirmado — idempotente
async function handlePaymentConfirmed(payment: AsaasPayment) {
  // Idempotência: evita criar licença duplicada
  const { data: existing } = await supabaseAdmin
    .from("licenses")
    .select("id")
    .eq("asaas_payment_id", payment.id)
    .single();

  if (existing) return; // já processado

  const isLifetime = !payment.subscription;
  const plan: "annual" | "lifetime" = isLifetime ? "lifetime" : "annual";
  const max_devices = plan === "lifetime" ? 3 : 1;

  // Buscar dados do cliente via API (o webhook envia apenas o ID)
  const customerId = typeof payment.customer === "string" ? payment.customer : payment.customer?.id ?? "";
  const customerData = customerId ? await getCustomer(customerId) : null;
  const customerObj = typeof payment.customer === "object" ? payment.customer : null;
  const email = customerData?.email ?? customerObj?.email ?? "";
  const name  = customerData?.name  ?? customerObj?.name  ?? "Cliente";

  const expires_at = plan === "annual"
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const license_key = generateLicenseKey();

  const { error } = await supabaseAdmin.from("licenses").insert({
    license_key,
    plan,
    status: "active",
    email,
    name,
    asaas_customer_id:    customerId || null,
    asaas_subscription_id: payment.subscription ?? null,
    asaas_payment_id:     payment.id,
    max_devices,
    expires_at,
  });

  if (error) throw new Error(`Supabase insert error: ${error.message}`);

  // Registro de evento
  await supabaseAdmin.from("license_events").insert({
    license_id: (await supabaseAdmin.from("licenses").select("id").eq("license_key", license_key).single()).data?.id,
    event: "created",
    metadata: { plan, payment_id: payment.id },
  });

  // Enviar email com a chave
  await sendLicenseEmail({ to: email, name, licenseKey: license_key, plan });
}

// Renova licença anual
async function handleSubscriptionRenewed(payment: AsaasPayment) {
  if (!payment.subscription) return;

  const newExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  await supabaseAdmin
    .from("licenses")
    .update({ status: "active", expires_at: newExpiry })
    .eq("asaas_subscription_id", payment.subscription);

  const { data: lic } = await supabaseAdmin
    .from("licenses")
    .select("id")
    .eq("asaas_subscription_id", payment.subscription)
    .single();

  if (lic) {
    await supabaseAdmin.from("license_events").insert({
      license_id: lic.id,
      event: "renewed",
      metadata: { payment_id: payment.id },
    });
  }
}

// Suspende licença após pagamento vencido
async function handlePaymentOverdue(payment: AsaasPayment) {
  const query = payment.subscription
    ? supabaseAdmin.from("licenses").update({ status: "suspended" }).eq("asaas_subscription_id", payment.subscription)
    : supabaseAdmin.from("licenses").update({ status: "suspended" }).eq("asaas_payment_id", payment.id);

  await query;

  // Email de aviso
  const { data: lic } = await supabaseAdmin
    .from("licenses")
    .select("email, name, asaas_customer_id, id")
    .eq(payment.subscription ? "asaas_subscription_id" : "asaas_payment_id",
        payment.subscription ?? payment.id)
    .single();

  if (lic) {
    await sendPaymentFailedEmail({
      to: lic.email,
      name: lic.name ?? "Cliente",
      portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`,
    });
    await supabaseAdmin.from("license_events").insert({
      license_id: lic.id,
      event: "suspended",
      metadata: { reason: "payment_overdue" },
    });
  }
}

// Cancela licença
async function handleCancelled(payment: AsaasPayment) {
  const query = payment.subscription
    ? supabaseAdmin.from("licenses").update({ status: "cancelled" }).eq("asaas_subscription_id", payment.subscription)
    : supabaseAdmin.from("licenses").update({ status: "cancelled" }).eq("asaas_payment_id", payment.id);

  await query;
}

interface AsaasPayment {
  id: string;
  subscription?: string;
  customer?: string | { id: string; email: string; name: string };
  billingInfo?: { email: string; name: string };
}

export async function POST(req: NextRequest) {
  if (!verifyWebhookToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { event: string; payment?: AsaasPayment };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, payment } = body;

  try {
    switch (event) {
      case "PAYMENT_CONFIRMED":
      case "PAYMENT_RECEIVED":
        if (payment) await handlePaymentConfirmed(payment);
        break;

      case "PAYMENT_OVERDUE":
        if (payment) await handlePaymentOverdue(payment);
        break;

      case "PAYMENT_DELETED":
      case "SUBSCRIPTION_DELETED":
        if (payment) await handleCancelled(payment);
        break;

      case "SUBSCRIPTION_RENEWED":
        if (payment) await handleSubscriptionRenewed(payment);
        break;

      default:
        // Evento ignorado silenciosamente
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/asaas]", event, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
