import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail, sendPaymentFailedEmail } from "@/lib/email";
import { getCoreEnv } from "@/lib/env";

function secretDigest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function isValidWebhookSecret(value: unknown, expected: string): boolean {
  const provided = typeof value === "string" ? value : "";
  const matches = timingSafeEqual(
    secretDigest(provided),
    secretDigest(expected)
  );
  return typeof value === "string" && matches;
}

function safeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown";
}

export async function POST(req: NextRequest) {
  let body: {
    event: string;
    secret?: string;
    data: {
      id: string;
      customer: { name: string; email: string };
      amount: number;
      paymentMethod?: string;
      subscription?: { id: string };
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const coreEnv = getCoreEnv();
  if (!isValidWebhookSecret(body.secret, coreEnv.CAKTO_WEBHOOK_SECRET)) {
    console.error("[webhook/cakto] secret inválido");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { event, data } = body;
  console.log("[webhook/cakto]", event, data?.id);

  try {
    switch (event) {
      case "purchase_approved":
        await handlePurchaseApproved(
          data,
          coreEnv.NEXT_PUBLIC_CAKTO_LIFETIME_ID
        );
        break;

      case "refund":
      case "subscription_cancelled":
        await handleCancelled(data);
        break;

      default:
        // evento não tratado — retorna 200 para Cakto não retentar
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/cakto]", {
      event,
      transactionId: data?.id,
      error: safeErrorMessage(err),
    });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handlePurchaseApproved(data: {
  id: string;
  customer: { name: string; email: string };
  amount: number;
  offer?: { id: string };
  paymentMethod?: string;
  subscription?: { id: string };
}, lifetimeId: string) {
  // Idempotência
  const { data: existing } = await supabaseAdmin
    .from("licenses")
    .select("id")
    .eq("cakto_transaction_id", data.id)
    .single();
  if (existing) return;

  const email = data.customer.email;
  const name  = data.customer.name ?? "Cliente";

  // Determina plano pelo valor ou pelo ID da oferta da Cakto
  const amount = data.amount ?? 0;
  // Se o offer.id da Cakto estiver dentro do NEXT_PUBLIC_CAKTO_LIFETIME_ID (ex: tqxh73a), ou o valor for maior que 100
  const isLifetimeOffer = data.offer?.id && lifetimeId.includes(data.offer.id);
  const plan: "annual" | "lifetime" = (isLifetimeOffer || amount >= 100) ? "lifetime" : "annual";
  const max_devices = plan === "lifetime" ? 3 : 1;
  const expires_at  = plan === "annual"
    ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const license_key = generateLicenseKey();

  const { error } = await supabaseAdmin.from("licenses").insert({
    license_key,
    plan,
    status: "active",
    email,
    name,
    cakto_transaction_id:   data.id,
    cakto_subscription_id:  data.subscription?.id ?? null,
    max_devices,
    expires_at,
  });

  if (error) throw new Error(`Supabase insert: ${error.message}`);

  try {
    await sendLicenseEmail({ to: email, name, licenseKey: license_key, plan });
  } catch (emailError) {
    console.error("Cakto license created but email failed", emailError instanceof Error ? emailError.message : "unknown");
  }
}

async function handleCancelled(data: { id: string; subscription?: { id: string } }) {
  if (data.subscription?.id) {
    await supabaseAdmin
      .from("licenses")
      .update({ status: "cancelled" })
      .eq("cakto_subscription_id", data.subscription.id);
  } else {
    await supabaseAdmin
      .from("licenses")
      .update({ status: "cancelled" })
      .eq("cakto_transaction_id", data.id);
  }
}
