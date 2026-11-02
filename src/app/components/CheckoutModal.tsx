"use client";

import { ArrowUpRight, CreditCard, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow, btnPrimary } from "./brand";
import { cn } from "@/lib/utils";

const CAKTO_URLS = {
  annual: "https://pay.cakto.com.br/38zibpa_825842",
  lifetime: "https://pay.cakto.com.br/tqxh73a_825801",
};

const PLAN_INFO = {
  annual: {
    label: "Plano Anual",
    price: "R$ 49,90/ano",
    description: "1 ano de acesso completo e atualizações durante o plano.",
  },
  lifetime: {
    label: "Plano Vitalício",
    price: "R$ 110,99",
    description: "Pagamento único e atualizações futuras da linha V2.",
  },
};

interface CheckoutModalProps {
  plan: "annual" | "lifetime";
  onClose: () => void;
}

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const info = PLAN_INFO[plan];
  const url = CAKTO_URLS[plan];

  function handleCheckout() {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="dark max-w-md gap-0 overflow-hidden rounded-2xl border-0 bg-brand-surface p-0 text-white ring-1 ring-white/10">
        <DialogHeader className="bg-noite p-7 pr-14">
          <Eyebrow onBrand>{info.label}</Eyebrow>
          <DialogTitle className="font-display text-3xl font-bold text-white">{info.price}</DialogTitle>
          <DialogDescription className="leading-6 text-white/80">{info.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-7">
          <div className="grid grid-cols-2 gap-3 text-sm text-brand-text-2">
            <div className="rounded-xl bg-brand-bg p-4 ring-1 ring-white/[0.06]">
              <ShieldCheck className="mb-2 h-5 w-5 text-brand-secondary" />
              7 dias de garantia
            </div>
            <div className="rounded-xl bg-brand-bg p-4 ring-1 ring-white/[0.06]">
              <CreditCard className="mb-2 h-5 w-5 text-brand-secondary" />
              PIX, cartão ou boleto
            </div>
          </div>

          <button type="button" onClick={handleCheckout} className={cn(btnPrimary, "w-full")}>
            Continuar no checkout seguro
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs leading-5 text-brand-muted">
            Você será direcionado para o checkout seguro da Cakto.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
