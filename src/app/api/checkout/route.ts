import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

const PLANS = {
  annual: {
    name: "Iris Downloader — Plano Anual",
    amount: 4990, // R$ 49,90 em centavos
    mode: "subscription" as const,
  },
  lifetime: {
    name: "Iris Downloader — Plano Vitalício",
    amount: 11099, // R$ 110,99 em centavos
    mode: "payment" as const,
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    const { plan, name, email } = await req.json() as {
      plan: "annual" | "lifetime";
      name: string;
      email: string;
    };

    if (!plan || !name || !email) {
      return NextResponse.json({ error: "plan, name e email são obrigatórios" }, { status: 400 });
    }

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const cfg = PLANS[plan];
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const commonParams = {
      customer_email: email,
      locale: "pt-BR" as const,
      payment_method_types: ["card"] as ("card")[],
      success_url: `${siteUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#pricing`,
      metadata: { plan, name, email },
    };

    const lineItem = {
      price_data: {
        currency: "brl",
        product_data: { name: cfg.name },
        unit_amount: cfg.amount,
      },
      quantity: 1,
    };

    const session = await (cfg.mode === "payment"
      ? stripe.checkout.sessions.create({
          ...commonParams,
          mode: "payment",
          line_items: [{ ...lineItem }],
        })
      : stripe.checkout.sessions.create({
          ...commonParams,
          mode: "subscription",
          line_items: [
            {
              price_data: {
                currency: "brl",
                product_data: { name: cfg.name },
                unit_amount: cfg.amount,
                recurring: { interval: "year" },
              },
              quantity: 1,
            },
          ],
        }));

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
