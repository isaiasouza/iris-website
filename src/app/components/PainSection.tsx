"use client";

import { useEffect, useRef } from "react";

const pains = [
  {
    problem: "ZIP de 8GB que trava na hora de descompactar",
    fix: "O Iris baixa arquivo por arquivo. Sem ZIP, sem corrupção.",
  },
  {
    problem: "\"Arquivo grande demais\" no Google Drive",
    fix: "Sem limitação. O Iris baixa quantos GBs você precisar.",
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
          <span className="text-sm font-semibold uppercase tracking-widest text-iris-400">
            O problema
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            O Google Drive não foi feito para quem precisa baixar muita coisa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#9F9FA3]">
            Você já conhece essa frustração. O Iris foi criado para resolver isso.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {pains.map((item, i) => (
            <div
              key={i}
              className="fade-up-hidden rounded-2xl border border-white/5 bg-[#19191E] p-6 transition-all hover:border-iris-500/15"
              style={{ transitionDelay: `${(i % 2) * 80}ms` }}
            >
              {/* Problem */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                  <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-[#9F9FA3]">{item.problem}</p>
              </div>
              {/* Fix */}
              <div className="mt-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iris-700/20">
                  <svg className="h-3.5 w-3.5 text-iris-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-white">{item.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
