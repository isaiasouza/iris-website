import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  getAbacateCheckoutByRef,
  getAbacateSubscriptionByRef,
  parseCheckoutRef,
} from "@/lib/abacatepay";

export const runtime = "nodejs";

/**
 * Chave da licença de uma compra recém-paga, para a página /obrigado.
 * O ref é um UUID que só aparece no redirecionamento de quem pagou; o
 * pagamento é confirmado na AbacatePay antes de devolver qualquer coisa.
 */
export async function GET(req: NextRequest) {
  const parsed = parseCheckoutRef(req.nextUrl.searchParams.get("ref"));
  if (!parsed) return NextResponse.json({ status: "invalid" }, { status: 400 });

  try {
    let column: "abacatepay_checkout_id" | "abacatepay_subscription_id";
    let paymentId: string;
    if (parsed.plan === "annual") {
      const subscription = await getAbacateSubscriptionByRef(parsed.ref);
      if (subscription.status !== "ACTIVE") return NextResponse.json({ status: "pending" });
      column = "abacatepay_subscription_id";
      paymentId = subscription.id;
    } else {
      const billing = await getAbacateCheckoutByRef(parsed.ref);
      if (billing.status !== "PAID") return NextResponse.json({ status: "pending" });
      column = "abacatepay_checkout_id";
      paymentId = billing.id;
    }

    const { data: license } = await supabaseAdmin
      .from("licenses")
      .select("license_key, plan, email, status")
      .eq(column, paymentId)
      .maybeSingle();

    // Pago, mas o webhook ainda não criou a licença: a página tenta de novo.
    if (!license || license.status !== "active") return NextResponse.json({ status: "pending" });

    return NextResponse.json(
      { status: "ready", licenseKey: license.license_key, plan: license.plan, email: license.email },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ status: "pending" });
  }
}
