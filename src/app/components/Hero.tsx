export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-iris-600/15 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-iris-500/8 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-iris-500/20 bg-iris-600/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-iris-400 animate-pulse-glow" />
          <span className="text-sm font-medium text-iris-300">
            v1.8.1 — Grátis para macOS
          </span>
        </div>

        {/* Heading */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
          Baixe do{" "}
          <span className="bg-gradient-to-r from-iris-400 to-iris-600 bg-clip-text text-transparent">
            Google Drive
          </span>
          <br />
          sem compactar
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[#9F9FA3] md:text-xl">
          Transfira pastas e arquivos diretamente para o seu Mac.
          Sem limites de tamanho, sem ZIP, sem complicação. Upload fácil com drag-and-drop.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#download"
            className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-iris-600/20 transition-all hover:shadow-2xl hover:shadow-iris-600/30 hover:brightness-110"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download para macOS
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-base font-semibold text-[#9F9FA3] transition-all hover:border-white/20 hover:text-white"
          >
            Saiba mais
          </a>
        </div>

        {/* System requirements */}
        <p className="mt-6 text-sm text-[#58585F]">
          Requer macOS 14 (Sonoma) ou superior &middot; Apple Silicon &middot; Inclui tudo, sem dependências extras
        </p>

        {/* App preview mockup */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="animate-float rounded-2xl border border-white/8 bg-[#19191E] p-1 shadow-2xl shadow-iris-900/20">
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
                <div className="flex items-center gap-2 rounded-md bg-gradient-to-r from-iris-600/30 to-iris-500/20 border border-iris-500/20 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-iris-500" />
                  <span className="text-xs font-medium text-iris-300">Downloads</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Uploads</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Histórico</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <div className="h-3 w-3 rounded bg-[#58585F]" />
                  <span className="text-xs text-[#9F9FA3]">Configurações</span>
                </div>
              </div>
              {/* Main content */}
              <div className="flex-1 bg-[#19191E] p-4 space-y-3">
                {/* Download item 1 */}
                <div className="rounded-lg bg-[#13131A] border border-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">Projeto Final</span>
                    <span className="text-xs text-iris-400">85%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#2a2a35]">
                    <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-iris-600 to-iris-500" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-[#58585F]">
                    <span>1.2 GB / 1.4 GB</span>
                    <span>45 MB/s</span>
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
