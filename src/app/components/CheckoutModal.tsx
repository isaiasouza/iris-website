"use client";

const CAKTO_URLS = {
  annual:   "https://pay.cakto.com.br/38zibpa_825842",
  lifetime: "https://pay.cakto.com.br/tqxh73a_825801",
};

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
  const url  = CAKTO_URLS[plan];

  function handleCheckout() {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
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

          <button
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-iris-700 to-iris-500 text-white font-semibold py-3 rounded-xl transition-all hover:brightness-110 hover:shadow-lg hover:shadow-iris-700/30"
          >
            Ir para o pagamento →
          </button>

          <p className="text-center text-xs text-[#58585F]">
            Pagamento seguro via Cakto · PIX · Cartão · Boleto
          </p>
        </div>
      </div>
    </div>
  );
}
