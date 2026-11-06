"use client";

import { ArrowRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow, btnPrimary } from "./brand";
import { cn } from "@/lib/utils";

const PLAN_INFO = {
  annual: {
    label: "Plano Anual",
    price: "R$ 49,90/ano",
    description: "1 ano de acesso completo. Renova sozinho no cartão; cancele quando quiser.",
    methods: "Cartão de crédito",
  },
  lifetime: {
    label: "Plano Vitalício",
    price: "R$ 110,99",
    description: "Pagamento único e atualizações futuras da linha V2.",
    methods: "PIX ou cartão",
  },
};

const inputClass =
  "h-11 w-full rounded-[10px] bg-brand-bg px-3 text-sm text-white ring-1 ring-inset ring-white/10 outline-none transition placeholder:text-brand-muted focus:ring-iris-300/60";

interface CheckoutModalProps {
  plan: "annual" | "lifetime";
  onClose: () => void;
}

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const info = PLAN_INFO[plan];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
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
        body: JSON.stringify({ plan, name, email, taxId: taxId || undefined }),
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
      <DialogContent className="dark max-w-md gap-0 overflow-hidden rounded-2xl border-0 bg-brand-surface p-0 text-white ring-1 ring-white/10">
        <DialogHeader className="bg-noite p-7 pr-14">
          <Eyebrow onBrand>{info.label}</Eyebrow>
          <DialogTitle className="font-display text-3xl font-bold text-white">{info.price}</DialogTitle>
          <DialogDescription className="leading-6 text-white/80">{info.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCheckout} className="space-y-4 p-7">
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
            <span className="mt-1.5 block text-xs text-brand-muted">Sua chave de licença chega neste e-mail.</span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-brand-text-2">
              CPF ou CNPJ <span className="text-brand-muted">(opcional)</span>
            </span>
            <input
              value={taxId}
              onChange={(event) => setTaxId(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Só números"
              className={inputClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 pt-1 text-sm text-brand-text-2">
            <div className="rounded-xl bg-brand-bg p-4 ring-1 ring-white/[0.06]">
              <ShieldCheck className="mb-2 h-5 w-5 text-brand-secondary" />
              7 dias de garantia
            </div>
            <div className="rounded-xl bg-brand-bg p-4 ring-1 ring-white/[0.06]">
              <CreditCard className="mb-2 h-5 w-5 text-brand-secondary" />
              {info.methods}
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-xl bg-red-500/10 px-3 py-2 text-center text-xs text-red-200 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={cn(btnPrimary, "w-full disabled:opacity-60")}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Abrindo pagamento…" : "Ir para o pagamento"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-xs leading-5 text-brand-muted">
            Pagamento seguro processado pela AbacatePay.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
