"use client";

import { useState } from "react";

interface CheckoutModalProps {
  plan: "annual" | "lifetime";
  onClose: () => void;
}

const PLAN_INFO = {
  annual:   { label: "Plano Anual",     price: "R$ 49,90/ano", description: "Renovação automática anual." },
  lifetime: { label: "Plano Vitalício", price: "R$ 110,99",    description: "Pagamento único, sem renovações." },
};

const CAKTO_IDS = {
  annual:   process.env.NEXT_PUBLIC_CAKTO_ANNUAL_ID   ?? "",
  lifetime: process.env.NEXT_PUBLIC_CAKTO_LIFETIME_ID ?? "",
};

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const info = PLAN_INFO[plan];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const productId = CAKTO_IDS[plan];
    const params = new URLSearchParams({ email, name });
    window.location.href = `https://pay.cakto.com.br/${productId}?${params}`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#19191E] border border-white/8 rounded-2xl shadow-2xl shadow-iris-950/50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-iris-400 mb-0.5">
              {info.label}
            </div>
            <div className="text-xl font-bold text-white">{info.price}</div>
            <div className="text-xs text-[#58585F] mt-0.5">{info.description}</div>
          </div>
          <button onClick={onClose} className="text-[#58585F] hover:text-white transition-colors p-1" aria-label="Fechar">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm text-[#9F9FA3] mb-1.5">Nome completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-[#13131A] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#3a3a45] focus:outline-none focus:border-iris-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#9F9FA3] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full bg-[#13131A] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-[#3a3a45] focus:outline-none focus:border-iris-500/50 transition-colors"
            />
            <p className="text-xs text-[#58585F] mt-1">Sua chave de licença será enviada para este email.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-iris-700 to-iris-500 text-white font-semibold py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-lg hover:shadow-iris-700/30 mt-2"
          >
            Ir para o pagamento →
          </button>

          <p className="text-center text-xs text-[#58585F]">
            🔒 Pagamento seguro via Cakto · PIX · Cartão · Boleto
          </p>
        </form>
      </div>
    </div>
  );
}
