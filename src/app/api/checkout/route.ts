import { NextRequest, NextResponse } from "next/server";
import { createAbacateCheckout, type Plan } from "@/lib/abacatepay";

export const runtime = "nodejs";

const PLANS: readonly Plan[] = ["annual", "lifetime"];

export async function POST(req: NextRequest) {
  let body: { plan?: unknown; name?: unknown; email?: unknown; taxId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const plan = PLANS.find((candidate) => candidate === body.plan);
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const taxId = typeof body.taxId === "string" ? body.taxId.replace(/\D/g, "") : "";

  if (!plan) return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  if (!name) return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Informe um e-mail válido: é para ele que a licença vai." }, { status: 400 });
  }
  if (taxId && taxId.length !== 11 && taxId.length !== 14) {
    return NextResponse.json({ error: "CPF ou CNPJ inválido." }, { status: 400 });
  }

  try {
    const checkoutUrl = await createAbacateCheckout({ plan, name, email, taxId: taxId || undefined });
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error("[checkout/abacatepay]", err instanceof Error ? err.message : "unknown");
    return NextResponse.json(
      { error: "Não foi possível abrir o pagamento agora. Tente de novo em instantes." },
      { status: 502 },
    );
  }
}
