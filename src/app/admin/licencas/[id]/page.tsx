"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import LicenseStatusBadge from "../../_components/LicenseStatusBadge";
import PlanBadge from "../../_components/PlanBadge";
import CopyButton from "../../_components/CopyButton";
import ConfirmModal from "../../_components/ConfirmModal";

interface License {
  id: string;
  license_key: string;
  plan: string;
  status: string;
  email: string;
  name: string | null;
  max_devices: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  cakto_transaction_id: string | null;
  cakto_subscription_id: string | null;
  internal_note: string | null;
}

interface Device {
  id: string;
  device_name: string | null;
  hardware_id: string;
  os_version: string | null;
  is_active: boolean;
  activated_at: string;
  last_seen_at: string;
}

interface Event {
  id: string;
  event: string;
  hardware_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR");
}

type ModalType = "suspend" | "cancel" | "reactivate" | "revoke" | null;

export default function LicenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [license, setLicense] = useState<License | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  function load() {
    fetch(`/api/admin/licenses/${id}`)
      .then((r) => r.json())
      .then(({ license: l, devices: d, events: e }) => {
        setLicense(l);
        setDevices(d);
        setEvents(e);
        setNote(l?.internal_note ?? "");
      });
  }

  useEffect(() => { load(); }, [id]);

  async function doStatus(status: string) {
    await fetch(`/api/admin/licenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setModal(null);
    load();
  }

  async function doRevoke() {
    await fetch(`/api/admin/licenses/${id}/revoke`, { method: "POST" });
    setModal(null);
    router.push("/admin/licencas");
  }

  async function removeDevice(deviceId: string) {
    await fetch(`/api/admin/licenses/${id}/devices/${deviceId}/remove`, { method: "POST" });
    load();
  }

  async function saveNote() {
    setSavingNote(true);
    await fetch(`/api/admin/licenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ internal_note: note }),
    });
    setSavingNote(false);
  }

  if (!license) {
    return <div className="flex h-64 items-center justify-center text-[#9F9FA3]">Carregando...</div>;
  }

  const activeDevices = devices.filter((d) => d.is_active);
  const inactiveDevices = devices.filter((d) => !d.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/licencas" className="text-[#9F9FA3] hover:text-white transition-colors">
          ← Licenças
        </Link>
        <span className="text-[#58585F]">/</span>
        <span className="font-mono text-sm text-white">{license.license_key}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          {/* License info */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Informações da Licença</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "Nome", value: license.name ?? "—" },
                { label: "Email", value: license.email },
                { label: "Plano", value: <PlanBadge plan={license.plan} /> },
                { label: "Status", value: <LicenseStatusBadge status={license.status} /> },
                { label: "Max devices", value: String(license.max_devices) },
                { label: "Expira em", value: fmt(license.expires_at) },
                { label: "Criado em", value: fmt(license.created_at) },
                { label: "Atualizado em", value: fmt(license.updated_at) },
              ].map((row) => (
                <div key={row.label} className="rounded-lg border border-white/5 bg-[#13131A] px-4 py-3">
                  <p className="text-xs text-[#58585F]">{row.label}</p>
                  <div className="mt-1 text-sm text-white">{row.value}</div>
                </div>
              ))}
              <div className="rounded-lg border border-white/5 bg-[#13131A] px-4 py-3 sm:col-span-2">
                <p className="text-xs text-[#58585F]">Chave de licença</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm text-iris-300">{license.license_key}</span>
                  <CopyButton text={license.license_key} />
                </div>
              </div>
              {license.cakto_transaction_id && (
                <div className="rounded-lg border border-white/5 bg-[#13131A] px-4 py-3 sm:col-span-2">
                  <p className="text-xs text-[#58585F]">Cakto Transaction ID</p>
                  <p className="mt-1 font-mono text-xs text-[#9F9FA3]">{license.cakto_transaction_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Devices */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">
              Dispositivos ativos ({activeDevices.length}/{license.max_devices})
            </h2>
            {activeDevices.length === 0 ? (
              <p className="text-sm text-[#58585F]">Nenhum dispositivo ativo</p>
            ) : (
              <div className="space-y-2">
                {activeDevices.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-[#13131A] px-4 py-3">
                    <div>
                      <p className="text-sm text-white">{d.device_name ?? "Mac desconhecido"}</p>
                      <p className="text-xs text-[#9F9FA3]">{d.os_version ?? "—"} · Ativado {fmt(d.activated_at)}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#58585F]">{d.hardware_id.slice(0, 20)}…</p>
                    </div>
                    <button
                      onClick={() => removeDevice(d.id)}
                      className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
            {inactiveDevices.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs text-[#58585F] hover:text-[#9F9FA3]">
                  {inactiveDevices.length} dispositivo(s) inativo(s)
                </summary>
                <div className="mt-2 space-y-2">
                  {inactiveDevices.map((d) => (
                    <div key={d.id} className="rounded-lg border border-white/5 bg-[#13131A] px-4 py-2 opacity-50">
                      <p className="text-sm text-white">{d.device_name ?? "Mac desconhecido"}</p>
                      <p className="text-xs text-[#9F9FA3]">Removido · Ativado {fmt(d.activated_at)}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Events */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Histórico de eventos</h2>
            {events.length === 0 ? (
              <p className="text-sm text-[#58585F]">Nenhum evento registrado</p>
            ) : (
              <div className="space-y-2">
                {events.map((e) => (
                  <div key={e.id} className="flex items-start justify-between rounded-lg border border-white/5 bg-[#13131A] px-4 py-2.5">
                    <div>
                      <p className="text-xs font-mono text-[#9F9FA3]">{e.event}</p>
                      {e.metadata && (
                        <p className="mt-0.5 text-[10px] text-[#58585F]">{JSON.stringify(e.metadata)}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] text-[#58585F]">{fmt(e.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white">Ações</h2>
            <div className="space-y-2">
              {license.status === "active" && (
                <button
                  onClick={() => setModal("suspend")}
                  className="w-full rounded-lg border border-amber-500/25 bg-amber-500/10 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  Suspender
                </button>
              )}
              {(license.status === "suspended" || license.status === "cancelled" || license.status === "expired") && (
                <button
                  onClick={() => setModal("reactivate")}
                  className="w-full rounded-lg border border-green-500/25 bg-green-500/10 py-2.5 text-sm font-medium text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  Reativar
                </button>
              )}
              {(license.status === "active" || license.status === "suspended") && (
                <button
                  onClick={() => setModal("cancel")}
                  className="w-full rounded-lg border border-red-500/25 bg-red-500/10 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={() => setModal("revoke")}
                className="w-full rounded-lg border border-red-900/40 bg-red-900/10 py-2.5 text-sm font-medium text-red-500 hover:bg-red-900/20 transition-colors"
              >
                Revogar e banir
              </button>
            </div>
          </div>

          {/* Internal note */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Nota interna</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Anotações privadas sobre esta licença..."
              className="w-full resize-none rounded-lg border border-white/10 bg-[#13131A] px-3 py-2 text-sm text-white placeholder-[#58585F] outline-none focus:border-iris-500/40"
            />
            <button
              onClick={saveNote}
              disabled={savingNote}
              className="mt-2 w-full rounded-lg bg-iris-700/20 border border-iris-500/30 py-2 text-xs font-medium text-iris-300 hover:bg-iris-700/30 transition-colors disabled:opacity-50"
            >
              {savingNote ? "Salvando..." : "Salvar nota"}
            </button>
          </div>

          {/* Meta */}
          <div className="rounded-xl border border-white/5 bg-[#19191E] p-5">
            <h2 className="mb-3 text-sm font-semibold text-white">Metadados</h2>
            <div className="space-y-2 text-xs text-[#9F9FA3]">
              <div className="flex items-center justify-between">
                <span className="text-[#58585F]">ID</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono">{license.id.slice(0, 8)}…</span>
                  <CopyButton text={license.id} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#58585F]">Origem</span>
                <span>{license.cakto_transaction_id ? "Cakto" : "Manual"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "suspend" && (
        <ConfirmModal title="Suspender licença" description="O cliente perderá acesso imediato ao app." confirmLabel="Suspender" confirmClassName="bg-amber-600 hover:bg-amber-500" onConfirm={() => doStatus("suspended")} onCancel={() => setModal(null)} />
      )}
      {modal === "reactivate" && (
        <ConfirmModal title="Reativar licença" description="O cliente voltará a ter acesso ao app." confirmLabel="Reativar" confirmClassName="bg-green-700 hover:bg-green-600" onConfirm={() => doStatus("active")} onCancel={() => setModal(null)} />
      )}
      {modal === "cancel" && (
        <ConfirmModal title="Cancelar licença" description="A licença será cancelada." confirmLabel="Cancelar licença" onConfirm={() => doStatus("cancelled")} onCancel={() => setModal(null)} />
      )}
      {modal === "revoke" && (
        <ConfirmModal title="Revogar e banir" description="Remove a licença, desconecta todos os devices e impede reuso. Ação irreversível." confirmLabel="Revogar" requireTyping="REVOGAR" onConfirm={doRevoke} onCancel={() => setModal(null)} />
      )}
    </div>
  );
}
