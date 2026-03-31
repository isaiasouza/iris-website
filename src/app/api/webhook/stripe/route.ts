import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin, generateLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail, sendPaymentFailedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook/stripe] signature error", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid" || session.mode === "subscription") {
          await handleCheckoutCompleted({
            id: session.id,
            mode: session.mode,
            customer: typeof session.customer === "string" ? session.customer : (session.customer as { id: string } | null)?.id ?? null,
            customer_email: session.customer_email,
            subscription: typeof session.subscription === "string" ? session.subscription : null,
            metadata: session.metadata as Record<string, string> | null,
            payment_status: session.payment_status ?? undefined,
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as { billing_reason?: string; subscription?: string; customer_email?: string };
        if (invoice.billing_reason === "subscription_cycle") {
          await handleSubscriptionRenewed({ subscription: invoice.subscription ?? null });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as { subscription?: string; customer_email?: string };
        await handlePaymentFailed({ subscription: invoice.subscription ?? null, customer_email: invoice.customer_email });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as { id: string };
        await supabaseAdmin
          .from("licenses")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[webhook/stripe]", event.type, err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: {
  id: string;
  mode: string;
  customer?: string | null;
  customer_email?: string | null;
  subscription?: string | null;
  metadata?: Record<string, string> | null;
  payment_status?: string;
}) {
  // Idempotência
  const { data: existing } = await supabaseAdmin
    .from("licenses")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();
  if (existing) return;

  const plan = (session.metadata?.plan ?? "annual") as "annual" | "lifetime";
  const name  = session.metadata?.name  ?? "Cliente";
  const email = session.metadata?.email ?? session.customer_email ?? "";
  const max_devices = plan === "lifetime" ? 3 : 1;
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
    stripe_customer_id:     session.customer as string ?? null,
    stripe_subscription_id: session.subscription as string ?? null,
    stripe_session_id:      session.id,
    max_devices,
    expires_at,
  });

  if (error) throw new Error(`Supabase insert: ${error.message}`);

  await sendLicenseEmail({ to: email, name, licenseKey: license_key, plan });
}

async function handleSubscriptionRenewed(invoice: { subscription?: string | null }) {
  if (!invoice.subscription) return;
  const newExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  await supabaseAdmin
    .from("licenses")
    .update({ status: "active", expires_at: newExpiry })
    .eq("stripe_subscription_id", invoice.subscription);
}

async function handlePaymentFailed(invoice: { subscription?: string | null; customer_email?: string | null }) {
  if (!invoice.subscription) return;

  await supabaseAdmin
    .from("licenses")
    .update({ status: "suspended" })
    .eq("stripe_subscription_id", invoice.subscription);

  const { data: lic } = await supabaseAdmin
    .from("licenses")
    .select("email, name")
    .eq("stripe_subscription_id", invoice.subscription)
    .single();

  if (lic) {
    await sendPaymentFailedEmail({
      to: lic.email,
      name: lic.name ?? "Cliente",
      portalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`,
    });
  }
}
