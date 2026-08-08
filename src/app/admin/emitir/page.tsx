"use client";

import { useState } from "react";
import Link from "next/link";
import CopyButton from "../_components/CopyButton";

type EmailStatus = "sent" | "failed" | "not_requested" | "unchanged";

interface Result {
  id: string;
  license_key: string;
}

interface ExistingLicense {
  id: string;
  license_key: string;
  plan: string;
  status: string;
  created_at: string;
}

function annualExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

function sessionExpired(response: Response) {
  if (response.status !== 401) return false;
  window.location.replace("/admin/login?from=%2Fadmin%2Femitir");
  return true;
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
  const [reviewing, setReviewing] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [existing, setExisting] = useState<ExistingLicense[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("not_requested");
  const [auditFailed, setAuditFailed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState("");

  function handlePlanChange(nextPlan: "annual" | "lifetime") {
    setPlan(nextPlan);
    setMaxDevices(nextPlan === "lifetime" ? 3 : 1);
    setExpiresAt(nextPlan === "annual" ? annualExpiry() : "");
  }

  async function handleReview(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/licenses/check-email?email=${encodeURIComponent(email.trim())}`);
      if (sessionExpired(response)) return;
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.error || "Não foi possível verificar o e-mail informado.");
      setExisting(json.licenses ?? []);
      setRequestId((current) => current || crypto.randomUUID());
      setReviewing(true);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : "Não foi possível preparar a emissão.");
    } finally {
      setLoading(false);
    }
  }

  async function handleIssue() {
    if (!requestId || loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/licenses/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": requestId },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          plan,
          max_devices: maxDevices,
          expires_at: plan === "annual" ? expiresAt : undefined,
          send_email: sendEmail,
          internal_note: note.trim() || undefined,
        }),
      });
      if (sessionExpired(response)) return;
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.error || "Não foi possível emitir a licença.");
      setResult(json.license);
      setEmailStatus(json.email_status ?? "not_requested");
      setAuditFailed(json.audit_status === "failed");
    } catch (issueError) {
      setError(issueError instanceof Error ? issueError.message : "Não foi possível emitir a licença.");
    } finally {
      setLoading(false);
    }
  }

  async function resendEmail() {
    if (!result || resending) return;
    setResending(true);
    setResendError("");
    try {
      const response = await fetch(`/api/admin/licenses/${result.id}/resend-email`, { method: "POST" });
      if (sessionExpired(response)) return;
      const json = await response.json().catch(() => null);
      if (!response.ok) throw new Error(json?.error || "Não foi possível reenviar o e-mail.");
      setEmailStatus("sent");
    } catch (resendIssue) {
      setResendError(resendIssue instanceof Error ? resendIssue.message : "Não foi possível reenviar o e-mail.");
    } finally {
      setResending(false);
    }
  }

  function reset() {
    setName("");
    setEmail("");
    setPlan("lifetime");
    setMaxDevices(3);
    setExpiresAt("");
    setSendEmail(true);
    setNote("");
    setError("");
    setReviewing(false);
    setRequestId("");
    setExisting([]);
    setResult(null);
    setEmailStatus("not_requested");
    setAuditFailed(false);
    setResendError("");
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-iris-400">Emissão concluída</p>
          <h1 className="text-2xl font-bold text-white">Licença pronta</h1>
        </div>

        <div className="overflow-hidden rounded-2xl border border-green-500/20 bg-[#19191E]">
          <div className="border-b border-white/5 bg-green-500/[0.07] p-6">
            <p className="text-sm font-medium text-green-400">A licença foi criada e está ativa.</p>
            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[#13131A] px-4 py-4">
              <p className="break-all font-mono text-lg font-bold tracking-wider text-white">{result.license_key}</p>
              <CopyButton text={result.license_key} />
            </div>
          </div>

          <div className="space-y-3 p-6">
            {emailStatus === "sent" && <p className="text-sm text-green-400">E-mail entregue ao serviço de envio para {email.trim()}.</p>}
            {emailStatus === "not_requested" && <p className="text-sm text-[#9F9FA3]">O envio de e-mail não foi solicitado.</p>}
            {emailStatus === "unchanged" && <p className="text-sm text-amber-300">Esta emissão já havia sido processada. Nenhuma licença duplicada foi criada.</p>}
            {emailStatus === "failed" && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] p-4">
                <p className="text-sm font-medium text-amber-300">A licença foi criada, mas o e-mail não foi enviado.</p>
                <button onClick={resendEmail} disabled={resending} className="mt-3 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-[#13131A] disabled:opacity-50">
                  {resending ? "Reenviando..." : "Reenviar e-mail"}
                </button>
              </div>
            )}
            {resendError && <p className="text-sm text-red-400">{resendError}</p>}
            {auditFailed && <p className="text-xs text-amber-300">A licença está válida, mas o registro de auditoria precisa ser verificado.</p>}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={`/admin/licencas/${result.id}`} className="flex-1 rounded-lg border border-iris-500/30 bg-iris-700/20 py-2.5 text-center text-sm font-medium text-iris-300 hover:bg-iris-700/30">Ver licença →</Link>
          <button onClick={reset} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-[#9F9FA3] hover:text-white">Emitir outra</button>
        </div>
      </div>
    );
  }

  if (reviewing) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-iris-400">Revisão final</p>
          <h1 className="text-2xl font-bold text-white">Confirme antes de emitir</h1>
          <p className="mt-2 text-sm text-[#9F9FA3]">A licença será criada imediatamente após a confirmação.</p>
        </div>

        {existing.length > 0 && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
            <p className="text-sm font-semibold text-amber-300">Este e-mail já possui {existing.length} licença(s).</p>
            <div className="mt-3 space-y-2">
              {existing.map((license) => (
                <Link key={license.id} href={`/admin/licencas/${license.id}`} className="flex items-center justify-between rounded-lg bg-black/15 px-3 py-2 text-xs text-[#C8C8CC] hover:bg-black/25">
                  <span>{license.license_key.slice(0, 12)}… · {license.plan === "lifetime" ? "Vitalício" : "Anual"}</span>
                  <span className="capitalize text-amber-200">{license.status}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/5 sm:grid-cols-2">
          {[
            ["Cliente", name.trim()],
            ["E-mail", email.trim().toLowerCase()],
            ["Plano", plan === "lifetime" ? "Vitalício" : "Anual"],
            ["Dispositivos", String(maxDevices)],
            ["Validade", plan === "lifetime" ? "Sem expiração" : new Date(`${expiresAt}T12:00:00`).toLocaleDateString("pt-BR")],
            ["Entrega", sendEmail ? "Enviar chave por e-mail" : "Não enviar e-mail"],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#19191E] p-4">
              <dt className="text-xs text-[#6F6F76]">{label}</dt>
              <dd className="mt-1 break-words text-sm font-medium text-white">{value}</dd>
            </div>
          ))}
        </dl>

        {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button onClick={() => { setReviewing(false); setError(""); }} disabled={loading} className="flex-1 rounded-lg border border-white/10 py-3 text-sm text-[#9F9FA3] hover:text-white disabled:opacity-50">Voltar e editar</button>
          <button onClick={handleIssue} disabled={loading} className="flex-1 rounded-lg bg-gradient-to-r from-iris-700 to-iris-500 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50">
            {loading ? "Emitindo com segurança..." : "Confirmar e emitir"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-iris-400">Operação manual</p>
        <h1 className="text-2xl font-bold text-white">Emitir licença</h1>
        <p className="mt-2 text-sm text-[#9F9FA3]">Preencha os dados e revise tudo antes de criar a chave.</p>
      </div>

      <form onSubmit={handleReview} className="space-y-5 rounded-2xl border border-white/5 bg-[#19191E] p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="customer-name" className="mb-1.5 block text-sm text-[#9F9FA3]">Nome do cliente *</label>
            <input id="customer-name" type="text" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} maxLength={120} autoComplete="name" className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/50 focus:ring-2 focus:ring-iris-500/15" placeholder="João Silva" />
          </div>
          <div>
            <label htmlFor="customer-email" className="mb-1.5 block text-sm text-[#9F9FA3]">E-mail do cliente *</label>
            <input id="customer-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} autoComplete="email" className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/50 focus:ring-2 focus:ring-iris-500/15" placeholder="joao@exemplo.com" />
          </div>
        </div>

        <fieldset>
          <legend className="mb-1.5 block text-sm text-[#9F9FA3]">Plano *</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["annual", "lifetime"] as const).map((option) => (
              <button key={option} type="button" onClick={() => handlePlanChange(option)} aria-pressed={plan === option} className={`rounded-lg border py-3 text-sm font-medium transition-colors ${plan === option ? "border-iris-500/50 bg-iris-700/20 text-iris-300" : "border-white/10 text-[#9F9FA3] hover:border-white/20 hover:text-white"}`}>
                {option === "annual" ? "Anual" : "Vitalício"}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={`grid gap-4 ${plan === "annual" ? "sm:grid-cols-2" : ""}`}>
          <div>
            <label htmlFor="max-devices" className="mb-1.5 block text-sm text-[#9F9FA3]">Limite de dispositivos</label>
            <input id="max-devices" type="number" min={1} max={10} step={1} value={maxDevices} onChange={(event) => setMaxDevices(Number.isNaN(event.currentTarget.valueAsNumber) ? 1 : event.currentTarget.valueAsNumber)} required className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/50 focus:ring-2 focus:ring-iris-500/15" />
          </div>
          {plan === "annual" && (
            <div>
              <label htmlFor="expires-at" className="mb-1.5 block text-sm text-[#9F9FA3]">Validade</label>
              <input id="expires-at" type="date" value={expiresAt} min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)} onChange={(event) => setExpiresAt(event.target.value)} required className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/50 focus:ring-2 focus:ring-iris-500/15" />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="internal-note" className="mb-1.5 block text-sm text-[#9F9FA3]">Nota interna <span className="text-[#58585F]">(opcional)</span></label>
          <textarea id="internal-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-[#13131A] px-3 py-2.5 text-sm text-white outline-none focus:border-iris-500/50 focus:ring-2 focus:ring-iris-500/15" placeholder="Ex.: parceria, suporte ou motivo da emissão" />
          <p className="mt-1 text-right text-[11px] text-[#58585F]">{note.length}/1000</p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-[#13131A]/60 p-4">
          <input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} className="mt-0.5 rounded border-white/20" />
          <span>
            <span className="block text-sm font-medium text-white">Enviar a chave por e-mail</span>
            <span className="mt-1 block text-xs leading-5 text-[#6F6F76]">O cliente receberá a chave, o link de download atual e as instruções de ativação.</span>
          </span>
        </label>

        {error && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
        <button type="submit" disabled={loading || !Number.isInteger(maxDevices)} className="w-full rounded-lg bg-gradient-to-r from-iris-700 to-iris-500 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50">
          {loading ? "Verificando..." : "Revisar emissão →"}
        </button>
      </form>
    </div>
  );
}
