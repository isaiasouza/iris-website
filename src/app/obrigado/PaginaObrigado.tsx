"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  KeyRound,
  Mail,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { formatPurchaseValue } from "@/lib/purchase";
import { PurchaseTracker } from "./PurchaseTracker";
import { UpsellCard, type UpsellOffer } from "./UpsellCard";

interface PaginaObrigadoProps {
  orderId: string | null;
  value: number | null;
  upsell: UpsellOffer | null;
}

const nextSteps = [
  {
    icon: Mail,
    title: "Abra o e-mail da compra",
    text: "Sua chave de licença chega em instantes. Confira também Spam e Promoções.",
  },
  {
    icon: Download,
    title: "Instale o Iris no Mac",
    text: "Baixe o aplicativo, abra o DMG e arraste o Iris para Aplicativos.",
  },
  {
    icon: KeyRound,
    title: "Ative sua licença",
    text: "Cole a chave no Iris e conecte sua conta Google para começar.",
  },
];

export function PaginaObrigado({ orderId, value, upsell }: PaginaObrigadoProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const formattedValue = formatPurchaseValue(value);

  async function sharePurchase() {
    const shareData = {
      title: "Iris Downloader",
      text: "Acabei de comprar o Iris Downloader para baixar pastas do Google Drive no Mac sem ZIP.",
      url: "https://www.irisdownloader.com.br",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("shared");
        return;
      }

      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setShareStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus("error");
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#071018] px-4 py-6 text-white sm:px-6 sm:py-10">
      {orderId && value !== null && <PurchaseTracker orderId={orderId} value={value} />}

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,.10),transparent_38%)]" />

      <div className="relative mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-white/8 pb-5">
          <Link href="/" aria-label="Iris Downloader — início" className="flex items-center gap-3">
            <Image src="/logo-web.png" alt="" width={36} height={36} className="rounded-xl" priority />
            <span className="text-sm font-semibold text-white/80">Iris Downloader</span>
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4" /> Compra aprovada
          </span>
        </header>

        <section className="mx-auto max-w-3xl py-12 text-center sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-300 shadow-[0_16px_60px_rgba(110,231,183,.12)]">
            <Check className="h-8 w-8" strokeWidth={2.4} />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
            Pagamento confirmado
          </p>
          <h1 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl">
            Deu certo. Sua compra está segura.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/58 sm:text-base">
            A licença está sendo preparada e será enviada para o e-mail usado no pagamento.
          </p>

          {(orderId || formattedValue) && (
            <dl className="mx-auto mt-7 grid max-w-md grid-cols-2 overflow-hidden rounded-xl border border-white/10 bg-white/4 text-left">
              <div className="border-r border-white/8 px-4 py-3">
                <dt className="text-[10px] uppercase tracking-wider text-white/35">Pedido</dt>
                <dd className="mt-1 truncate text-sm font-medium text-white/78">{orderId ?? "Confirmado"}</dd>
              </div>
              <div className="px-4 py-3">
                <dt className="text-[10px] uppercase tracking-wider text-white/35">Valor aprovado</dt>
                <dd className="mt-1 text-sm font-medium text-white/78">{formattedValue ?? "Confirmado"}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#0C151E]/90 p-5 sm:p-8" aria-labelledby="next-steps-title">
          <div className="sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/65">Agora faça isso</p>
              <h2 id="next-steps-title" className="mt-2 text-2xl font-medium tracking-[-0.03em] text-white">
                Três passos até o primeiro download
              </h2>
            </div>
            <p className="mt-2 text-sm text-white/42 sm:mt-0">Leva poucos minutos.</p>
          </div>

          <ol className="mt-7 grid gap-3 md:grid-cols-3">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="relative rounded-xl border border-white/8 bg-white/3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-200/8 text-cyan-200">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-xs font-medium tabular-nums text-white/25">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-white/48">{step.text}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Link
              href="/minha-licenca"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#071018] transition hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              Acessar minha licença
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/download"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/4 px-5 py-3.5 text-sm font-medium text-white/72 transition hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <Download className="h-4 w-4" /> Baixar o app
            </Link>
          </div>
        </section>

        {upsell && orderId && (
          <div className="mt-5">
            <UpsellCard offer={upsell} orderId={orderId} />
          </div>
        )}

        <section className="py-9 text-center">
          <p className="text-sm text-white/45">Conhece alguém que também sofre com ZIP do Drive?</p>
          <button
            type="button"
            onClick={sharePurchase}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/72 transition hover:border-cyan-200/25 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            {shareStatus === "copied" ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            {shareStatus === "shared" && "Compartilhado"}
            {shareStatus === "copied" && "Texto copiado"}
            {(shareStatus === "idle" || shareStatus === "error") && "Compartilhar minha compra"}
          </button>
          <p className="mt-2 min-h-4 text-xs text-white/35" aria-live="polite">
            {shareStatus === "error" ? "Não foi possível compartilhar neste navegador." : "Não compartilhamos o número do pedido."}
          </p>
        </section>
      </div>
    </main>
  );
}
