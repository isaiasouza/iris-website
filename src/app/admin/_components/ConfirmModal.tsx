"use client";

import { useState } from "react";

interface Props {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName?: string;
  requireTyping?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  description,
  confirmLabel,
  confirmClassName = "bg-red-600 hover:bg-red-500",
  requireTyping,
  onConfirm,
  onCancel,
}: Props) {
  const [typed, setTyped] = useState("");

  const canConfirm = !requireTyping || typed === requireTyping;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#19191E] p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-[#9F9FA3]">{description}</p>

        {requireTyping && (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs text-[#9F9FA3]">
              Digite <span className="font-mono text-white">{requireTyping}</span> para confirmar
            </label>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#13131A] px-3 py-2 text-sm text-white outline-none focus:border-red-500/40"
              placeholder={requireTyping}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-[#9F9FA3] transition-colors hover:border-white/20 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-40 ${confirmClassName}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
