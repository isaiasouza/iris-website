export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-iris-700/15 blur-[130px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-iris-500/8 blur-[100px]" />
        <div className="absolute left-0 bottom-1/4 h-[300px] w-[300px] rounded-full bg-iris-600/6 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-iris-500/25 bg-iris-600/10 px-4 py-1.5 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-iris-400 animate-pulse-glow" />
          <span className="text-sm font-medium text-iris-300">
            v2.0 · Novo motor, 3× mais rápido
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl animate-fade-up animate-delay-100">
          Baixe do{" "}
          <span className="bg-gradient-to-r from-iris-400 to-iris-500 bg-clip-text text-transparent">
            Google Drive
          </span>
          <br />
          sem compactar
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#9F9FA3] md:text-xl animate-fade-up animate-delay-200">
          Transfira pastas e arquivos diretamente para o seu Mac. Velocidade total, sem ZIP,
          sem dependências externas. Múltiplas contas Google em um só app.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up animate-delay-300">
          <a
            href="#pricing"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-iris-700/25 transition-all hover:shadow-2xl hover:shadow-iris-600/35 hover:brightness-110"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Ver planos
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#9F9FA3] transition-all hover:border-white/20 hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download grátis
          </a>
        </div>

        {/* System requirements */}
        <p className="mt-6 text-sm text-[#58585F] animate-fade-up animate-delay-400">
          macOS 14+ &middot; Apple Silicon + Intel &middot; Sem dependências externas
        </p>

        {/* App preview mockup */}
        <div className="relative mx-auto mt-16 max-w-3xl animate-fade-up animate-delay-500">
          <div className="animate-float rounded-2xl border border-white/8 bg-[#19191E] p-1 shadow-2xl shadow-iris-950/40">
            {/* macOS title bar */}
            <div className="flex items-center gap-2 rounded-t-xl bg-[#13131A] px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-[#58585F]">Iris Downloader</span>
            </div>
            {/* Simulated app content */}
            <div className="flex gap-0 overflow-hidden rounded-b-xl">
              {/* Sidebar */}
              <div className="w-44 shrink-0 bg-[#13131A] p-3 space-y-1">
                <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-iris-700/30 to-iris-600/15 border border-iris-500/20 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-iris-500" />
                  <span className="text-xs font-medium text-iris-300">Drive</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Downloads</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Social</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Histórico</span>
                </div>
              </div>
              {/* Main content */}
              <div className="flex-1 bg-[#19191E] p-4 space-y-2">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-16 rounded bg-[#2a2a35]" />
                    <div className="h-5 w-20 rounded bg-[#2a2a35]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded bg-[#2a2a35]" />
                    <div className="h-5 w-5 rounded bg-[#2a2a35]" />
                  </div>
                </div>
                {/* Download item 1 */}
                <div className="rounded-lg bg-[#13131A] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Projeto Final.zip</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-iris-400">85%</span>
                      <div className="h-4 w-4 rounded bg-iris-600/30 flex items-center justify-center">
                        <div className="h-2 w-0.5 bg-iris-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a2a35]">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-iris-700 to-iris-500" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-[#58585F]">
                    <span>1.2 GB / 1.4 GB</span>
                    <span>45 MB/s · 8s restantes</span>
                  </div>
                </div>
                {/* Download item 2 */}
                <div className="rounded-lg bg-[#13131A] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Fotos Viagem 2024</span>
                    <span className="text-xs text-green-400">Concluído</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a2a35]">
                    <div className="h-full w-full rounded-full bg-green-500/80" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-[#58585F]">
                    <span>3.8 GB / 3.8 GB</span>
                    <span>247 arquivos</span>
                  </div>
                </div>
                {/* Download item 3 */}
                <div className="rounded-lg bg-[#13131A] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Backup Documentos</span>
                    <span className="text-xs text-[#9F9FA3]">Na fila</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a2a35]">
                    <div className="h-full w-0 rounded-full bg-iris-600" />
                  </div>
                  <div className="mt-1.5 text-[10px] text-[#58585F]">
                    <span>Aguardando...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
