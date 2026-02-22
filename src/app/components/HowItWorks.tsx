const steps = [
  {
    number: "01",
    title: "Instale o rclone",
    description:
      "Abra o Terminal e execute: brew install rclone. É a engine de transferência por trás do Iris Downloader.",
    code: "brew install rclone",
  },
  {
    number: "02",
    title: "Conecte sua conta Google",
    description:
      "Abra o Iris Downloader e adicione sua conta do Google Drive. A autenticação é feita diretamente pelo navegador.",
    code: null,
  },
  {
    number: "03",
    title: "Cole o link e baixe",
    description:
      "Cole o link de qualquer pasta ou arquivo do Google Drive, escolha onde salvar e pronto. O download começa imediatamente.",
    code: null,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-iris-700/5 blur-[120px]" />
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
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-iris-600/30 to-transparent md:block" />
              )}

              <div className="relative rounded-2xl border border-white/5 bg-zinc-900/30 p-6">
                <span className="text-4xl font-extrabold text-iris-600/20">
                  {step.number}
                </span>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
                {step.code && (
                  <div className="mt-4 rounded-lg bg-black/50 px-4 py-2.5 font-mono text-sm text-iris-300">
                    <span className="mr-2 text-zinc-600">$</span>
                    {step.code}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
