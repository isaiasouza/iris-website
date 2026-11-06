"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import { btnPrimary } from "../components/brand";
import { cn } from "@/lib/utils";

const MESSAGES: Record<string, string> = {
  NAME_REQUIRED: "Digite seu nome.",
  EMAIL_INVALID: "Confira o e-mail.",
  WHATSAPP_INVALID: "Confira o WhatsApp, com DDD. Ex.: (11) 98765-4321.",
  CONSENT_REQUIRED: "Marque a caixa de autorização para baixar.",
  RATE_LIMITED: "Muitas tentativas. Espere alguns minutos e tente de novo.",
};

const input =
  "h-12 w-full rounded-[10px] bg-brand-bg px-4 text-base text-white placeholder:text-brand-muted ring-1 ring-inset ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-brand-secondary";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: "irislink",
          name: form.get("name"),
          email: form.get("email"),
          whatsapp: form.get("whatsapp"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { downloadUrl?: string; error?: string };

      if (res.ok && data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        setStatus("done");
        window.location.assign(data.downloadUrl);
        return;
      }
      // Falha nossa ao salvar não impede o download.
      if (data.error === "SAVE_FAILED" && data.downloadUrl) {
        setDownloadUrl(data.downloadUrl);
        setStatus("done");
        window.location.assign(data.downloadUrl);
        return;
      }
      setError(MESSAGES[data.error ?? ""] ?? "Não deu certo. Tente de novo em instantes.");
      setStatus("idle");
    } catch {
      setError("Sem conexão. Confira a internet e tente de novo.");
      setStatus("idle");
    }
  }

  if (status === "done" && downloadUrl) {
    return (
      <div className="text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-[#33C85A]" />
        <p className="mt-4 font-display text-xl font-bold text-white">O download começou</p>
        <p className="mt-2 text-sm leading-6 text-brand-text-2">
          Abra o DMG e arraste o IRIS Link para Aplicativos. Faça isso nos dois Macs.
        </p>
        <a href={downloadUrl} className={cn(btnPrimary, "mt-6")}>
          <Download className="h-5 w-5" /> Baixar de novo
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 text-left" noValidate>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-white">Nome</span>
        <input name="name" required autoComplete="name" maxLength={120} placeholder="Seu nome" className={input} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-white">E-mail</span>
        <input name="email" type="email" required autoComplete="email" maxLength={254} placeholder="voce@email.com" className={input} />
      </label>
      <label className="grid gap-1.5">
        <span className="text-sm font-medium text-white">WhatsApp</span>
        <input name="whatsapp" type="tel" required inputMode="tel" autoComplete="tel" maxLength={40} placeholder="(11) 98765-4321" className={input} />
      </label>

      {/* Armadilha para robôs: invisível para pessoas */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Site
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-1 flex items-start gap-3 text-[13px] leading-5 text-brand-text-2">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#4C3CC6]" />
        <span>
          Aceito receber por e-mail e WhatsApp novidades do IRIS Link, do Iris Downloader e de outros apps da Iris Media. Posso sair quando quiser.{" "}
          <a href="/privacy" className="text-brand-secondary underline-offset-2 hover:underline">
            Política de privacidade
          </a>
        </span>
      </label>

      {error && (
        <p className="rounded-lg bg-[#FF8A3D]/10 px-3 py-2 text-sm text-[#FFB27F] ring-1 ring-inset ring-[#FF8A3D]/30" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className={cn(btnPrimary, "iris-shine group mt-2 w-full disabled:opacity-70")}>
        {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
        Baixar grátis para Mac
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
