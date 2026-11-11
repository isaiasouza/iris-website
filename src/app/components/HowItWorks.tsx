import { BetaBadge, SectionHeader } from "./brand";

const steps: { title: string; description: string; note?: string }[] = [
  {
    title: "Baixe e instale",
    description:
      "Abra o DMG e arraste para a pasta Aplicativos. Pronto. Nenhum terminal, nenhuma dependência extra, nenhum Homebrew.",
  },
  {
    title: "Cole um link",
    description:
      "Pasta ou arquivo público do Drive, Dropbox ou OneDrive, ou um vídeo do YouTube, Instagram, TikTok e X. Não precisa entrar com o Google.",
    note: "Navegar pelo seu Drive inteiro com login no Google está em Beta, em liberação gradual.",
  },
  {
    title: "Baixe sem ZIP",
    description:
      "Escolha a pasta de destino uma vez: o Iris lembra nas próximas. Cada arquivo vai direto para o Mac, na mesma estrutura de pastas: sem compactar, sem esperar, sem travar.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader eyebrow="Como funciona" title={<>Do DMG ao primeiro download <span className="text-iris-grad">em 3 passos</span></>} />

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Linha de luz ligando os três passos */}
          <span className="iris-flow absolute left-[16%] right-[16%] top-7 hidden h-0.5 opacity-60 md:block" aria-hidden="true" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-surface-2 font-display text-xl font-bold text-white shadow-[0_0_40px_-6px_rgba(107,85,240,0.7)] ring-1 ring-brand-secondary/40" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mt-6 text-lg font-semibold text-white">
                <span className="sr-only">Passo {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-brand-text-2">{step.description}</p>
              {step.note && (
                <p className="mx-auto mt-3 flex max-w-sm items-start justify-center gap-2 text-xs leading-5 text-brand-muted">
                  <BetaBadge className="mt-0.5" />
                  <span>{step.note}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
