"use client";

import { useEffect, useRef } from "react";

const mainFeatures = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: "Sem ZIP, sem limite, sem dor de cabeça",
    description:
      "O Drive gera ZIP para pastas. ZIP trava, corrompe e falha quando a pasta é grande. O Iris baixa cada arquivo individualmente, mantendo a estrutura original intacta — não importa quantos GBs ou quantos arquivos.",
    badge: "Principal diferencial",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: "Várias contas Google no mesmo app",
    description:
      "Drive pessoal, Drive do trabalho, Drive do cliente — tudo em um lugar. Alterne entre contas com um clique, sem fazer login e logout no navegador.",
    badge: "Exclusivo",
  },
];

const sideFeatures = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5-4.5m0 0L16.5 12M12 7.5V21" />
      </svg>
    ),
    title: "Upload drag-and-drop",
    description: "Arraste arquivos do Finder direto para qualquer pasta do Drive.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Pausar e retomar",
    description: "Controle total sobre os downloads. Retome de onde parou.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Navegador de pastas",
    description: "Browse pelo Drive dentro do app. Sem abrir o navegador.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Seus dados não saem do seu Mac",
    description: "Comunicação direta com o Google. Nenhum servidor intermediário.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    title: "Deletar pelo app",
    description: "Mova arquivos para a lixeira do Drive sem abrir o navegador.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "Copiar link de compartilhamento",
    description: "Um clique para copiar o link de qualquer arquivo.",
  },
];

export default function Features() {
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
    <section id="features" ref={sectionRef} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="font-mono text-[10px] font-semibold uppercase text-blue-400">
            O que muda
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            O fluxo do Drive, sem sair do Mac
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Não é sincronização automática nem navegador disfarçado. É download e upload sob seu controle.
          </p>
        </div>

        {/* Two main feature cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {mainFeatures.map((f, i) => (
            <div
              key={i}
              className="fade-up-hidden rounded-md border border-[#404040] bg-[#262626] p-8 transition-colors hover:border-neutral-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#404040] bg-[#1f1f1f] text-blue-400">
                {f.icon}
              </div>
              <div className="mt-3">
                <span className="font-mono text-[10px] font-semibold uppercase text-blue-400">
                  {f.badge}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Six smaller features */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sideFeatures.map((f, i) => (
            <div
              key={i}
              className="fade-up-hidden flex gap-4 rounded-md border border-[#404040] bg-[#262626] p-5 transition-colors hover:border-neutral-500"
              style={{ transitionDelay: `${(i % 3) * 60}ms` }}
            >
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1f1f1f] text-blue-400">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
