"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./brand";

const faqs = [
  {
    question: "Meus arquivos passam pelo servidor de vocês?",
    answer:
      "Não. O Iris se conecta à API oficial do Google e transfere os arquivos do Drive direto para o seu Mac, sem passar por nenhum servidor nosso ou de terceiros.",
  },
  {
    question: "E se uma pasta grande falhar no meio?",
    answer:
      "Você acompanha arquivo por arquivo e pode pausar e retomar o download, sem perder tudo porque um ZIP corrompeu.",
  },
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
      "O Anual (R$ 49,90/ano) se renova automaticamente todo ano; cancele quando quiser. O Vitalício (R$ 110,99) é pagamento único: você paga uma vez e usa para sempre, incluindo todas as atualizações futuras da linha V2.",
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
      "Sim. O Iris V2 é universal: roda nativamente tanto em Apple Silicon (M1, M2, M3, M4) quanto em Intel.",
  },
  {
    question: "O macOS travou na abertura. O que faço?",
    answer:
      'É o Gatekeeper na primeira abertura. Clique com o botão direito no app → "Abrir" → "Abrir" novamente. Acontece uma vez só. O app é assinado com Developer ID da Apple.',
  },
  {
    question: "O que é o Iris Downloader?",
    answer:
      "Um app nativo para macOS que resolve um problema específico: baixar e enviar arquivos do Google Drive sem precisar compactar em ZIP. Interface limpa, múltiplas contas Google, e sem dependências externas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeader eyebrow="Dúvidas" title={<>O que falta saber <span className="text-iris-grad">antes de baixar</span></>} />

        <div className="mt-12 grid gap-2.5">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div key={faq.question} className={`overflow-hidden rounded-2xl bg-brand-surface ring-1 transition-colors ${open ? "ring-brand-secondary/35" : "ring-white/[0.07]"}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6 sm:py-5"
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="text-base font-medium text-white">{faq.question}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-brand-secondary transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {open && (
                  <div id={`faq-${i}`} className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <p className="max-w-2xl text-sm leading-7 text-brand-text-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
