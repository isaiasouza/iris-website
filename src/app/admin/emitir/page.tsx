"use client";

import { useState } from "react";
import Link from "next/link";

interface Result {
  id: string;
  license_key: string;
}

export default function EmitirPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"annual" | "lifetime">("lifetime");
  const [maxDevices, setMaxDevices] = useState(3);
  const [expiresAt, setExpiresAt] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function handlePlanChange(p: "annual" | "lifetime") {
    setPlan(p);
    setMaxDevices(p === "lifetime" ? 3 : 1);
    if (p === "annual") {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      setExpiresAt(d.toISOString().slice(0, 10));
    } else {
      setExpiresAt("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/licenses/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, plan,
        max_devices: maxDevices,
        expires_at: expiresAt || undefined,
        send_email: sendEmail,
        internal_note: note || undefined,
      }),
    });

    const json = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult(json.license);
    } else {
      setError(json.error ?? "Erro ao emitir licença");
    }
  }

  function reset() {
    setName(""); setEmail(""); setPlan("lifetime"); setMaxDevices(3);
    setExpiresAt(""); setSendEmail(true); setNote(""); setResult(null); setError("");
  }

  if (result) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-xl font-bold text-white">Licença emitida</h1>
        <div className="rounded-xl border border-green-500/25 bg-green-500/10 p-6 text-center">
          <p className="text-sm text-green-400 font-medium mb-3">Licença criada com sucesso!</p>
          <p className="font-mono text-xl font-bold text-white tracking-wider">{result.license_key}</p>
          {sendEmail && <p className="mt-2 text-xs text-[#9F9FA3]">Email enviado para {email}</p>}
        </div>
        <div className="flex gap-3">
          <Link
            href={`/admin/licencas/${result.id}`}
            className="flex-1 rounded-lg border border-iris-500/30 bg-iris-700/20 py-2.5 text-center text-sm font-medium text-iris-300 hover:bg-iris-700/30 transition-colors"
          >
            Ver licença →
          </Link>
          <button
            onClick={reset}
            className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-[#9F9FA3] hover:text-white transition-colors"
          >
            Emitir outra
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-xl font-bold text-white">Emitir Licença Manual</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/5 bg-[#19191E] p-6">
        <div>
          <label className="mb-1.5 block text-sm text-[#9F9FA3]">Nome do cliente *</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/40"
            placeholder="João Silva"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-[#9F9FA3]">Email do cliente *</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/40"
            placeholder="joao@exemplo.com"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-[#9F9FA3]">Plano *</label>
          <div className="grid grid-cols-2 gap-2">
            {(["annual", "lifetime"] as const).map((p) => (
              <button
                key={p} type="button"
                onClick={() => handlePlanChange(p)}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  plan === p
                    ? "border-iris-500/40 bg-iris-700/20 text-iris-300"
                    : "border-white/10 text-[#9F9FA3] hover:border-white/20 hover:text-white"
                }`}
              >
                {p === "annual" ? "Anual — R$ 49,90" : "Vitalício — R$ 110,99"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm text-[#9F9FA3]">Max devices</label>
            <input
              type="number" min={1} max={10} value={maxDevices} onChange={(e) => setMaxDevices(parseInt(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/40"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#9F9FA3]">
              Validade {plan === "lifetime" && <span className="text-[#58585F]">(vazio = sem expiração)</span>}
            </label>
            <input
              type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-[#9F9FA3]">Nota interna (opcional)</label>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)} rows={2}
            className="w-full resize-none rounded-lg border border-white/10 bg-[#13131A] px-3 py-2 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/40"
            placeholder="Ex: Licença de teste, parceria, suporte..."
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)}
            className="rounded border-white/20"
          />
          <span className="text-sm text-[#9F9FA3]">Enviar email com a chave para o cliente</span>
        </label>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-iris-700 to-iris-500 py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Emitindo..." : "Emitir Licença"}
        </button>
      </form>
    </div>
  );
}
