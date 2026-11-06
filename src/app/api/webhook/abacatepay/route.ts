import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendAdminNotice, sendLicenseEmail, sendPaymentFailedEmail } from "@/lib/email";
import {
  findId,
  getAbacateCheckout,
  getAbacateCustomer,
  getAbacateSubscription,
  getAbacateSubscriptionCheckout,
  getProductId,
  type AbacateBilling,
  type Plan,
} from "@/lib/abacatepay";

export const runtime = "nodejs";

// Chave publicada na documentação da AbacatePay para o HMAC do corpo. Como é
// pública, ela só prova que o corpo não foi alterado; quem prova a origem é o
// webhookSecret na URL. Por isso pagamentos são sempre confirmados na API.
const ABACATEPAY_HMAC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

interface AbacateEvent {
  id: string;
  event: string;
  devMode?: boolean;
  data?: Record<string, unknown>;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function validSignature(rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.ABACATEPAY_WEBHOOK_PUBLIC_KEY || ABACATEPAY_HMAC_KEY)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64");
  return safeEqual(expected, signature);
}

function addOneYear(from = new Date()) {
  return new Date(from.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
}

function metadataString(billing: AbacateBilling | null, key: string) {
  const value = billing?.metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
  if (!expectedSecret) {
    console.error("[webhook/abacatepay] ABACATEPAY_WEBHOOK_SECRET não configurado");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const secret = req.nextUrl.searchParams.get("webhookSecret") ?? "";
  if (!safeEqual(secret, expectedSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  if (!signature || !validSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: AbacateEvent;
  try {
    body = JSON.parse(rawBody) as AbacateEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body.data ?? {};
  try {
    switch (body.event) {
      case "checkout.completed":
        await handlePaidCheckout(findId(data, "bill_"), body.id);
        break;
      case "subscription.completed":
        await handleNewSubscription(findId(data, "subs_"), body.id);
        break;
      case "subscription.renewed":
        await handleRenewal(findId(data, "subs_"), body.id);
        break;
      case "subscription.payment_failed":
        await handlePaymentFailed(findId(data, "subs_"));
        break;
      case "subscription.cancelled":
        await handleSubscriptionCancelled(findId(data, "subs_"), body.id);
        break;
      case "checkout.refunded":
      case "checkout.disputed":
      case "checkout.lost":
        await handleReversal(body.event, findId(data, "bill_"), findId(data, "subs_"), body.id);
        break;
      default:
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[webhook/abacatepay]", body.event, message);
    // A AbacatePay tenta de novo por ~18h; o aviso garante que ninguém pague sem receber.
    await sendAdminNotice({
      subject: `⚠️ AbacatePay: falha ao processar ${body.event}`,
      title: "Um evento de pagamento não foi processado",
      lines: [
        ["Evento", body.event],
        ["Id do evento", body.id],
        ["Erro", message],
      ],
    }).catch(() => {});
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function findLicense(column: "abacatepay_checkout_id" | "abacatepay_subscription_id", id: string) {
  if (!id) return null;
  const { data, error } = await supabaseAdmin
    .from("licenses")
    .select("id, email, name, status, expires_at, abacatepay_event_id")
    .eq(column, id)
    .maybeSingle();
  if (error) throw new Error(`Supabase select: ${error.message}`);
  return data;
}

async function createLicense(params: {
  plan: Plan;
  email: string;
  name: string;
  checkoutId: string | null;
  subscriptionId: string | null;
  eventId: string;
}) {
  const email = params.email.trim().toLowerCase();
  if (!email) throw new Error("Pagamento sem e-mail do cliente");

  const licenseKey = generateLicenseKey();
  const { data: license, error } = await supabaseAdmin
    .from("licenses")
    .insert({
      license_key: licenseKey,
      plan: params.plan,
      status: "active",
      email,
      name: params.name || "Cliente",
      abacatepay_checkout_id: params.checkoutId,
      abacatepay_subscription_id: params.subscriptionId,
      abacatepay_event_id: params.eventId,
      max_devices: params.plan === "lifetime" ? 3 : 1,
      expires_at: params.plan === "annual" ? addOneYear() : null,
    })
    .select("id")
    .single();

  // Outra entrega do mesmo evento chegou primeiro: a licença já existe.
  if (error?.code === "23505") return;
  if (error) throw new Error(`Supabase insert: ${error.message}`);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "created",
    metadata: {
      source: "abacatepay",
      event_id: params.eventId,
      checkout_id: params.checkoutId,
      subscription_id: params.subscriptionId,
    },
  });

  try {
    await sendLicenseEmail({ to: email, name: params.name || "Cliente", licenseKey, plan: params.plan });
  } catch {
    // O envio já registrou a falha e avisou o administrador; a licença está salva.
  }
}

async function customerContact(customerId: string | null | undefined, billing: AbacateBilling | null) {
  let email = metadataString(billing, "email");
  let name = metadataString(billing, "name");
  if (customerId) {
    const customer = await getAbacateCustomer(customerId);
    email = customer.email || email;
    name = customer.name || name;
  }
  return { email, name };
}

async function handlePaidCheckout(checkoutId: string, eventId: string) {
  if (!checkoutId) throw new Error("checkout.completed sem id de checkout");
  if (await findLicense("abacatepay_checkout_id", checkoutId)) return;

  let billing: AbacateBilling;
  try {
    billing = await getAbacateCheckout(checkoutId);
  } catch (error) {
    // Checkouts de assinatura não saem em /checkouts/get: quem cria a licença
    // é o subscription.completed.
    const subscriptionCheckout = await getAbacateSubscriptionCheckout(checkoutId).catch(() => null);
    if (subscriptionCheckout) return;
    throw error;
  }

  if (billing.status !== "PAID") return;
  const productIds = (billing.items ?? []).map((item) => item.id);
  if (!productIds.includes(getProductId("lifetime"))) {
    throw new Error(`Checkout pago com produto desconhecido: ${productIds.join(", ") || "nenhum"}`);
  }

  const { email, name } = await customerContact(billing.customerId, billing);
  await createLicense({ plan: "lifetime", email, name, checkoutId, subscriptionId: null, eventId });
}

async function handleNewSubscription(subscriptionId: string, eventId: string) {
  if (!subscriptionId) throw new Error("subscription.completed sem id de assinatura");
  if (await findLicense("abacatepay_subscription_id", subscriptionId)) return;

  const subscription = await getAbacateSubscription(subscriptionId);
  if (subscription.status !== "ACTIVE") return;

  const billing = subscription.checkoutId
    ? await getAbacateSubscriptionCheckout(subscription.checkoutId).catch(() => null)
    : null;
  const { email, name } = await customerContact(subscription.customerId, billing);
  await createLicense({
    plan: "annual",
    email,
    name,
    checkoutId: subscription.checkoutId,
    subscriptionId,
    eventId,
  });
}

async function handleRenewal(subscriptionId: string, eventId: string) {
  const license = await findLicense("abacatepay_subscription_id", subscriptionId);
  if (!license || license.abacatepay_event_id === eventId) return;

  const subscription = await getAbacateSubscription(subscriptionId);
  if (subscription.status !== "ACTIVE") return;

  // Renovação soma um ano a partir do vencimento atual, sem perder dias pagos.
  const currentEnd = license.expires_at ? new Date(license.expires_at) : new Date();
  const base = currentEnd > new Date() ? currentEnd : new Date();
  await supabaseAdmin
    .from("licenses")
    .update({ status: "active", expires_at: addOneYear(base), abacatepay_event_id: eventId })
    .eq("id", license.id);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "renewed",
    metadata: { source: "abacatepay", event_id: eventId, subscription_id: subscriptionId },
  });
}

async function handlePaymentFailed(subscriptionId: string) {
  const license = await findLicense("abacatepay_subscription_id", subscriptionId);
  if (!license) return;
  await sendPaymentFailedEmail({
    to: license.email,
    name: license.name ?? "Cliente",
    portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`,
  }).catch(() => {});
}

async function handleSubscriptionCancelled(subscriptionId: string, eventId: string) {
  const license = await findLicense("abacatepay_subscription_id", subscriptionId);
  if (!license) return;
  // O ano já pago continua valendo: a licença vence sozinha em expires_at.
  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "subscription_cancelled",
    metadata: { source: "abacatepay", event_id: eventId, subscription_id: subscriptionId },
  });
}

async function handleReversal(event: string, checkoutId: string, subscriptionId: string, eventId: string) {
  const license =
    (await findLicense("abacatepay_checkout_id", checkoutId)) ??
    (await findLicense("abacatepay_subscription_id", subscriptionId));
  if (!license) return;

  const status = event === "checkout.refunded" ? "cancelled" : "suspended";
  await supabaseAdmin
    .from("licenses")
    .update({ status, abacatepay_event_id: eventId })
    .eq("id", license.id);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: status,
    metadata: { source: "abacatepay", reason: event, event_id: eventId },
  });
}
