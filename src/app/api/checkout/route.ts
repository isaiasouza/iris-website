import { NextRequest, NextResponse } from "next/server";
import { createAbacateCheckout } from "@/lib/abacatepay";

const PLANS = {
  annual: {
    label: "Iris Downloader — Plano Anual",
    value: 4990,
  },
  lifetime: {
    label: "Iris Downloader — Plano Vitalício",
    value: 11099,
  },
} as const;

export async function POST(req: NextRequest) {
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
    const checkoutUrl = await createAbacateCheckout({ plan, name, email, taxId: cpfCnpj });

    return NextResponse.json({ checkoutUrl, plan, label: cfg.label, amount: cfg.value });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[checkout/abacatepay]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
