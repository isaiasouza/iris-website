"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import LicenseStatusBadge from "../_components/LicenseStatusBadge";
import PlanBadge from "../_components/PlanBadge";
import CopyButton from "../_components/CopyButton";
import Pagination from "../_components/Pagination";
import ConfirmModal from "../_components/ConfirmModal";

interface LicenseRow {
  id: string;
  license_key: string;
  name: string | null;
  email: string;
  plan: string;
  status: string;
  max_devices: number;
  devices_used: number;
  expires_at: string | null;
  created_at: string;
}

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("pt-BR");
}

type ModalState = { type: "suspend" | "cancel" | "reactivate"; id: string; key: string } | null;

function LicensasContent() {
  const router = useRouter();
  const params = useSearchParams();

  const status = params.get("status") ?? "all";
  const plan = params.get("plan") ?? "all";
  const q = params.get("q") ?? "";
  const page = parseInt(params.get("page") ?? "1");

  const [data, setData] = useState<{ licenses: LicenseRow[]; total: number; totalPages: number } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState(q);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(() => {
    setLoadError("");
    const sp = new URLSearchParams();
    if (status !== "all") sp.set("status", status);
    if (plan !== "all") sp.set("plan", plan);
    if (q) sp.set("q", q);
    sp.set("page", String(page));
    fetch(`/api/admin/licenses?${sp}`)
      .then(async (response) => {
        if (response.status === 401) {
          window.location.replace(`/admin/login?from=${encodeURIComponent(`/admin/licencas?${sp}`)}`);
          return null;
        }
        if (!response.ok) throw new Error("Não foi possível carregar as licenças.");
        return response.json();
      })
      .then((result) => { if (result) setData(result); })
      .catch((error) => setLoadError(error instanceof Error ? error.message : "Não foi possível carregar as licenças."));
  }, [status, plan, q, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setSelected(new Set()); }, [status, plan, q, page]);

  function pushParams(updates: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === "all" || v === "" || v === "1") sp.delete(k);
      else sp.set(k, v);
    });
    sp.delete("page");
    router.push(`/admin/licencas?${sp}`);
  }

  async function doAction(id: string, action: "active" | "suspended" | "cancelled") {
    await fetch(`/api/admin/licenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    setModal(null);
    load();
  }

  async function bulkAction(action: "suspend" | "cancel") {
    await fetch("/api/admin/licenses/bulk-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], action }),
    });
    setSelected(new Set());
    load();
  }

  function exportCSV() {
    const ids = selected.size > 0 ? [...selected].join(",") : "";
    const sp = new URLSearchParams();
    if (ids) sp.set("ids", ids);
    if (status !== "all") sp.set("status", status);
    if (plan !== "all") sp.set("plan", plan);
    if (q) sp.set("q", q);
    window.location.href = `/api/admin/licenses/export?${sp}`;
  }

  const licenses = data?.licenses ?? [];
  const allSelected = licenses.length > 0 && licenses.every((l) => selected.has(l.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Licenças</h1>
        <Link
          href="/admin/emitir"
          className="rounded-lg border border-iris-500/30 bg-iris-700/20 px-4 py-2 text-sm font-medium text-iris-300 hover:bg-iris-700/30 transition-colors"
        >
          + Emitir
        </Link>
      </div>

      {/* Filters */}
      {loadError && <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{loadError}</p>}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pushParams({ q: search })}
          placeholder="Buscar por email, nome ou chave..."
          className="flex-1 min-w-48 rounded-lg border border-white/10 bg-[#19191E] px-3 py-2 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/40"
        />
        <button
          onClick={() => pushParams({ q: search })}
          className="rounded-lg border border-white/10 bg-[#19191E] px-3 py-2 text-sm text-[#9F9FA3] hover:text-white transition-colors"
        >
          Buscar
        </button>

        <select
          value={status}
          onChange={(e) => pushParams({ status: e.target.value })}
          className="rounded-lg border border-white/10 bg-[#19191E] px-3 py-2 text-sm text-[#9F9FA3] outline-none"
        >
          <option value="all">Todos status</option>
          <option value="active">Ativas</option>
          <option value="suspended">Suspensas</option>
          <option value="cancelled">Canceladas</option>
          <option value="expired">Expiradas</option>
        </select>

        <select
          value={plan}
          onChange={(e) => pushParams({ plan: e.target.value })}
          className="rounded-lg border border-white/10 bg-[#19191E] px-3 py-2 text-sm text-[#9F9FA3] outline-none"
        >
          <option value="all">Todos planos</option>
          <option value="annual">Anual</option>
          <option value="lifetime">Vitalício</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 bg-[#19191E] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) setSelected(new Set(licenses.map((l) => l.id)));
                      else setSelected(new Set());
                    }}
                    className="rounded border-white/20 bg-transparent"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Chave</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Plano</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Criado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Expira</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Devices</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#58585F]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {licenses.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-[#58585F]">
                    Nenhuma licença encontrada
                  </td>
                </tr>
              )}
              {licenses.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(l.id)}
                      onChange={(e) => {
                        const s = new Set(selected);
                        if (e.target.checked) s.add(l.id);
                        else s.delete(l.id);
                        setSelected(s);
                      }}
                      className="rounded border-white/20 bg-transparent"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-white">{l.name ?? "—"}</p>
                    <p className="text-xs text-[#9F9FA3]">{l.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-[#9F9FA3]">{l.license_key.slice(0, 12)}…</span>
                      <CopyButton text={l.license_key} />
                    </div>
                  </td>
                  <td className="px-4 py-3"><PlanBadge plan={l.plan} /></td>
                  <td className="px-4 py-3"><LicenseStatusBadge status={l.status} /></td>
                  <td className="px-4 py-3 text-xs text-[#9F9FA3]">{fmt(l.created_at)}</td>
                  <td className="px-4 py-3 text-xs text-[#9F9FA3]">{fmt(l.expires_at)}</td>
                  <td className="px-4 py-3 text-xs text-[#9F9FA3]">{l.devices_used}/{l.max_devices}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/licencas/${l.id}`}
                        className="rounded px-2 py-1 text-xs text-iris-400 hover:bg-iris-700/20 transition-colors"
                      >
                        Ver
                      </Link>
                      {l.status === "active" && (
                        <button
                          onClick={() => setModal({ type: "suspend", id: l.id, key: l.license_key })}
                          className="rounded px-2 py-1 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          Suspender
                        </button>
                      )}
                      {(l.status === "suspended" || l.status === "cancelled" || l.status === "expired") && (
                        <button
                          onClick={() => setModal({ type: "reactivate", id: l.id, key: l.license_key })}
                          className="rounded px-2 py-1 text-xs text-green-400 hover:bg-green-500/10 transition-colors"
                        >
                          Reativar
                        </button>
                      )}
                      {(l.status === "active" || l.status === "suspended") && (
                        <button
                          onClick={() => setModal({ type: "cancel", id: l.id, key: l.license_key })}
                          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 pb-4 pt-2">
          <Pagination
            page={page}
            totalPages={data?.totalPages ?? 1}
            totalItems={data?.total ?? 0}
            perPage={25}
            onPageChange={(p) => pushParams({ page: String(p) })}
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-[#19191E] px-5 py-3 shadow-2xl">
          <span className="text-sm text-white">{selected.size} selecionada(s)</span>
          <button onClick={() => bulkAction("suspend")} className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/25 transition-colors">Suspender</button>
          <button onClick={() => bulkAction("cancel")} className="rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/25 transition-colors">Cancelar</button>
          <button onClick={exportCSV} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-[#9F9FA3] hover:bg-white/10 transition-colors">Exportar CSV</button>
          <button onClick={() => setSelected(new Set())} className="text-[#58585F] hover:text-white">✕</button>
        </div>
      )}

      {/* Modals */}
      {modal?.type === "suspend" && (
        <ConfirmModal
          title="Suspender licença"
          description={`Suspender ${modal.key}? O cliente não conseguirá usar o app até ser reativado.`}
          confirmLabel="Suspender"
          confirmClassName="bg-amber-600 hover:bg-amber-500"
          onConfirm={() => doAction(modal.id, "suspended")}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "cancel" && (
        <ConfirmModal
          title="Cancelar licença"
          description={`Cancelar ${modal.key}? Esta ação não pode ser desfeita facilmente.`}
          confirmLabel="Cancelar licença"
          onConfirm={() => doAction(modal.id, "cancelled")}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "reactivate" && (
        <ConfirmModal
          title="Reativar licença"
          description={`Reativar ${modal.key}? O cliente voltará a ter acesso imediato.`}
          confirmLabel="Reativar"
          confirmClassName="bg-green-700 hover:bg-green-600"
          onConfirm={() => doAction(modal.id, "active")}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default function LicencasPage() {
  return (
    <Suspense>
      <LicensasContent />
    </Suspense>
  );
}
