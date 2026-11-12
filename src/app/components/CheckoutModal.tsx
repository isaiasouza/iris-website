"use client";

import { ArrowRight, CreditCard, Loader2, Lock, Mail, QrCode, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BrandWordmark from "./BrandWordmark";
import { IrisMark, btnPrimary } from "./brand";
import { cn } from "@/lib/utils";

type Plan = "annual" | "lifetime";

const PLAN_INFO: Record<Plan, {
  tab: string;
  label: string;
  price: string;
  period?: string;
  note: string;
  pix: boolean;
}> = {
  annual: {
    tab: "Anual",
    label: "Licença anual",
    price: "R$ 49,90",
    period: "/ano",
    note: "1 ano de acesso completo. Renova sozinho no cartão; cancele quando quiser.",
    pix: false,
  },
  lifetime: {
    tab: "Vitalício",
    label: "Licença vitalícia",
    price: "R$ 110,99",
    note: "Pagamento único e atualizações futuras da linha V2.",
    pix: true,
  },
};

const STEPS = ["Seus dados", "Pagamento", "Licença"];

const inputClass =
  "h-11 w-full rounded-[10px] bg-brand-bg px-3 text-base text-white ring-1 ring-inset ring-white/10 outline-none transition placeholder:text-brand-muted focus:ring-2 focus:ring-brand-secondary/70";

interface CheckoutModalProps {
  plan: Plan;
  onClose: () => void;
}

export default function CheckoutModal({ plan: initialPlan, onClose }: CheckoutModalProps) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const info = PLAN_INFO[plan];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // CPF/CNPJ não é pedido aqui: a AbacatePay pede no checkout dela.
        body: JSON.stringify({ plan, name, email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.checkoutUrl) throw new Error(json.error ?? "Não foi possível abrir o pagamento.");
      window.location.href = json.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o pagamento.");
      setLoading(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !loading && onClose()}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        className={cn(
          "dark max-h-[92dvh] gap-0 overflow-y-auto [color-scheme:dark] border-0 bg-brand-surface p-0 text-white ring-1 ring-white/10 sm:max-w-[440px] sm:rounded-2xl",
          // No celular, a janela sobe de baixo como uma folha.
          "max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-t-3xl max-sm:rounded-b-none"
        )}
      >
        {/* Resumo do pedido */}
        <DialogHeader className="bg-noite relative gap-0 overflow-hidden p-6 pr-14 text-left sm:px-7 sm:pr-14">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="relative flex items-center gap-3">
            <IrisMark size={40} className="shrink-0 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]" />
            <div className="min-w-0">
              <BrandWordmark className="text-[13px] text-white" />
              <DialogDescription className="text-xs text-white/75">{info.label} · macOS</DialogDescription>
            </div>
          </div>

          <DialogTitle className="relative mt-5 flex items-baseline gap-1.5 font-display text-[32px] font-bold leading-none text-white">
            {info.price}
            {info.period && <span className="font-sans text-sm font-medium text-white/70">{info.period}</span>}
          </DialogTitle>
          <p className="relative mt-2 text-[13px] leading-5 text-white/80">{info.note}</p>

          {/* Trocar de plano sem fechar a janela */}
          <div role="radiogroup" aria-label="Plano" className="relative mt-4 grid grid-cols-2 rounded-xl bg-black/25 p-1 ring-1 ring-inset ring-white/10">
            {(Object.keys(PLAN_INFO) as Plan[]).map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={plan === key}
                disabled={loading}
                onClick={() => setPlan(key)}
                className={cn(
                  "h-9 rounded-lg text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:text-sm",
                  plan === key ? "bg-white text-brand-bg shadow-sm" : "text-white/80 hover:text-white"
                )}
              >
                {PLAN_INFO[key].tab} · {PLAN_INFO[key].price}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="p-6 sm:px-7">
          {/* Etapas da compra */}
          <ol className="flex items-center gap-2 text-[11px] font-medium" aria-label="Etapas da compra">
            {STEPS.map((step, i) => (
              <li key={step} className={cn("flex items-center gap-2 whitespace-nowrap", i === 0 ? "text-white" : "text-brand-muted")}>
                <span
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold",
                    i === 0 ? "bg-brand-primary text-white" : "bg-brand-surface-2 ring-1 ring-inset ring-white/10"
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className={i === 0 ? "" : "max-[380px]:hidden"}>{step}</span>
                {i < STEPS.length - 1 && <span className="h-px w-3 bg-white/15 sm:w-5" aria-hidden="true" />}
              </li>
            ))}
          </ol>

          <form onSubmit={handleCheckout} className="mt-5 space-y-3.5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-brand-text-2">Nome</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Seu nome"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-brand-text-2">E-mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="voce@email.com"
                className={inputClass}
              />
              <span className="mt-1.5 flex items-center gap-1.5 text-xs text-brand-muted">
                <Mail className="h-3.5 w-3.5 text-brand-secondary" /> Sua chave de licença chega neste e-mail.
              </span>
            </label>
            {/* Formas de pagamento e garantia */}
            <div className="rounded-xl bg-brand-bg p-4 ring-1 ring-white/[0.06]">
              <p className="text-xs font-medium text-brand-text-2">Você paga na próxima tela com</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {info.pix && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/10">
                    <QrCode className="h-3.5 w-3.5 text-brand-secondary" /> PIX
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/10">
                  <CreditCard className="h-3.5 w-3.5 text-brand-secondary" /> Cartão de crédito
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 border-t border-white/[0.06] pt-3 text-xs text-brand-text-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#33C85A]" />
                7 dias de garantia: não serviu, devolvemos 100%.
              </p>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-center text-xs text-red-200 ring-1 ring-red-500/20">
                {error}
              </p>
            )}

            <div className="max-sm:sticky max-sm:bottom-0 max-sm:-mx-6 max-sm:bg-brand-surface/95 max-sm:px-6 max-sm:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-sm:pt-3 max-sm:backdrop-blur">
            <button
              type="submit"
              disabled={loading}
              className={cn(btnPrimary, "iris-shine group h-[52px] w-full shadow-[0_10px_34px_-12px_rgba(107,85,240,0.9)] disabled:opacity-60")}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Abrindo pagamento…
                </>
              ) : (
                <>
                  Continuar · {info.price}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
            </div>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs leading-5 text-brand-muted">
              <Lock className="h-3.5 w-3.5" /> Pagamento seguro processado pela AbacatePay
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
