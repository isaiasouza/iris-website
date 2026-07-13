"use client";

import { useState } from "react";

const PLAN_INFO = {
  annual:   { label: "Plano Anual",     price: "R$ 49,90/ano", description: "Renovação automática anual." },
  lifetime: { label: "Plano Vitalício", price: "R$ 110,99",    description: "Pagamento único, sem renovações." },
};

interface CheckoutModalProps {
  plan: "annual" | "lifetime";
  onClose: () => void;
}

export default function CheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const info = PLAN_INFO[plan];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Informe nome e email para receber sua licença.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          name: name.trim(),
          email: email.trim(),
          cpfCnpj: cpfCnpj.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.checkoutUrl) {
        throw new Error(json.error ?? "Não foi possível iniciar o pagamento.");
      }

      window.location.href = json.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível iniciar o pagamento.");
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

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <p className="text-sm text-[#9F9FA3] text-center">
            Você será redirecionado para a página de pagamento seguro.
          </p>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#9F9FA3]">Nome</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#58585F] focus:border-iris-500"
                placeholder="Seu nome"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#9F9FA3]">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#58585F] focus:border-iris-500"
                placeholder="voce@email.com"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#9F9FA3]">CPF/CNPJ</span>
              <input
                value={cpfCnpj}
                onChange={(event) => setCpfCnpj(event.target.value)}
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#58585F] focus:border-iris-500"
                placeholder="Opcional"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-200">
              {error}
            </p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-iris-700 to-iris-500 text-white font-semibold py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-lg hover:shadow-iris-700/30"
          >
            {loading ? "Abrindo pagamento..." : "Ir para o pagamento →"}
          </button>

          <p className="text-center text-xs text-[#58585F]">
            Pagamento seguro via AbacatePay · PIX · Cartão
          </p>
        </div>
      </div>
    </div>
  );
}
