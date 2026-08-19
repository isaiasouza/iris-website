"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-white/58">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" strokeWidth={2.5} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<"annual" | "lifetime" | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll(".fade-up-hidden").forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="pricing" ref={sectionRef} className="relative py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-[420px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-cyan-400/6 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Escolha sua licença</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Custa menos que refazer um download grande
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/48 sm:text-base">
              Comece no anual por R$ 49,90 ou pague uma vez para usar a linha V2 sem renovação.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2 md:items-stretch">
            <Card className="fade-up-hidden flex flex-col gap-0 rounded-2xl border-white/10 bg-card p-6 py-6 sm:p-8 sm:py-8">
              <div>
                <p className="text-sm font-medium text-white/65">Anual</p>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-white">R$ 49,90</span>
                  <span className="mb-1 text-sm text-white/42">/ano</span>
                </div>
                <p className="mt-2 text-xs text-white/40">Equivale a R$ 4,15/mês · cancele quando quiser</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal("annual")}
                className="mt-7 h-12 w-full rounded-xl border-cyan-200/30 bg-cyan-200/7 px-5 text-sm font-semibold text-cyan-100 hover:border-cyan-100/60 hover:bg-cyan-100/12 hover:text-cyan-50"
              >
                Começar por R$ 49,90
              </Button>
              <p className="mt-2 text-center text-[11px] text-white/35">1 ano de acesso completo</p>
              <FeatureList items={annualFeatures} />
            </Card>

            <Card
              className="fade-up-hidden relative flex flex-col gap-0 rounded-2xl border-cyan-200/35 bg-[linear-gradient(160deg,#19222c,#0c151e_62%)] p-6 py-6 shadow-[0_24px_80px_rgba(34,211,238,.08)] sm:p-8 sm:py-8"
              style={{ transitionDelay: "100ms" }}
            >
              <Badge className="absolute right-5 top-5 gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-semibold text-[#071018] hover:bg-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Sem renovação
              </Badge>
              <div>
                <p className="text-sm font-medium text-white/65">Vitalício</p>
                <div className="mt-3">
                  <span className="text-4xl font-semibold tracking-tight text-white">R$ 110,99</span>
                </div>
                <p className="mt-2 text-xs text-white/40">Pagamento único · atualizações da linha V2</p>
              </div>
              <Button
                type="button"
                onClick={() => setModal("lifetime")}
                className="mt-7 h-12 w-full rounded-xl bg-white px-5 text-sm font-semibold text-[#081018] shadow-[0_12px_35px_rgba(255,255,255,.1)] hover:bg-cyan-50"
              >
                Comprar uma vez e usar
              </Button>
              <p className="mt-2 text-center text-[11px] text-white/35">Sem cobrança anual</p>
              <FeatureList items={lifetimeFeatures} />
            </Card>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "7 dias de garantia", text: "Reembolso de 100% se não servir." },
              { icon: CreditCard, title: "Checkout Cakto", text: "PIX, cartão ou boleto." },
              { icon: Check, title: "2.000+ downloads", text: "App assinado com Developer ID." },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="gap-0 rounded-xl border-white/7 bg-white/[0.025] p-4 py-4 text-center">
                <Icon className="mx-auto h-5 w-5 text-cyan-200" />
                <p className="mt-2 text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-white/40">{text}</p>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            Já tem uma licença?{" "}
            <a href="/minha-licenca" className="text-cyan-200/70 transition hover:text-cyan-100">
              Acessar minha licença →
            </a>
          </p>
        </div>
      </section>

      {modal && <CheckoutModal plan={modal} onClose={() => setModal(null)} />}
    </>
  );
}
