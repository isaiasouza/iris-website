"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

const annualFeatures = [
  "Acesso completo ao app",
  "Todas as atualizações do ano",
  "Suporte por email",
  "Múltiplas contas Google",
  "Sem limite de downloads",
];

const lifetimeFeatures = [
  "Tudo do plano Anual",
  "Atualizações para sempre",
  "Suporte prioritário",
  "Acesso a versões futuras",
  "Paga uma vez, usa para sempre",
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-iris-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<"annual" | "lifetime" | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const targets = sectionRef.current?.querySelectorAll(".fade-up-hidden");
    targets?.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section id="pricing" ref={sectionRef} className="relative py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-iris-800/8 blur-[130px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-iris-400">Preços</span>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Simples. Sem pegadinha.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#9F9FA3]">
              Anual ou pague uma vez e acabou. Sem renovação surpresa, sem cobrança escondida.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 md:items-start max-w-3xl mx-auto">
            {/* Annual card */}
            <div
              className="fade-up-hidden rounded-2xl border border-white/10 bg-[#19191E] p-8 flex flex-col"
              style={{ transitionDelay: "0ms" }}
            >
              <div>
                <h3 className="text-lg font-semibold text-white">Anual</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">R$ 49,90</span>
                  <span className="mb-1 text-sm text-[#9F9FA3]">/ano</span>
                </div>
                <p className="mt-1 text-xs text-[#9F9FA3]">≈ R$ 4,15/mês · Cancele quando quiser</p>
              </div>

              <button
                onClick={() => setModal("annual")}
                className="mt-8 block rounded-full border border-iris-500/40 px-6 py-3 text-center text-sm font-semibold text-iris-300 transition-all hover:border-iris-500/70 hover:bg-iris-700/10 hover:text-white cursor-pointer"
              >
                Assinar agora
              </button>

              <ul className="mt-8 space-y-3">
                {annualFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#9F9FA3]">
                    <CheckIcon />{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifetime card */}
            <div
              className="fade-up-hidden relative rounded-2xl border border-iris-500/40 bg-[#19191E] p-8 flex flex-col shadow-xl shadow-iris-800/15"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-iris-700/5" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-iris-700 to-iris-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-iris-700/30">
                  Melhor custo-benefício
                </span>
              </div>

              <div className="relative">
                <h3 className="text-lg font-semibold text-white">Vitalício</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">R$ 110,99</span>
                </div>
                <p className="mt-1 text-xs text-[#9F9FA3]">Pagamento único · Equivale a 2 anos e meio</p>
              </div>

              <button
                onClick={() => setModal("lifetime")}
                className="relative mt-8 block rounded-full bg-gradient-to-r from-iris-700 to-iris-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-iris-700/25 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-iris-700/35 cursor-pointer"
              >
                Comprar agora
              </button>

              <ul className="relative mt-8 space-y-3">
                {lifetimeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#9F9FA3]">
                    <CheckIcon />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Guarantee */}
          <div className="mt-10 mx-auto max-w-xl rounded-2xl border border-white/5 bg-[#19191E] px-8 py-5 text-center">
            <p className="text-sm font-semibold text-white">Garantia de 7 dias</p>
            <p className="mt-1 text-sm text-[#9F9FA3]">
              Não gostou? Manda um email e devolvemos 100% do valor — sem perguntas, sem formulário.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-[#58585F]">
            Pagamento seguro via Asaas &nbsp;·&nbsp; PIX, Cartão de crédito ou Boleto
          </p>

          <p className="mt-4 text-center text-xs text-[#3a3a45]">
            Já tem uma licença?{" "}
            <a href="/minha-licenca" className="text-iris-600/70 hover:text-iris-400 transition-colors">
              Acessar minha licença →
            </a>
          </p>
        </div>
      </section>

      {modal && (
        <CheckoutModal plan={modal} onClose={() => setModal(null)} />
      )}
    </>
  );
}
