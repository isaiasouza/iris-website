"use client";

import { useState } from "react";
import Image from "next/image";

interface Device {
  id: string;
  hardware_id: string;
  device_name: string | null;
  os_version: string | null;
  is_active: boolean;
  activated_at: string;
  last_seen_at: string;
}

interface LicenseData {
  license_key: string;
  plan: "annual" | "lifetime";
  status: string;
  expires_at: string | null;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  devices: Device[];
  devices_used: number;
  devices_max: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `há ${days} dia${days !== 1 ? "s" : ""}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function MinhaLicenca() {
  // Step 1: login form
  const [step, setStep] = useState<"login" | "dashboard">("login");
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null);
  const [copied, setCopied] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Device | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/license/status?license_key=${encodeURIComponent(licenseKey)}&email=${encodeURIComponent(email)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error === "LICENSE_NOT_FOUND"
            ? "Licença não encontrada. Verifique a chave e o email."
            : "Erro ao verificar. Tente novamente."
        );
        return;
      }

      setLicenseData(data);
      setStep("dashboard");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveDevice(device: Device) {
    setRemovingId(device.id);
    setConfirmRemove(null);
    setError("");

    try {
      const res = await fetch("/api/license/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: licenseKey,
          hardware_id: device.hardware_id,
        }),
      });

      if (!res.ok) {
        setError("Erro ao remover dispositivo. Tente novamente.");
        return;
      }

      // Atualiza lista local
      setLicenseData((prev) =>
        prev
          ? {
              ...prev,
              devices: prev.devices.map((d) =>
                d.id === device.id ? { ...d, is_active: false } : d
              ),
              devices_used: Math.max(0, prev.devices_used - 1),
            }
          : prev
      );
    } catch {
      setError("Erro de conexão.");
    } finally {
      setRemovingId(null);
    }
  }

  function copyKey() {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCancelSubscription() {
    setCancelLoading(true);
    try {
      const res = await fetch("/api/license/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey, email }),
      });
      if (res.ok) {
        setLicenseData((prev) => prev ? { ...prev, status: "cancelled" } : prev);
        setCancelConfirm(false);
      } else {
        setError("Erro ao cancelar. Entre em contato pelo email.");
      }
    } catch {
      setError("Erro de conexão.");
    } finally {
      setCancelLoading(false);
    }
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  if (step === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ background: "#13131A" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Image src="/logo.png" alt="Iris Downloader" width={56} height={56} className="rounded-2xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Minha Licença</h1>
            <p className="text-[#9F9FA3] mt-2 text-sm">
              Digite seu email e chave de licença para acessar
            </p>
          </div>

          <form onSubmit={handleLogin} className="bg-[#19191E] border border-white/5 rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm text-[#9F9FA3] mb-2">Email da compra</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#13131A] border border-white/8 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#3a3a45] focus:outline-none focus:border-iris-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9F9FA3] mb-2">Chave de licença</label>
              <input
                type="text"
                required
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                placeholder="IRIS-XXXX-XXXX-XXXX-XXXX"
                className="w-full bg-[#13131A] border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder:text-[#3a3a45] focus:outline-none focus:border-iris-500/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-iris-700 to-iris-500 text-white font-semibold py-3 rounded-xl transition-all hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Acessar minha licença →"}
            </button>

            <p className="text-center text-xs text-[#58585F]">
              Não tem uma licença?{" "}
              <a href="/#pricing" className="text-iris-400 hover:text-iris-300">
                Ver planos
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ───────────────────────────────────────────────────────────

  if (!licenseData) return null;

  const planLabel = licenseData.plan === "lifetime" ? "Vitalício" : "Anual";
  const statusColor: Record<string, string> = {
    active: "text-green-400",
    suspended: "text-yellow-400",
    cancelled: "text-red-400",
    expired: "text-red-400",
  };
  const statusLabel: Record<string, string> = {
    active: "Ativo",
    suspended: "Suspenso",
    cancelled: "Cancelado",
    expired: "Expirado",
  };

  const activeDevices = licenseData.devices.filter((d) => d.is_active);
  const inactiveDevices = licenseData.devices.filter((d) => !d.is_active);

  return (
    <div className="min-h-screen px-6 py-16" style={{ background: "#13131A" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Image src="/logo.png" alt="Iris Downloader" width={44} height={44} className="rounded-xl" />
          <div>
            <h1 className="text-xl font-bold text-white">Minha Licença</h1>
            <p className="text-[#58585F] text-sm">{email}</p>
          </div>
          <button
            onClick={() => { setStep("login"); setLicenseData(null); }}
            className="ml-auto text-sm text-[#58585F] hover:text-[#9F9FA3] transition-colors"
          >
            Sair
          </button>
        </div>

        {error && (
          <div className="mb-6 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Licença card */}
        <div className="bg-[#19191E] border border-white/6 rounded-2xl p-6 mb-4">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#58585F]">Plano</span>
                <span className="bg-iris-700/20 border border-iris-500/25 text-iris-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  {planLabel}
                </span>
              </div>
              <span className={`text-sm font-medium ${statusColor[licenseData.status] ?? "text-[#9F9FA3]"}`}>
                ● {statusLabel[licenseData.status] ?? licenseData.status}
              </span>
            </div>
            {licenseData.expires_at && (
              <div className="text-right">
                <div className="text-xs text-[#58585F]">Expira em</div>
                <div className="text-sm text-white font-medium">{formatDate(licenseData.expires_at)}</div>
              </div>
            )}
          </div>

          {/* Chave */}
          <div>
            <div className="text-xs text-[#58585F] mb-2 uppercase tracking-widest">Chave de licença</div>
            <div className="flex items-center gap-3 bg-[#13131A] border border-white/6 rounded-xl px-4 py-3">
              <span className="font-mono text-iris-300 text-sm flex-1 tracking-wider">
                {licenseData.license_key}
              </span>
              <button
                onClick={copyKey}
                className="text-xs text-[#9F9FA3] hover:text-white transition-colors shrink-0"
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-[#19191E] border border-white/6 rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-white">Dispositivos</h2>
            <span className="text-sm text-[#58585F]">
              {licenseData.devices_used}/{licenseData.devices_max} usados
            </span>
          </div>

          {/* Barra de uso */}
          <div className="h-1.5 bg-[#2a2a35] rounded-full overflow-hidden mb-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-iris-700 to-iris-500 transition-all"
              style={{ width: `${(licenseData.devices_used / licenseData.devices_max) * 100}%` }}
            />
          </div>

          {activeDevices.length === 0 && (
            <p className="text-sm text-[#58585F] text-center py-4">
              Nenhum dispositivo ativo. Abra o app e ative com sua chave.
            </p>
          )}

          <div className="space-y-3">
            {activeDevices.map((device) => (
              <div key={device.id} className="flex items-center gap-4 bg-[#13131A] border border-white/5 rounded-xl p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-iris-700/15 text-iris-400 text-lg shrink-0">
                  💻
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {device.device_name ?? "Mac desconhecido"}
                  </div>
                  <div className="text-xs text-[#58585F] mt-0.5">
                    {device.os_version} · Último acesso {timeAgo(device.last_seen_at)}
                  </div>
                </div>
                <button
                  onClick={() => setConfirmRemove(device)}
                  disabled={removingId === device.id}
                  className="text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40 shrink-0"
                >
                  {removingId === device.id ? "..." : "Remover"}
                </button>
              </div>
            ))}
          </div>

          {/* Dispositivos inativos */}
          {inactiveDevices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/4">
              <div className="text-xs text-[#3a3a45] mb-3">Inativos</div>
              <div className="space-y-2">
                {inactiveDevices.map((device) => (
                  <div key={device.id} className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-40">
                    <span className="text-base">💻</span>
                    <span className="text-xs text-[#58585F]">
                      {device.device_name ?? "Mac desconhecido"} · removido
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Assinatura anual */}
        {licenseData.plan === "annual" && licenseData.status === "active" && (
          <div className="bg-[#19191E] border border-white/6 rounded-2xl p-6 mb-4">
            <h2 className="text-base font-semibold text-white mb-4">Assinatura</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white">Plano Anual — R$ 49,90/ano</div>
                {licenseData.expires_at && (
                  <div className="text-xs text-[#58585F] mt-1">
                    Próxima cobrança: {formatDate(licenseData.expires_at)}
                  </div>
                )}
              </div>
              <button
                onClick={() => setCancelConfirm(true)}
                className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
              >
                Cancelar assinatura
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-[#3a3a45] mt-8">
          Precisa de ajuda?{" "}
          <a href="mailto:suporte@irisdownloader.app" className="text-iris-600/70 hover:text-iris-400 transition-colors">
            suporte@irisdownloader.app
          </a>
        </p>
      </div>

      {/* Modal: Confirmar remoção */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-[#19191E] border border-white/8 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-semibold text-white mb-2">Remover dispositivo?</h3>
            <p className="text-sm text-[#9F9FA3] mb-6">
              <strong className="text-white">{confirmRemove.device_name ?? "Este Mac"}</strong> será desconectado.
              O app precisará ser reativado nesse dispositivo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 border border-white/10 text-[#9F9FA3] rounded-xl py-2.5 text-sm hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemoveDevice(confirmRemove)}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl py-2.5 text-sm hover:bg-red-500/30 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cancelar assinatura */}
      {cancelConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-[#19191E] border border-white/8 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-semibold text-white mb-2">Cancelar assinatura?</h3>
            <p className="text-sm text-[#9F9FA3] mb-6">
              Sua licença ficará ativa até o final do período pago. Após isso, o app para de receber atualizações.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelConfirm(false)}
                className="flex-1 border border-white/10 text-[#9F9FA3] rounded-xl py-2.5 text-sm hover:text-white transition-colors"
              >
                Manter plano
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl py-2.5 text-sm hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {cancelLoading ? "..." : "Cancelar mesmo assim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
