export default function CTAFinal() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-800/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-extrabold text-white md:text-5xl">
          Chega de ZIP corrompido.{" "}
          <span className="bg-gradient-to-r from-iris-400 to-iris-500 bg-clip-text text-transparent">
            Baixe do Drive do jeito certo.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-[#9F9FA3]">
          Teste grátis. Se não gostar em 7 dias, devolvemos tudo.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#pricing"
            className="rounded-full bg-gradient-to-r from-iris-700 to-iris-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-iris-800/25 transition-all hover:brightness-110 hover:shadow-2xl hover:shadow-iris-700/35"
          >
            Ver planos
          </a>
          <a
            href="https://www.irisdownloader.com.br/Iris%20Downloader.dmg"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#9F9FA3] transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Baixar grátis
          </a>
        </div>

        <p className="mt-6 text-sm text-[#58585F]">
          macOS 14+ &middot; Apple Silicon + Intel &middot; 7 dias de garantia
        </p>
      </div>
    </section>
  );
}
