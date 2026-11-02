import Link from "next/link";
import { Download } from "lucide-react";
import BrandWordmark from "./BrandWordmark";
import { IrisMark } from "./brand";

const navigation = [
  { label: "Recursos", href: "#features" },
  { label: "O app", href: "#screenshots" },
  { label: "Preços", href: "#pricing" },
  { label: "Dúvidas", href: "#faq" },
];

const account = [
  { label: "Baixar para Mac", href: "/download" },
  { label: "Minha licença", href: "/minha-licenca" },
];

const legal = [
  { label: "Termos de uso", href: "/terms" },
  { label: "Política de privacidade", href: "/privacy" },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm text-brand-text-2 transition-colors hover:text-white">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-brand-surface py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3" aria-label="Iris Downloader — início">
              <IrisMark size={36} />
              <BrandWordmark className="text-[15px] text-white" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-brand-text-2">Google Drive para Mac, do jeito certo.</p>
            <a href="/download" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-secondary transition-colors hover:text-iris-300">
              <Download className="h-4 w-4" />
              Baixar grátis
            </a>
          </div>
          <Column title="Navegação" links={navigation} />
          <Column title="Conta" links={account} />
          <Column title="Legal" links={legal} />
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/[0.06] pt-8 text-sm text-brand-muted sm:flex-row sm:justify-between">
          <p>&copy; {year} Iris Media. Todos os direitos reservados.</p>
          <p>contato@irisdownloader.com.br</p>
        </div>
      </div>
    </footer>
  );
}
