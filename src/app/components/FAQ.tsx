"use client";

import { useState } from "react";

const faqs = [
  {
    question: "O que é o Iris Downloader?",
    answer:
      "É um app nativo para macOS que permite baixar e enviar arquivos do Google Drive diretamente, sem precisar compactar pastas em ZIP. Ele usa o rclone como motor de transferência.",
  },
  {
    question: "Preciso pagar para usar?",
    answer:
      "Não! O Iris Downloader é totalmente gratuito. Sem assinatura, sem anúncios, sem limites de uso.",
  },
  {
    question: "O que é o rclone e por que preciso dele?",
    answer:
      "O rclone é uma ferramenta de linha de comando open-source que gerencia transferências com serviços de nuvem. O Iris Downloader usa ele como backend para fazer os downloads e uploads. Instale com: brew install rclone",
  },
  {
    question: "Funciona em Macs Intel?",
    answer:
      "Atualmente o app é compilado apenas para Apple Silicon (M1, M2, M3, M4). Suporte para Intel está planejado para uma versão futura.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. O app se comunica diretamente com a API do Google Drive através do rclone. Seus dados nunca passam por servidores de terceiros. A autenticação é feita diretamente com o Google.",
  },
  {
    question: "O macOS bloqueou a abertura do app. O que faço?",
    answer:
      'Como o app não é notarizado pela Apple, o Gatekeeper pode bloquear a primeira abertura. Clique com o botão direito no app → "Abrir" → "Abrir" novamente na janela de confirmação.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-iris-400">
            FAQ
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-zinc-900/30 transition-colors hover:border-white/10"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="pr-4 font-medium text-white">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
