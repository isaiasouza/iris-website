"use client";

import { Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

/** "Não chegou?" na própria página de obrigado: reenvia a chave para o e-mail da compra. */
export function ResendLicenseForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/license/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-xl border border-white/8 bg-white/3 p-4 text-left">
      <p className="text-sm font-medium text-white">O e-mail não chegou?</p>
      <p className="mt-1 text-sm leading-5 text-white/48">
        Espere 2 minutos e confira Spam e Promoções. Se ainda não estiver lá, digite o e-mail usado no pagamento e
        enviamos a chave de novo.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="resend-email">E-mail usado no pagamento</label>
        <input
          id="resend-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }}
          placeholder="voce@email.com"
          className="min-h-11 flex-1 rounded-lg border border-white/12 bg-[#071018] px-3 text-sm text-white placeholder:text-white/30 focus:border-iris-300/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/6 px-4 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white disabled:opacity-50"
        >
          <Mail className="h-4 w-4" />
          {status === "sending" ? "Enviando…" : "Reenviar minha chave"}
        </button>
      </div>
      <p className="mt-2 min-h-5 text-xs" aria-live="polite">
        {status === "sent" && (
          <span className="text-emerald-300">
            Se houver uma licença com esse e-mail, a chave chega em instantes.
          </span>
        )}
        {status === "error" && (
          <span className="text-red-300">
            Não conseguimos enviar agora. Tente de novo em alguns minutos ou escreva para contato@irisdownloader.com.br.
          </span>
        )}
      </p>
    </form>
  );
}
