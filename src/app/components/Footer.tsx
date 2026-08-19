import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#404040] bg-[#1f1f1f] py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo-web.png" alt="Iris Downloader" width={32} height={32} className="rounded-md" />
              <span className="font-semibold text-white">Iris Downloader</span>
            </div>
            <p className="mt-3 text-sm text-neutral-500">
              Google Drive para Mac, do jeito certo.
            </p>
            <a
              href="/download"
              className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-blue-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase text-neutral-500">Navegação</p>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Recursos", href: "#features" },
                { label: "Screenshots", href: "#screenshots" },
                { label: "Preços", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase text-neutral-500">Legal</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/terms" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-neutral-400 transition-colors hover:text-white">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#404040] pt-8">
          <p className="text-center text-sm text-neutral-500">
            &copy; {year} Iris Media. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
