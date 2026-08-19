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
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="font-mono text-[10px] font-semibold uppercase text-blue-400">
            O app
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-4xl">
            Veja o arquivo andar, não uma barra de ZIP parada
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-neutral-400">
            Construído especificamente para macOS. Não é um app web embrulhado em Electron.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-[#404040] bg-[#262626] text-neutral-400 hover:border-neutral-500 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Screenshot */}
        <div className="mt-8 overflow-hidden rounded-md border border-[#404040] bg-[#262626] p-2">
          <Image
            key={active}
            src={`/screenshots/${active}.png`}
            alt={`Iris Downloader — ${tabs.find(t => t.id === active)?.label}`}
            width={1200}
            height={750}
            className="w-full rounded-sm"
            priority
          />
        </div>
      </div>
    </section>
  );
}
