"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Posso testar antes de pagar?",
    answer:
      "Sim. Você pode baixar o app gratuitamente e testar todas as funcionalidades. A licença é necessária para continuar usando depois do período de avaliação.",
  },
  {
    question: "E se eu não gostar? Tem reembolso?",
    answer:
      "Sim. Garantia de 7 dias. Se por qualquer motivo o app não atendeu o que você esperava, manda um email e devolvemos 100% do valor. Sem formulário, sem demora.",
  },
  {
    question: "Qual a diferença entre o plano Anual e o Vitalício?",
    answer:
      "O Anual (R$ 49,90/ano) se renova automaticamente todo ano — cancele quando quiser. O Vitalício (R$ 110,99) é pagamento único: você paga uma vez e usa para sempre, incluindo todas as atualizações futuras da linha V2.",
  },
  {
    question: "O plano Vitalício inclui atualizações futuras?",
    answer:
      "Sim. Você paga uma vez e recebe todas as atualizações da linha V2 do Iris Downloader para sempre. Sem custo adicional.",
  },
  {
    question: "Posso usar em mais de um Mac?",
    answer:
      "O plano Anual permite 1 Mac. O plano Vitalício permite até 3 Macs ativos com a mesma licença.",
  },
  {
    question: "O que acontece se eu não renovar o plano Anual?",
    answer:
      "O app continua instalado, mas fica bloqueado até você renovar. Você não perde seus dados. Pode renovar a qualquer momento para voltar a usar normalmente.",
  },
  {
    question: "Funciona em Macs com chip Intel?",
    answer:
      "Sim. O Iris V2 é universal — roda nativamente tanto em Apple Silicon (M1, M2, M3, M4) quanto em Intel.",
  },
  {
    question: "O macOS travou na abertura. O que faço?",
    answer:
      'É o Gatekeeper na primeira abertura. Clique com o botão direito no app → "Abrir" → "Abrir" novamente. Acontece uma vez só. O app é assinado com Developer ID da Apple.',
  },
  {
    question: "Meus arquivos ficam em algum servidor externo?",
    answer:
      "Não. O app se comunica diretamente com a API oficial do Google Drive. Seus arquivos vão do Drive para o seu Mac — sem passar por nenhum servidor nosso ou de terceiros.",
  },
  {
    question: "O que é o Iris Downloader?",
    answer:
      "Um app nativo para macOS que resolve um problema específico: baixar e enviar arquivos do Google Drive sem precisar compactar em ZIP. Interface limpa, múltiplas contas Google, e sem dependências externas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">Dúvidas finais</span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            O que falta saber antes de baixar
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
