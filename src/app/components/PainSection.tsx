"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";

const pains = [
  {
    problem: "ZIP de vários GB que trava na entrega do job",
    fix: "O Iris baixa arquivo por arquivo. Sem ZIP, sem corrupção.",
  },
  {
    problem: "O Drive demora para preparar e divide o download",
    fix: "O Iris transfere arquivo por arquivo, sem montar um pacote antes.",
  },
  {
    problem: "Abrir o navegador só para pegar um arquivo",
    fix: "Tudo no app. Navegue, baixe e envie sem sair do Mac.",
  },
  {
    problem: "Trocar de conta Google é uma via-sacra",
    fix: "Todas as contas na barra lateral. Um clique para trocar.",
  },
];

export default function PainSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section ref={sectionRef} className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
            O vilão é o ZIP
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            Um único ZIP pode atrasar a pasta inteira
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#9F9FA3]">
            Para quem trabalha com arquivos grandes, repetir download não é detalhe: é prazo perdido.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {pains.map((item, i) => (
            <Card
              key={i}
              className="fade-up-hidden gap-0 rounded-2xl border border-white/7 bg-card p-6 py-6 transition-all hover:border-cyan-200/16"
              style={{ transitionDelay: `${(i % 2) * 80}ms` }}
            >
              {/* Problem */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                  <X className="h-3.5 w-3.5 text-red-400" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-[#9F9FA3]">{item.problem}</p>
              </div>
              {/* Fix */}
              <div className="mt-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iris-700/20">
                  <Check className="h-3.5 w-3.5 text-cyan-200" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-medium text-white">{item.fix}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
