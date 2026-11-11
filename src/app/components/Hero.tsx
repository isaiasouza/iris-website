import { ArrowRight, Download } from "lucide-react";
import HeroApp from "./HeroApp";
import { btnPrimary, btnSecondary } from "./brand";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40">
      <div className="iris-aurora" aria-hidden="true" />
      <div className="iris-grid" aria-hidden="true" />

      <div className="relative z-[2] mx-auto max-w-6xl px-4 text-center sm:px-6">
        <a
          href="#features"
          className="iris-rise inline-flex max-w-full items-center gap-2 rounded-full bg-brand-primary/15 py-1 pl-1 pr-3.5 text-[13px] text-iris-100 ring-1 ring-inset ring-brand-secondary/35 transition-colors hover:bg-brand-primary/25"
        >
          <span className="shrink-0 rounded-full bg-noite-top px-2.5 py-0.5 text-[11.5px] font-semibold text-white">Novo</span>
          <span className="truncate">Pause e retome pastas de 100 GB</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </a>

        <h1
          className="iris-rise mx-auto mt-6 max-w-5xl text-balance font-display text-[34px] font-bold leading-[1.06] tracking-[-0.03em] text-white sm:text-[48px] lg:text-[60px]"
          style={{ animationDelay: "0.1s" }}
        >
          Baixe pastas grandes do Drive. <span className="text-iris-grad sm:block">Sem esperar o ZIP.</span>
        </h1>

        <p
          className="iris-rise mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-brand-text-2 sm:text-lg sm:leading-8"
          style={{ animationDelay: "0.2s" }}
        >
          Cole o link de uma pasta do Drive, Dropbox ou OneDrive, ou de um vídeo do YouTube, Instagram ou TikTok. O Iris baixa 10, 50 ou 100 GB direto no Mac, com as pastas no lugar.
        </p>

        <div className="iris-rise mt-8 flex flex-col justify-center gap-3 sm:flex-row" style={{ animationDelay: "0.3s" }}>
          <a href="/download" className={cn(btnPrimary, "iris-shine group shadow-[0_10px_34px_-10px_rgba(107,85,240,0.9)]")}>
            <Download className="h-5 w-5" />
            <span className="sm:hidden">Baixar grátis</span>
            <span className="hidden sm:inline">Baixar grátis para Mac</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href="#pricing" className={cn(btnSecondary, "bg-white/[0.03]")}>
            Licenças a partir de R$ 49,90
          </a>
        </div>

        <p className="iris-rise mt-4 text-xs text-brand-muted" style={{ animationDelay: "0.35s" }}>
          Teste sem cartão · Não precisa entrar com o Google · macOS 14+ · Apple Silicon e Intel
        </p>

        <div className="iris-rise" style={{ animationDelay: "0.45s" }}>
          <HeroApp />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-32 bg-gradient-to-b from-transparent to-brand-bg" aria-hidden="true" />
    </section>
  );
}
