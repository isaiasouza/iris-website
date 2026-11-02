"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DELIVERY_LABELS, PROBLEM_STATUSES, type DeliveryStatus } from "@/lib/email-delivery";

interface EmailEvent {
  id: string;
  to_email: string;
  subject: string;
  type: string;
  status: "sent" | "failed";
  provider: string;
  provider_id: string | null;
  error_message: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  delivery_status: DeliveryStatus | null;
  delivery_detail: string | null;
  delivery_updated_at: string | null;
}

interface EmailResponse {
  emails: EmailEvent[];
  total: number;
  page: number;
  totalPages: number;
}

const typeLabels: Record<string, string> = {
  license_created: "Licença criada",
  license_recovery: "Recuperação",
  device_removed: "Dispositivo removido",
  payment_failed: "Pagamento falhou",
};

function fmt(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Status real do e-mail: primeiro se o Resend aceitou (Falhou ao enviar),
 * depois o que o webhook informou (Entregue, Devolvido…). Sem notícia do
 * webhook, fica "Enviado", aguardando confirmação.
 */
function StatusBadge({ email }: { email: EmailEvent }) {
  let label: string;
  let tone: "ok" | "warn" | "bad" | "neutral";
  if (email.status === "failed") {
    label = "Falhou ao enviar";
    tone = "bad";
  } else if (!email.delivery_status) {
    label = "Enviado";
    tone = "neutral";
  } else {
    label = DELIVERY_LABELS[email.delivery_status];
    tone = email.delivery_status === "delivered" ? "ok" : email.delivery_status === "delivery_delayed" ? "warn" : "bad";
  }
  const styles = {
    ok: "border-green-500/25 bg-green-500/10 text-green-300",
    warn: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    bad: "border-red-500/25 bg-red-500/10 text-red-300",
    neutral: "border-white/10 bg-white/5 text-[#D6D6DA]",
  }[tone];
  return (
    <span
      className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${styles}`}
      title={email.delivery_status ? undefined : "Aceito pelo Resend; ainda sem confirmação de entrega"}
    >
      {label}
    </span>
  );
}

export default function AdminEmailsPage() {
  return (
    <Suspense>
      <AdminEmails />
    </Suspense>
  );
}

function AdminEmails() {
  // O aviso de e-mail não entregue abre o painel já filtrado (?q=endereço).
  const initialQuery = useSearchParams().get("q") ?? "";
  const [data, setData] = useState<EmailResponse | null>(null);
  const [q, setQ] = useState(initialQuery);
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const params = useMemo(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "all") sp.set("status", status);
    if (type !== "all") sp.set("type", type);
    sp.set("page", String(page));
    return sp.toString();
  }, [q, status, type, page]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/emails?${params}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Emails enviados</h1>
        <p className="mt-1 text-sm text-[#9F9FA3]">
          Histórico interno dos emails enviados pelo Iris Downloader.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/5 bg-[#19191E] p-4 md:grid-cols-[1fr_180px_180px]">
        <input
          value={q}
          onChange={(event) => { setQ(event.target.value); setPage(1); }}
          placeholder="Buscar por email ou assunto"
          className="rounded-lg border border-white/8 bg-[#13131A] px-3 py-2 text-sm text-white outline-none placeholder:text-[#58585F] focus:border-iris-500/50"
        />
        <select
          value={type}
          onChange={(event) => { setType(event.target.value); setPage(1); }}
          className="rounded-lg border border-white/8 bg-[#13131A] px-3 py-2 text-sm text-white outline-none focus:border-iris-500/50"
        >
          <option value="all">Todos os tipos</option>
          <option value="license_created">Licença criada</option>
          <option value="license_recovery">Recuperação</option>
          <option value="device_removed">Dispositivo removido</option>
          <option value="payment_failed">Pagamento falhou</option>
        </select>
        <select
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          className="rounded-lg border border-white/8 bg-[#13131A] px-3 py-2 text-sm text-white outline-none focus:border-iris-500/50"
        >
          <option value="all">Todos os status</option>
          <option value="problem">Não entregues</option>
          <option value="delivered">Entregues</option>
          <option value="pending">Sem confirmação</option>
          <option value="failed">Falharam ao enviar</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/5 bg-[#19191E]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <p className="text-sm font-semibold text-white">
            {data ? `${data.total} registros` : "Carregando..."}
          </p>
          {loading && <p className="text-xs text-[#58585F]">Atualizando...</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Destinatário</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Tipo</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Status</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Data</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-[#58585F]">Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(data?.emails ?? []).map((email) => (
                <tr key={email.id} className="align-top hover:bg-white/2">
                  <td className="px-5 py-4">
                    <p className="text-sm text-white">{email.to_email}</p>
                    <p className="mt-1 max-w-md truncate text-xs text-[#9F9FA3]">{email.subject}</p>
                    {email.delivery_status && PROBLEM_STATUSES.has(email.delivery_status) && email.delivery_detail && (
                      <p className="mt-2 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-300">
                        {email.delivery_detail}
                      </p>
                    )}
                    {email.error_message && (
                      <p className="mt-2 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs text-red-300">
                        {email.error_message}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#D6D6DA]">{typeLabels[email.type] ?? email.type}</td>
                  <td className="px-5 py-4"><StatusBadge email={email} /></td>
                  <td className="px-5 py-4 text-xs text-[#9F9FA3]">{fmt(email.created_at)}</td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-[#9F9FA3]">{email.provider}</p>
                    {email.provider_id && (
                      <p className="mt-1 font-mono text-[10px] text-[#58585F]">{email.provider_id}</p>
                    )}
                  </td>
                </tr>
              ))}
              {data && data.emails.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#58585F]">
                    Nenhum email encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-[#9F9FA3] disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="text-xs text-[#58585F]">
              Página {data.page} de {data.totalPages}
            </span>
            <button
              onClick={() => setPage((value) => Math.min(data.totalPages, value + 1))}
              disabled={page >= data.totalPages}
              className="rounded-lg border border-white/8 px-3 py-1.5 text-xs text-[#9F9FA3] disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
