const steps = [
  {
    number: "01",
    title: "Baixe e instale",
    description:
      "Abra o DMG, arraste para a pasta Aplicativos. Pronto. Nenhum terminal, nenhuma dependência extra, nenhum Homebrew.",
  },
  {
    number: "02",
    title: "Conecte sua conta Google",
    description:
      "Clique em \"Adicionar conta\", faça login com o Google no navegador e autorize o acesso. O Iris salva as credenciais de forma segura no seu Mac — você não precisa fazer isso de novo.",
  },
  {
    number: "03",
    title: "Navegue e baixe sem ZIP",
    description:
      "Escolha qualquer arquivo ou pasta no seu Drive e clique em baixar. Cada arquivo vai direto para o seu Mac, na mesma estrutura de pastas do Drive — sem compactar, sem esperar, sem travar.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="font-mono text-[10px] font-semibold uppercase text-blue-400">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            Do DMG ao primeiro download em 3 passos
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-[#404040] md:block" />
              )}
              <div className="relative rounded-md border border-[#404040] bg-[#262626] p-6 transition-colors hover:border-neutral-500">
                <span className="font-mono text-sm font-semibold text-blue-400">{step.number}</span>
                <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
