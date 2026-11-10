"use client";

import { Check, Copy, KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type State =
  | { kind: "loading" }
  | { kind: "ready"; licenseKey: string; email: string }
  | { kind: "waiting" };

const POLL_EVERY_MS = 3000;
const GIVE_UP_AFTER = 20; // ~1 minuto; depois disso o e-mail resolve.

/** Mostra a chave assim que o pagamento é confirmado e a licença existe. */
export function LicenseReveal({ checkoutRef }: { checkoutRef: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(`/api/license/by-checkout?ref=${encodeURIComponent(checkoutRef)}`, { cache: "no-store" });
        const json = await res.json();
        if (cancelled) return;
        if (json.status === "ready") {
          setState({ kind: "ready", licenseKey: json.licenseKey, email: json.email });
          return;
        }
        if (json.status === "invalid") {
          setState({ kind: "waiting" });
          return;
        }
      } catch {
        // Rede instável: tenta de novo no próximo ciclo.
      }
      if (attempts >= GIVE_UP_AFTER) {
        setState({ kind: "waiting" });
        return;
      }
      timer = setTimeout(poll, POLL_EVERY_MS);
    }

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [checkoutRef]);

  async function copyKey(licenseKey: string) {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de área de transferência: a chave segue visível para copiar à mão.
    }
  }

  return (
    <section
      aria-live="polite"
      className="mx-auto mb-8 max-w-xl rounded-2xl border border-iris-300/25 bg-iris-300/[0.06] p-5 text-center sm:p-6"
    >
      <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-iris-300/80">
        <KeyRound className="h-4 w-4" /> Sua chave de licença
      </p>

      {state.kind === "loading" && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Confirmando o pagamento e gerando sua chave…
        </p>
      )}

      {state.kind === "ready" && (
        <>
          <p className="mt-4 select-all break-all font-mono text-xl font-semibold tracking-[0.12em] text-white sm:text-2xl">
            {state.licenseKey}
          </p>
          <button
            type="button"
            onClick={() => copyKey(state.licenseKey)}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#071018] transition hover:bg-iris-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Chave copiada" : "Copiar chave"}
          </button>
          <p className="mt-3 text-xs leading-5 text-white/45">
            Também enviamos para {state.email}. Cole a chave quando o Iris pedir na primeira abertura.
          </p>
        </>
      )}

      {state.kind === "waiting" && (
        <p className="mt-4 text-sm leading-6 text-white/60">
          Seu pagamento está sendo confirmado. A chave chega no seu e-mail em instantes; se não chegar, use o
          reenvio logo abaixo.
        </p>
      )}
    </section>
  );
}
