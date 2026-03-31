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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-iris-800/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-iris-400">
            Como funciona
          </span>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Pronto em 3 passos
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-iris-700/30 to-transparent md:block" />
              )}
              <div className="relative rounded-2xl border border-white/5 bg-[#19191E] p-6 transition-all hover:border-iris-500/10 hover:bg-[#1E1E23]">
                <span className="text-4xl font-extrabold text-iris-700/25">{step.number}</span>
                <h3 className="mt-2 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#9F9FA3]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
