"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { SectionHeader, btnPrimary, btnSecondary } from "./brand";
import { cn } from "@/lib/utils";

const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

const annualFeatures = [
  "Downloads e uploads sem limite",
  "Múltiplas contas Google",
  "Pausar e retomar transferências",
  "Atualizações durante o plano",
  "Uso em 1 Mac",
];

const lifetimeFeatures = [
  "Tudo do plano anual",
  "Pagamento único",
  "Atualizações futuras da linha V2",
  "Suporte prioritário",
  "Uso em até 3 Macs",
];

function FeatureList({ items, highlight = false }: { items: string[]; highlight?: boolean }) {
  return (
    <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
      {items.map((item) => (
        <li key={item} className={`flex items-start gap-3 text-sm ${highlight ? "text-white" : "text-brand-text-2"}`}>
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-secondary" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const [modal, setModal] = useState<"annual" | "lifetime" | null>(null);

  return (
    <>
      <section id="pricing" className="relative scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Escolha sua licença"
            title={<>Custa menos que <span className="text-iris-grad">refazer um download grande</span></>}
            text="Comece no anual por R$ 49,90 ou pague uma vez para usar a linha V2 sem renovação."
          />

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-2 md:items-stretch">
            <article className="flex flex-col rounded-3xl bg-brand-surface p-7 ring-1 ring-white/[0.08] sm:p-9">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-text-2">Anual</p>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-[40px] font-bold leading-none text-white">R$ 49,90</span>
                <span className="text-sm text-brand-muted">/ano</span>
              </p>
              <p className="mt-3 text-sm text-brand-muted">Equivale a R$ 4,15/mês · cancele quando quiser</p>
              <button type="button" onClick={() => setModal("annual")} className={cn(btnSecondary, "mt-8 w-full")}>
                Começar por R$ 49,90
              </button>
              <p className="mt-2 text-center text-xs text-brand-muted">1 ano de acesso completo</p>
              <FeatureList items={annualFeatures} />
            </article>

            <article className="iris-conic relative flex flex-col overflow-hidden rounded-3xl p-7 shadow-[0_40px_100px_-40px_rgba(107,85,240,0.8)] sm:p-9">
              <span className="absolute right-6 top-6 rounded-full bg-noite-top px-3 py-1 text-xs font-semibold text-white">Sem renovação</span>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">Vitalício</p>
              <p className="mt-4">
                <span className="font-display text-[40px] font-bold leading-none text-white">R$ 110,99</span>
              </p>
              <p className="mt-3 text-sm text-brand-muted">Pagamento único · atualizações da linha V2</p>
              <button type="button" onClick={() => setModal("lifetime")} className={cn(btnPrimary, "iris-shine mt-8 w-full shadow-[0_10px_34px_-10px_rgba(107,85,240,0.9)]")}>
                Comprar uma vez e usar
              </button>
              <p className="mt-2 text-center text-xs text-brand-muted">Sem cobrança anual</p>
              <FeatureList items={lifetimeFeatures} highlight />
            </article>
          </div>

          <ul className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "7 dias de garantia", text: "Reembolso de 100% se não servir." },
              { icon: CreditCard, title: "Checkout Cakto", text: "PIX, cartão ou boleto." },
              { icon: Check, title: "2.000+ downloads", text: "App assinado com Developer ID." },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3 rounded-2xl bg-brand-surface p-5 ring-1 ring-white/[0.06]">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-secondary" />
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-brand-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-sm text-brand-muted">
            Já tem uma licença?{" "}
            <a href="/minha-licenca" className="font-medium text-brand-secondary transition hover:text-iris-300">
              Acessar minha licença →
            </a>
          </p>
        </div>
      </section>

      {modal && <CheckoutModal plan={modal} onClose={() => setModal(null)} />}
    </>
  );
}
