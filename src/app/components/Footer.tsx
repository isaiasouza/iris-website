import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Iris Downloader" width={32} height={32} className="rounded-lg" />
              <span className="font-semibold text-white">Iris Downloader</span>
            </div>
            <p className="mt-3 text-sm text-[#58585F]">
              Google Drive para Mac, do jeito certo.
            </p>
            <a
              href="https://github.com/isaiasouza/IrisDownloader"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#58585F] transition-colors hover:text-[#9F9FA3]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#58585F]">Navegação</p>
            <ul className="mt-4 space-y-2">
              {[
                { label: "Recursos", href: "#features" },
                { label: "Screenshots", href: "#screenshots" },
                { label: "Preços", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#58585F]">Legal</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/terms" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
                  Termos de uso
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
                  Política de privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-8">
          <p className="text-center text-sm text-[#58585F]">
            &copy; {year} Iris Media. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
