export default function Download() {
  return (
    <section id="download" className="relative py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-800/50 to-zinc-900/50 p-10 backdrop-blur-sm md:p-16">
          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-iris-500 to-iris-700 shadow-xl shadow-iris-600/20">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>

          <h2 className="mt-8 text-3xl font-bold text-white md:text-4xl">
            Baixe agora, é grátis
          </h2>
          <p className="mt-4 text-zinc-400">
            Comece a transferir seus arquivos do Google Drive em segundos.
            Sem cadastro, sem assinatura.
          </p>

          {/* Download button */}
          <a
            href="/Iris Downloader.dmg"
            download
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-iris-600/25 transition-all hover:shadow-2xl hover:shadow-iris-600/30 hover:brightness-110"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download para macOS
          </a>

          {/* Info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span>v1.0</span>
            <span>&middot;</span>
            <span>2.7 MB</span>
            <span>&middot;</span>
            <span>macOS 14+</span>
            <span>&middot;</span>
            <span>Apple Silicon</span>
          </div>

          {/* Installation note */}
          <div className="mt-8 rounded-xl border border-yellow-500/10 bg-yellow-500/5 px-6 py-4 text-left">
            <p className="text-sm font-medium text-yellow-400/90">
              Nota de instalação
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              Como o app ainda não é notarizado pela Apple, o macOS pode bloquear a abertura.
              Clique com o botão direito no app &rarr; &ldquo;Abrir&rdquo; para autorizar.
              Você também precisa do{" "}
              <a
                href="https://brew.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-iris-400 underline underline-offset-2 hover:text-iris-300"
              >
                Homebrew
              </a>{" "}
              e do{" "}
              <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-iris-300">
                rclone
              </code>{" "}
              instalados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
