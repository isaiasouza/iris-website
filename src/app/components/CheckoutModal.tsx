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

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const info = PLAN_INFO[plan];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, name, email }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Erro ao gerar link de pagamento.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
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

          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-iris-700 to-iris-500 text-white font-semibold py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-lg hover:shadow-iris-700/30 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Gerando link..." : "Ir para o pagamento →"}
          </button>

          <p className="text-center text-xs text-[#58585F]">
            Pagamento seguro via Asaas · PIX · Cartão · Boleto
          </p>
        </form>
      </div>
    </div>
  );
}
