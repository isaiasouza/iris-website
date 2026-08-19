"use client";

import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export interface UpsellOffer {
  title: string;
  description: string;
  price: string;
  actionLabel: string;
  actionPath: string;
}

interface UpsellCardProps {
  offer: UpsellOffer;
  orderId: string;
}

export function UpsellCard({ offer, orderId }: UpsellCardProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function acceptOffer() {
    if (status === "loading" || status === "success") return;
    setStatus("loading");

    try {
      const response = await fetch(offer.actionPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const payload = await response.json().catch(() => null) as
        | { ok?: boolean; redirect_url?: string }
        | null;

      if (!response.ok || !payload?.ok) throw new Error("UPSELL_FAILED");

      setStatus("success");
      if (payload.redirect_url) window.location.assign(payload.redirect_url);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-cyan-200/15 bg-[#0A1821]" aria-labelledby="upsell-title">
      <div className="border-b border-white/8 bg-cyan-200/6 px-5 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">
          <Sparkles className="h-4 w-4" />
          Oferta após a compra
        </p>
      </div>
      <div className="p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
        <div>
          <h2 id="upsell-title" className="text-xl font-medium tracking-[-0.02em] text-white">
            {offer.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/58">{offer.description}</p>
        </div>
        <div className="mt-5 shrink-0 sm:mt-0 sm:text-right">
          <p className="mb-3 text-lg font-semibold text-white">{offer.price}</p>
          <button
            type="button"
            onClick={acceptOffer}
            disabled={status === "loading" || status === "success"}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3 text-sm font-semibold text-[#071018] transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "loading" && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {status === "success" ? "Oferta adicionada" : offer.actionLabel}
            {status === "idle" && <ArrowRight className="h-4 w-4" />}
          </button>
          <p className="mt-2 text-xs text-white/38">Usa os dados do pedido aprovado.</p>
          {status === "error" && (
            <p className="mt-2 text-xs text-rose-300" role="alert">
              Não foi possível adicionar agora. Tente novamente.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
