"use client";

import { useState } from "react";
import Image from "next/image";

const tabs = [
  { id: "files",     label: "Navegando no Drive" },
  { id: "downloads", label: "Baixando sem ZIP" },
  { id: "grid",      label: "Vista em grade" },
  { id: "accounts",  label: "Múltiplas contas" },
  { id: "settings",  label: "Configurações" },
];

export default function Screenshots() {
  const [active, setActive] = useState("files");

  return (
    <section id="screenshots" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-iris-700/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/70">
            O app
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            Veja o arquivo andar, não uma barra de ZIP parada
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#9F9FA3]">
            Construído especificamente para macOS. Não é um app web embrulhado em Electron.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                active === tab.id
                  ? "bg-gradient-to-r from-iris-700 to-iris-500 text-white shadow-lg shadow-iris-700/20"
                  : "border border-white/10 bg-white/5 text-[#9F9FA3] hover:border-white/20 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Screenshot */}
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-iris-950/40">
          <Image
            key={active}
            src={`/screenshots/${active}.png`}
            alt={`Iris Downloader — ${tabs.find(t => t.id === active)?.label}`}
            width={1200}
            height={750}
            className="w-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
