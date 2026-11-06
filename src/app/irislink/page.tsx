import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cable,
  Clapperboard,
  Download,
  Gauge,
  HardDrive,
  Plus,
  Radar,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  ToggleRight,
} from "lucide-react";
import { Eyebrow, IrisMark, SectionHeader, btnPrimary, btnSecondary } from "../components/brand";
import SpotlightCard from "../components/SpotlightCard";
import { cn } from "@/lib/utils";
import IrisLinkMark from "./IrisLinkMark";
import LinkAppWindow from "./LinkAppWindow";
import LeadForm from "./LeadForm";

const URL_PAGE = "https://www.irisdownloader.com.br/irislink";
const TITLE = "IRIS Link — Edite nos discos de outro Mac";
const DESCRIPTION =
  "App grátis para Mac: monte os HDs e SSDs de outro Mac pelo cabo Thunderbolt ou pela rede e edite no DaVinci sem copiar a mídia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "IRIS Link",
    "editar em disco de outro Mac",
    "Ponte Thunderbolt Mac",
    "compartilhar HD entre Macs",
    "SMB Mac DaVinci",
    "montar disco de rede Mac",
  ],
  alternates: { canonical: URL_PAGE },
  openGraph: {
    title: "IRIS Link — Os discos de um Mac, direto no outro",
    description: DESCRIPTION,
    type: "website",
    url: URL_PAGE,
    siteName: "Iris Media",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "IRIS Link — Os discos de um Mac, direto no outro",
    description: DESCRIPTION,
  },
};

const pains = [
  {
    title: "Configuração escondida",
    text: "Ligar o Compartilhamento de Arquivos, adicionar cada disco, liberar a conta para SMB e montar com Cmd+K digitando endereço.",
  },
  {
    title: "Rota errada",
    text: "Com o cabo Thunderbolt ligado, o Finder costuma montar pela Wi-Fi, bem mais lenta, sem avisar.",
  },
  {
    title: "SMB lento por padrão",
    text: "A assinatura de pacotes e o cache de pastas do macOS derrubam a velocidade e atrasam arquivos novos no DaVinci.",
  },
  {
    title: "Queda silenciosa",
    text: "O disco desmonta no sono, no cabo ou na rede, o DaVinci fica com mídia offline e ninguém remonta.",
  },
];

const features = [
  { icon: ToggleRight, title: "Compartilhe com um interruptor", text: "No Mac dos discos, um interruptor por disco. Pastas avulsas também, e sempre com senha." },
  { icon: Radar, title: "Os Macs se acham sozinhos", text: "Abra o app nos dois e o outro Mac aparece na lista, com os discos dele. Sem digitar endereço." },
  { icon: Cable, title: "Prefere o cabo Thunderbolt", text: "Se o cabo alcança o outro Mac, o app monta por ele. Se não, usa a rede local. E avisa quando dá para trocar." },
  { icon: RefreshCw, title: "Monta e reconecta sozinho", text: "Marque “Montar sozinho” e o disco já está lá quando você abre o DaVinci. Se cair, o app monta de novo." },
  { icon: Gauge, title: "Velocidade à vista", text: "Velocímetro ao vivo do cabo e da rede, e um teste de gravação e leitura em cada disco montado." },
  { icon: SlidersHorizontal, title: "SMB ajustado para edição", text: "Ajustes prontos para deixar o SMB mais rápido, com um caminho de volta para cada um." },
  { icon: Smartphone, title: "Também no iPhone e no iPad", text: "Um QR code abre os discos do Mac no app Arquivos, na mesma Wi-Fi. Sem instalar nada no celular." },
  { icon: ShieldCheck, title: "Nenhuma senha guardada pelo app", text: "Login e senha ficam com o macOS e o Porta-chaves. O app não abre porta de dados própria." },
];

const steps = [
  { title: "Instale nos dois Macs", text: "Abra o DMG e arraste para Aplicativos. Na primeira abertura, diga se o Mac tem os discos, edita ou os dois." },
  { title: "Compartilhe os discos", text: "No Mac dos discos, a configuração guiada liga o compartilhamento e você escolhe quais discos o outro Mac vai usar." },
  { title: "Clique em Conectar", text: "No Mac de edição, o Mac dos discos aparece sozinho. Conecte e o disco surge no Finder e no DaVinci." },
];

