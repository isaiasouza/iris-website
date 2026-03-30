"use client";

import { useState } from "react";

const faqs = [
  {
    question: "O que é o Iris Downloader?",
    answer:
      "É um app nativo para macOS que permite baixar e enviar arquivos do Google Drive diretamente, sem precisar compactar pastas em ZIP. Interface limpa, múltiplas contas Google e sem dependências externas.",
  },
  {
    question: "Qual a diferença entre o plano Anual e o Vitalício?",
    answer:
      "O plano Anual (R$ 49,90/ano) é renovado automaticamente todo ano e você pode cancelar quando quiser. O plano Vitalício (R$ 110,99) é um pagamento único, sem renovações, e inclui todas as atualizações da linha V2 para sempre.",
  },
  {
    question: "O plano Vitalício inclui atualizações futuras?",
    answer:
      "Sim. O plano Vitalício inclui todas as atualizações da linha V2 do Iris Downloader. Você paga uma vez e recebe tudo que vier pela frente.",
  },
  {
    question: "Posso usar em mais de um Mac?",
    answer:
      "Sim. A licença é vinculada à sua conta, não ao dispositivo. Você pode usar o Iris Downloader em quantos Macs quiser com a mesma conta.",
  },
  {
    question: "O que acontece se eu não renovar o plano Anual?",
    answer:
      "O app continua instalado e funcionando, mas deixa de receber atualizações. Você pode renovar a qualquer momento para voltar a receber as atualizações.",
  },
  {
    question: "Funciona em Macs Intel?",
    answer:
      "Sim. O Iris Downloader V2 é compilado como universal binary, compatível com Apple Silicon (M1, M2, M3, M4) e Intel.",
  },
  {
    question: "Meus dados estão seguros?",
    answer:
      "Sim. O app se comunica diretamente com a API oficial do Google Drive. Seus dados nunca passam por servidores de terceiros. A autenticação é feita via OAuth e os tokens ficam seguros no Keychain do macOS.",
  },
  {
    question: "O macOS bloqueou a abertura do app. O que faço?",
    answer:
      'O Iris Downloader é assinado com Developer ID. Se o Gatekeeper bloquear na primeira abertura, clique com o botão direito no app → "Abrir" → "Abrir" novamente na janela de confirmação.',
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "7 dias. Se por qualquer motivo você não ficar satisfeito, basta entrar em contato e faremos o reembolso integral sem perguntas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-iris-400">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mt-12 space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/5 bg-[#19191E] transition-all hover:border-iris-500/15"
            >
              <button
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="pr-4 font-medium text-white">{faq.question}</span>
                <svg
                  className={`h-5 w-5 shrink-0 text-[#9F9FA3] transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-[#9F9FA3]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
