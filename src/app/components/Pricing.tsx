"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Check, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedGradient from "@/components/ui/animated-gradient";

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

const lifetimeGradient = {
  preset: "custom",
  color1: "#171717",
  color2: "#1e3a8a",
  color3: "#3b82f6",
  rotation: -18,
  proportion: 34,
  scale: 0.48,
  speed: 7,
  distortion: 3,
  swirl: 14,
  swirlIterations: 4,
  softness: 90,
  offset: -280,
  shape: "Edge",
  shapeSize: 48,
} as const;

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-7 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-400">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" strokeWidth={2.5} />
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[10px] font-semibold uppercase text-blue-400">Escolha sua licença</p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Custa menos que refazer um download grande
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-400 sm:text-base">
              Comece no anual por R$ 49,90 ou pague uma vez para usar a linha V2 sem renovação.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl gap-5 md:grid-cols-2 md:items-stretch">
            <Card className="fade-up-hidden relative isolate flex flex-col gap-0 overflow-hidden rounded-md border-[#404040] bg-[#262626] p-6 py-6 sm:p-8 sm:py-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_65%)]" />
              <div>
                <p className="font-mono text-xs font-medium uppercase text-neutral-400">Anual</p>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight text-white">R$ 49,90</span>
                  <span className="mb-1 text-sm text-neutral-500">/ano</span>
                </div>
                <p className="mt-2 text-xs text-neutral-500">Equivale a R$ 4,15/mês · cancele quando quiser</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModal("annual")}
                className="mt-7 h-12 w-full rounded-md border-[#404040] bg-[#1f1f1f] px-5 text-sm font-semibold text-white hover:border-blue-500 hover:bg-[#303030]"
              >
                Começar por R$ 49,90
              </Button>
              <p className="mt-2 text-center font-mono text-[10px] uppercase text-neutral-500">1 ano de acesso completo</p>
              <FeatureList items={annualFeatures} />
            </Card>

            <Card
              className="fade-up-hidden relative isolate flex flex-col gap-0 overflow-hidden rounded-md border-blue-500 bg-[#171717] p-0 py-0 shadow-[0_24px_80px_-32px_rgba(59,130,246,0.65)]"
              style={{ transitionDelay: "100ms" }}
            >
              <AnimatedGradient
                config={lifetimeGradient}
                noise={{ opacity: 0.16, scale: 0.7 }}
                radius="0.375rem"
                style={{ zIndex: 0 }}
              />
              <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(145deg,rgba(23,23,23,0.28)_0%,rgba(23,23,23,0.72)_56%,rgba(23,23,23,0.92)_100%)]" />

              <div className="relative z-10 flex h-full flex-col p-6 sm:p-8">
                <Badge className="absolute right-5 top-5 gap-1.5 rounded-md border border-blue-300/20 bg-blue-500/90 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase text-white backdrop-blur-sm hover:bg-blue-500/90">
                  <Sparkles className="h-3.5 w-3.5" />
                  Sem renovação
                </Badge>
                <div>
                  <p className="font-mono text-xs font-medium uppercase text-blue-100/75">Vitalício</p>
                  <div className="mt-3">
                    <span className="text-4xl font-semibold tracking-tight text-white">R$ 110,99</span>
                  </div>
                  <p className="mt-2 text-xs text-blue-100/60">Pagamento único · atualizações da linha V2</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setModal("lifetime")}
                  className="mt-7 h-12 w-full rounded-md bg-white px-5 text-sm font-semibold text-[#171717] shadow-none hover:bg-blue-50"
                >
                  Comprar uma vez e usar
                </Button>
                <p className="mt-2 text-center font-mono text-[10px] uppercase text-blue-100/55">Sem cobrança anual</p>
                <FeatureList items={lifetimeFeatures} />
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "7 dias de garantia", text: "Reembolso de 100% se não servir." },
              { icon: CreditCard, title: "Checkout Cakto", text: "PIX, cartão ou boleto." },
              { icon: Check, title: "2.000+ downloads", text: "App assinado com Developer ID." },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="gap-0 rounded-md border-[#404040] bg-[#1f1f1f] p-4 py-4 text-center">
                <Icon className="mx-auto h-5 w-5 text-blue-400" />
                <p className="mt-2 text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{text}</p>
              </Card>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            Já tem uma licença?{" "}
            <a href="/minha-licenca" className="text-blue-400 transition hover:text-blue-300">
              Acessar minha licença →
            </a>
          </p>
        </div>
      </section>

      {modal && <CheckoutModal plan={modal} onClose={() => setModal(null)} />}
    </>
  );
}
