"use client";

import { useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import AnimatedGradient from "@/components/ui/animated-gradient";

const painGradient = {
  preset: "custom",
  color1: "#1d4ed8",
  color2: "#171717",
  color3: "#450a0a",
  rotation: 90,
  proportion: 48,
  scale: 0.38,
  speed: 5,
  distortion: 2,
  swirl: 10,
  swirlIterations: 3,
  softness: 92,
  offset: -240,
  shape: "Edge",
  shapeSize: 52,
} as const;

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
        <div className="relative isolate overflow-hidden rounded-md border border-[#404040] px-4 py-14 shadow-[0_28px_100px_-60px_rgba(59,130,246,0.65)] sm:px-8 md:px-12 md:py-20">
          <AnimatedGradient
            config={painGradient}
            noise={{ opacity: 0.14, scale: 0.65 }}
            radius="0.375rem"
            style={{ zIndex: 0 }}
          />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(23,23,23,0.66)_0%,rgba(23,23,23,0.82)_48%,rgba(23,23,23,0.92)_100%)]" />

          <div className="relative z-10">
            <div className="text-center">
              <span className="font-mono text-[10px] font-semibold uppercase text-blue-300">
                O vilão é o ZIP
              </span>
              <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
                Um único ZIP pode atrasar a pasta inteira
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-neutral-300">
                Para quem trabalha com arquivos grandes, repetir download não é detalhe: é prazo perdido.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {pains.map((item, i) => (
                <Card
                  key={i}
                  className="fade-up-hidden gap-0 rounded-md border border-white/10 bg-[#171717]/75 p-6 py-6 backdrop-blur-sm transition-colors hover:border-blue-400/40"
                  style={{ transitionDelay: `${(i % 2) * 80}ms` }}
                >
                  {/* Problem */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-red-500/15">
                      <X className="h-3.5 w-3.5 text-red-300" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm text-neutral-300">{item.problem}</p>
                  </div>
                  {/* Fix */}
                  <div className="mt-4 flex items-start gap-3 border-t border-white/8 pt-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/20">
                      <Check className="h-3.5 w-3.5 text-blue-300" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-medium text-white">{item.fix}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
