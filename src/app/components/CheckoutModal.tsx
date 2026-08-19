"use client";

import { ArrowUpRight, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <DialogContent className="dark max-w-md gap-0 overflow-hidden border-white/10 bg-[#0c151e] p-0 text-white shadow-[0_32px_100px_rgba(0,0,0,.55)]">
        <DialogHeader className="border-b border-white/8 bg-white/[0.025] p-6 pr-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{info.label}</p>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">{info.price}</DialogTitle>
          <DialogDescription className="leading-6 text-white/48">{info.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3 text-xs text-white/55">
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
              <ShieldCheck className="mb-2 h-4 w-4 text-emerald-300" />
              7 dias de garantia
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
              <CreditCard className="mb-2 h-4 w-4 text-cyan-200" />
              PIX, cartão ou boleto
            </div>
          </div>

          <Button type="button" onClick={handleCheckout} className="h-12 w-full rounded-xl bg-cyan-100 font-semibold text-[#071018] hover:bg-white">
            Continuar no checkout seguro
            <ArrowUpRight data-icon="inline-end" />
          </Button>

          <p className="text-center text-xs leading-5 text-white/35">
            Você será direcionado para o checkout seguro da Cakto.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
