import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail, sendPaymentFailedEmail } from "@/lib/email";

export const runtime = "nodejs";

const DEFAULT_ABACATEPAY_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

type Plan = "annual" | "lifetime";

interface AbacateEvent {
  id: string;
  event: string;
  data?: Record<string, unknown>;
}

function verifySignature(rawBody: string, signature: string) {
  const publicKey = process.env.ABACATEPAY_WEBHOOK_PUBLIC_KEY ?? DEFAULT_ABACATEPAY_PUBLIC_KEY;
  const expected = crypto
    .createHmac("sha256", publicKey)
    .update(Buffer.from(rawBody, "utf8"))
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function readString(data: Record<string, unknown>, ...paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((acc, key) => {
      if (!acc || typeof acc !== "object") return undefined;
      return (acc as Record<string, unknown>)[key];
    }, data);

    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function readPlan(data: Record<string, unknown>): Plan {
  const plan = readString(data, "metadata.plan");
  return plan === "lifetime" ? "lifetime" : "annual";
}

function addOneYear(date = new Date()) {
  return new Date(date.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("webhookSecret");
  if (!secret || secret !== process.env.ABACATEPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature");
  if (!signature || !verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: AbacateEvent;
  try {
    body = JSON.parse(rawBody) as AbacateEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    switch (body.event) {
      case "checkout.completed":
      case "subscription.completed":
        await handleCompleted(body);
        break;
      case "subscription.renewed":
        await handleRenewed(body);
        break;
      case "checkout.refunded":
      case "checkout.disputed":
      case "checkout.lost":
      case "subscription.cancelled":
        await handleCancelled(body);
        break;
      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/abacatepay]", body.event, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleCompleted(event: AbacateEvent) {
  const data = event.data ?? {};
  const checkoutId = readString(data, "id", "checkout.id", "billing.id", "subscription.id");
  const subscriptionId = event.event.startsWith("subscription")
    ? readString(data, "id", "subscription.id")
    : readString(data, "subscription.id");

  if (!checkoutId && !subscriptionId) throw new Error("Evento sem checkout/subscription id");

  const { data: existing } = await supabaseAdmin
    .from("licenses")
    .select("id")
    .or(`abacatepay_checkout_id.eq.${checkoutId || "__none__"},abacatepay_subscription_id.eq.${subscriptionId || "__none__"}`)
    .maybeSingle();

  if (existing) return;

  const plan = readPlan(data);
  const email = readString(data, "metadata.email", "customer.email", "billing.email");
  const name = readString(data, "metadata.name", "customer.name", "billing.name") || "Cliente";

  if (!email) throw new Error("Evento sem email do cliente");

  const licenseKey = generateLicenseKey();
  const maxDevices = plan === "lifetime" ? 3 : 1;
  const expiresAt = plan === "annual" ? addOneYear() : null;

  const { data: license, error } = await supabaseAdmin
    .from("licenses")
    .insert({
      license_key: licenseKey,
      plan,
      status: "active",
      email,
      name,
      abacatepay_checkout_id: checkoutId || null,
      abacatepay_subscription_id: subscriptionId || null,
      abacatepay_event_id: event.id,
      max_devices: maxDevices,
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (error) throw new Error(`Supabase insert: ${error.message}`);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "created",
    metadata: { source: "abacatepay", event_id: event.id, checkout_id: checkoutId, subscription_id: subscriptionId },
  });

  await sendLicenseEmail({ to: email, name, licenseKey, plan });
}

async function handleRenewed(event: AbacateEvent) {
  const data = event.data ?? {};
  const subscriptionId = readString(data, "id", "subscription.id");
  if (!subscriptionId) return;

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, email, name")
    .eq("abacatepay_subscription_id", subscriptionId)
    .single();

  if (!license) return;

  await supabaseAdmin
    .from("licenses")
    .update({ status: "active", expires_at: addOneYear(), abacatepay_event_id: event.id })
    .eq("id", license.id);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "renewed",
    metadata: { source: "abacatepay", event_id: event.id, subscription_id: subscriptionId },
  });
}

async function handleCancelled(event: AbacateEvent) {
  const data = event.data ?? {};
  const checkoutId = readString(data, "id", "checkout.id", "billing.id");
  const subscriptionId = event.event.startsWith("subscription")
    ? readString(data, "id", "subscription.id")
    : readString(data, "subscription.id");

  const query = subscriptionId
    ? supabaseAdmin.from("licenses").select("id, email, name").eq("abacatepay_subscription_id", subscriptionId)
    : supabaseAdmin.from("licenses").select("id, email, name").eq("abacatepay_checkout_id", checkoutId);

  const { data: license } = await query.single();
  if (!license) return;

  const status = event.event === "subscription.cancelled" ? "cancelled" : "suspended";
  await supabaseAdmin
    .from("licenses")
    .update({ status, abacatepay_event_id: event.id })
    .eq("id", license.id);

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: status,
    metadata: { source: "abacatepay", event_id: event.id, checkout_id: checkoutId, subscription_id: subscriptionId },
  });

  if (status === "suspended") {
    await sendPaymentFailedEmail({
      to: license.email,
      name: license.name ?? "Cliente",
      portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`,
    });
  }
}
