import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-0 md:pt-40">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-iris-700/12 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-iris-500/25 bg-iris-600/10 px-4 py-1.5 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-iris-400 animate-pulse-glow" />
          <span className="text-sm font-medium text-iris-300">
            v2.1.0 · Novo motor, 3× mais rápido
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-up animate-delay-100">
          O Google Drive te obriga{" "}
          <br className="hidden md:block" />
          a baixar em ZIP.{" "}
          <span className="bg-gradient-to-r from-iris-400 to-iris-500 bg-clip-text text-transparent">
            O Iris não.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#9F9FA3] md:text-xl animate-fade-up animate-delay-200">
          Baixe pastas inteiras, arquivos grandes, várias contas Google — tudo direto
          no Mac, sem compactar, sem travar, sem abrir o navegador.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up animate-delay-300">
          <a
            href="#pricing"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-iris-700/25 transition-all hover:shadow-2xl hover:shadow-iris-600/35 hover:brightness-110"
          >
            Ver planos — a partir de R$ 49,90
          </a>
          <a
            href="https://www.irisdownloader.com.br/Iris%20Downloader.dmg"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#9F9FA3] transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Baixar grátis para testar
          </a>
        </div>

        <p className="mt-5 text-sm text-[#58585F] animate-fade-up animate-delay-400">
          macOS 14+ &middot; Apple Silicon + Intel &middot; Sem dependências
        </p>

        {/* Real screenshot */}
        <div className="relative mx-auto mt-14 max-w-5xl animate-fade-up animate-delay-500">
          <div className="rounded-xl overflow-hidden border border-white/8 shadow-2xl shadow-iris-950/50">
            <Image
              src="/screenshots/downloads.png"
              alt="Iris Downloader — baixando pastas do Google Drive no Mac"
              width={1200}
              height={750}
              className="w-full"
              priority
            />
          </div>
          {/* Fade out at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#13131A] to-transparent" />
        </div>
      </div>
    </section>
  );
}
