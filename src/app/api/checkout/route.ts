import { NextRequest, NextResponse } from "next/server";
import { findOrCreateCustomer, createPayment, createSubscription } from "@/lib/asaas";
import { getAsaasEnv } from "@/lib/env";

const PLANS = {
  annual: {
    label: "Iris Downloader — Plano Anual",
    value: 49.90,
  },
  lifetime: {
    label: "Iris Downloader — Plano Vitalício",
    value: 110.99,
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    getAsaasEnv();
  } catch (error) {
    console.error(
      "[checkout/asaas] provider unavailable",
      error instanceof Error ? error.message : "unknown"
    );
    return NextResponse.json(
      { error: "PAYMENT_PROVIDER_UNAVAILABLE" },
      { status: 503 }
    );
  }

  try {
    const { plan, name, email, cpfCnpj } = await req.json() as {
      plan: "annual" | "lifetime";
      name: string;
      email: string;
      cpfCnpj?: string;
    };

    if (!plan || !name || !email) {
      return NextResponse.json({ error: "plan, name e email são obrigatórios" }, { status: 400 });
    }

    if (!PLANS[plan]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const cfg = PLANS[plan];

    const customer = await findOrCreateCustomer({ name, email, cpfCnpj });

    const result = plan === "lifetime"
      ? await createPayment({ customerId: customer.id, value: cfg.value, description: cfg.label })
      : await createSubscription({ customerId: customer.id, value: cfg.value, description: cfg.label });

    return NextResponse.json({ checkoutUrl: result.invoiceUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout/asaas]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