const faqs = [
  {
    q: "Quanto custa?",
    a: "Nada. O IRIS Link é grátis nesta fase beta. Você só deixa nome, e-mail e WhatsApp para baixar.",
  },
  {
    q: "Meus arquivos passam por algum servidor?",
    a: "Não. O IRIS Link não tem protocolo próprio: os arquivos vão direto de um Mac para o outro pelo SMB do próprio macOS, pelo cabo ou pela sua rede local.",
  },
  {
    q: "Funciona pela internet, fora do escritório?",
    a: "Não. Os dois Macs precisam estar na mesma rede local ou ligados por um cabo Thunderbolt.",
  },
  {
    q: "Preciso instalar nos dois Macs?",
    a: "Sim. O mesmo app faz os dois papéis: no Mac que tem os discos, ele compartilha; no Mac de edição, ele monta. Um Mac pode fazer as duas coisas.",
  },
  {
    q: "Funciona com Premiere e Final Cut?",
    a: "Sim. O disco montado é um volume de rede comum, então qualquer app que lê disco enxerga a mídia: Finder, DaVinci, Premiere, Final Cut.",
  },
  {
    q: "Quais Macs são compatíveis?",
    a: "Macs com Apple Silicon e macOS 14 Sonoma ou mais novo. Macs Intel, Windows e Linux não são suportados.",
  },
  {
    q: "É seguro?",
    a: "O app compartilha os discos exigindo senha, não guarda senhas (elas ficam com o macOS) e todo ajuste de sistema que ele faz pode ser desfeito dentro do próprio app.",
  },
];

function LinkHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 rounded-2xl bg-brand-surface/70 pl-3 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] backdrop-blur-xl sm:pl-4">
        <a href="#topo" className="flex min-w-0 items-center gap-2.5" aria-label="IRIS Link — início">
          <IrisLinkMark size={28} />
          <span className="font-display text-[15px] font-bold tracking-[0.02em] text-white">
            IRIS <span className="text-brand-secondary">Link</span>
          </span>
        </a>
        <div className="hidden items-center gap-0.5 md:flex">
          {[
            { label: "Recursos", href: "#recursos" },
            { label: "Como funciona", href: "#como-funciona" },
            { label: "Dúvidas", href: "#duvidas" },
          ].map((item) => (
            <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-brand-text-2 transition-colors hover:bg-white/[0.05] hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
        <a href="#baixar" className={cn(btnPrimary, "iris-shine h-10 rounded-xl px-3.5 text-sm shadow-[0_8px_24px_-8px_rgba(107,85,240,0.9)]")}>
          <Download className="h-4 w-4" /> Baixar grátis
        </a>
      </nav>
    </header>
  );
}

export default function IrisLinkPage() {
  return (
    <main id="topo" className="min-h-screen overflow-x-clip">
      <LinkHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 sm:pt-40">
        <div className="iris-aurora" aria-hidden="true" />
        <div className="iris-grid" aria-hidden="true" />
        <div className="relative z-[2] mx-auto max-w-6xl px-4 text-center sm:px-6">
          <span className="iris-rise inline-flex max-w-full items-center gap-2 rounded-full bg-brand-primary/15 py-1 pl-1 pr-3.5 text-[13px] text-iris-100 ring-1 ring-inset ring-brand-secondary/35">
            <span className="shrink-0 rounded-full bg-noite-top px-2.5 py-0.5 text-[11.5px] font-semibold text-white">Beta grátis</span>
            <span className="truncate">Novo app da Iris Media</span>
          </span>

          <h1
            className="iris-rise mx-auto mt-6 max-w-5xl text-balance font-display text-[34px] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-[48px] lg:text-[60px]"
            style={{ animationDelay: "0.1s" }}
          >
            Os discos de um Mac, <span className="text-iris-grad sm:block">direto no outro.</span>
          </h1>

          <p className="iris-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-brand-text-2 sm:text-lg sm:leading-8" style={{ animationDelay: "0.2s" }}>
            Edite no DaVinci com a mídia que está nos HDs e SSDs de outro Mac, pelo cabo Thunderbolt ou pela rede. Sem copiar terabytes e sem configurar nada à mão.
          </p>

          <div className="iris-rise mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
            <a href="#baixar" className={cn(btnPrimary, "iris-shine group shadow-[0_10px_34px_-10px_rgba(107,85,240,0.9)]")}>
              <Download className="h-5 w-5" /> Baixar grátis para Mac
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#como-funciona" className={cn(btnSecondary, "bg-white/[0.03]")}>
              Ver como funciona
            </a>
          </div>

          <p className="iris-rise mt-4 text-xs text-brand-muted" style={{ animationDelay: "0.35s" }}>
            Grátis · macOS 14+ · Apple Silicon · instale nos dois Macs
          </p>

          <div className="iris-rise" style={{ animationDelay: "0.45s" }}>
            <LinkAppWindow />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-brand-bg" aria-hidden="true" />
      </section>

      {/* Dores */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="O problema"
            title={<>A mídia está num Mac. <span className="text-iris-grad">A edição, no outro.</span></>}
            text="Hoje isso vira copiar terabytes ou configurar o Compartilhamento de Arquivos do macOS na mão. E o caminho manual tem quatro dores."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {pains.map((p, i) => (
              <div key={p.title} className="rounded-2xl bg-brand-surface p-6 ring-1 ring-white/[0.07]">
                <p className="font-display text-sm font-bold text-brand-secondary">0{i + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-text-2">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="O que o IRIS Link faz"
            title={<>Um app só, <span className="text-iris-grad">nos dois Macs</span></>}
            text="Ele usa o que o macOS já tem de mais rápido, a Ponte Thunderbolt e o SMB nativo, e automatiza o que hoje é manual."
          />

          <div className="mt-14 grid gap-4 md:grid-cols-4">
            <article className="bg-noite relative overflow-hidden rounded-2xl p-7 sm:p-9 md:col-span-4">
              <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/12 text-white">
                    <Clapperboard className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-[30px]">
                    Para o DaVinci, é um disco comum
                  </h3>
                  <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-white/80">
                    O disco do outro Mac aparece no Finder e no DaVinci em <code className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[0.9em]">/Volumes/NOME</code>, sempre no mesmo caminho. Se o macOS montar com outro nome, o app avisa antes que a mídia fique offline.
                  </p>
                </div>
                <div className="rounded-xl bg-black/25 p-4 font-mono text-[13px] leading-8 text-iris-100 ring-1 ring-inset ring-white/12" aria-label="Exemplo: discos do outro Mac montados em Volumes">
                  <p className="flex items-center gap-2"><HardDrive className="h-4 w-4" /> /Volumes</p>
                  <p className="flex items-center justify-between gap-3 pl-6"><span className="truncate">RAID Projetos</span><span className="shrink-0 text-[#FFB27F]">Thunderbolt</span></p>
                  <p className="flex items-center justify-between gap-3 pl-6"><span className="truncate">SSD Mídia</span><span className="shrink-0 text-emerald-300">Rede</span></p>
                </div>
              </div>
            </article>

            {features.map(({ icon: Icon, title, text }) => (
              <SpotlightCard key={title} className="p-6 md:col-span-2 lg:col-span-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/12 text-brand-secondary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-text-2">{text}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="Como funciona" title={<>Do DMG ao disco montado <span className="text-iris-grad">em 3 passos</span></>} />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            <span className="iris-flow absolute left-[16%] right-[16%] top-7 hidden h-0.5 opacity-60 md:block" aria-hidden="true" />
            {steps.map((step, i) => (
              <li key={step.title} className="relative text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-surface-2 font-display text-xl font-bold text-white shadow-[0_0_40px_-6px_rgba(107,85,240,0.7)] ring-1 ring-brand-secondary/40" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-white">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-brand-text-2">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Baixar */}
      <section id="baixar" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 overflow-hidden rounded-[28px] bg-[#15131f] px-6 py-12 ring-1 ring-brand-secondary/30 sm:px-12 sm:py-16 md:grid-cols-2">
          <div className="iris-aurora !inset-0 !h-full" aria-hidden="true" />
          <div className="relative text-center md:text-left">
            <IrisLinkMark size={64} className="mx-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.35)] md:mx-0" />
            <Eyebrow className="mt-8">Beta grátis</Eyebrow>
            <h2 className="mt-3 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[40px]">
              Baixe o IRIS Link
            </h2>
            <p className="mt-4 text-pretty text-base leading-7 text-white/85">
              Deixe seu contato e o download começa na hora. Instale nos dois Macs: o que tem os discos e o que edita.
            </p>
            <p className="mt-4 text-xs text-white/70">Versão 0.1.5 · DMG assinado e notarizado · macOS 14+ · Apple Silicon</p>
          </div>
          <div className="relative rounded-2xl bg-brand-surface p-5 ring-1 ring-white/10 sm:p-7">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Dúvidas */}
      <section id="duvidas" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeader eyebrow="Dúvidas" title="Perguntas frequentes" />
          <div className="mt-12 divide-y divide-white/[0.07] rounded-2xl bg-brand-surface ring-1 ring-white/[0.07]">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 sm:px-6">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="h-4 w-4 shrink-0 text-brand-secondary transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-5 text-sm leading-6 text-brand-text-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-white/[0.06] bg-brand-surface py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <IrisLinkMark size={36} />
              <span className="font-display text-[15px] font-bold text-white">
                IRIS <span className="text-brand-secondary">Link</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-brand-text-2">Os discos de um Mac, direto no outro.</p>
          </div>
          <Link href="/" className="flex items-center gap-3 rounded-xl bg-brand-surface-2 px-4 py-3 ring-1 ring-white/[0.07] transition-colors hover:bg-[#26262d]">
            <IrisMark size={32} />
            <span>
              <span className="block text-sm font-semibold text-white">Conheça o Iris Downloader</span>
              <span className="block text-xs text-brand-text-2">Pastas grandes do Google Drive, sem ZIP</span>
            </span>
            <ArrowRight className="h-4 w-4 text-brand-secondary" />
          </Link>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/[0.06] px-4 pt-8 text-sm text-brand-muted sm:flex-row sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Iris Media. Todos os direitos reservados.</p>
          <p className="flex gap-4">
            <a href="/privacy" className="hover:text-white">Privacidade</a>
            <a href="/terms" className="hover:text-white">Termos</a>
          </p>
        </div>
      </footer>
    </main>
  );
}
