import { ArrowRight, Download } from "lucide-react";
import { IrisMark, btnPrimary } from "./brand";
import { cn } from "@/lib/utils";

export default function CTAFinal() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#15131f] px-6 py-16 text-center ring-1 ring-brand-secondary/30 sm:px-12 sm:py-24">
        <div className="iris-aurora !inset-0 !h-full" aria-hidden="true" />
        <div className="relative">
        <IrisMark size={64} className="mx-auto drop-shadow-[0_10px_28px_rgba(0,0,0,0.35)]" />
        <h2 className="mx-auto mt-8 max-w-3xl text-balance font-display text-[30px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[48px]">
          Seu próximo job <span className="text-iris-grad">não precisa virar ZIP.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-white/85 sm:text-lg">
          Instale no Mac, conecte uma conta Google e teste com a pasta que mais dá trabalho hoje.
        </p>
        <div className="mx-auto mt-9 flex max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <a href="/download" className={cn(btnPrimary, "iris-shine group shadow-[0_10px_34px_-10px_rgba(107,85,240,0.9)]")}>
            <Download className="h-5 w-5" />
            Baixar e testar agora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#pricing"
            className="inline-flex h-12 items-center justify-center rounded-[10px] px-5 text-[15px] font-medium text-white ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10"
          >
            Ver planos
          </a>
        </div>
        <p className="mt-5 text-xs text-white/75">Sem cartão · macOS 14+ · 7 dias de garantia na compra</p>
        </div>
      </div>
    </section>
  );
}
