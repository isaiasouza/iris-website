"use client";

import { useState } from "react";
import Image from "next/image";
import { SectionHeader } from "./brand";

const tabs = [
  { id: "files", label: "Navegando no Drive" },
  { id: "downloads", label: "Baixando sem ZIP" },
  { id: "grid", label: "Vista em grade" },
  { id: "accounts", label: "Múltiplas contas" },
  { id: "settings", label: "Configurações" },
];

export default function Screenshots() {
  const [active, setActive] = useState("files");
  const current = tabs.find((t) => t.id === active);

  return (
    <section id="screenshots" className="scroll-mt-24 bg-gradient-to-b from-brand-bg via-[#101016] to-brand-bg py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="O app"
          title={<>Veja o arquivo andar, <span className="text-iris-grad">não uma barra de ZIP parada</span></>}
          text="Construído especificamente para macOS. Não é um app web embrulhado em Electron."
        />

        {/* Abas no mesmo desenho das abas de filtro do app */}
        <div className="mt-10 flex justify-center">
          <div role="tablist" aria-label="Telas do app" className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-brand-surface/60 p-1.5 ring-1 ring-white/[0.06] backdrop-blur">
            {tabs.map((tab) => {
              const selected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="screenshot-panel"
                  onClick={() => setActive(tab.id)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selected ? "bg-brand-secondary/14 text-white ring-1 ring-inset ring-brand-secondary/35" : "text-brand-muted hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div id="screenshot-panel" role="tabpanel" className="mx-auto mt-8 max-w-5xl rounded-[22px] bg-gradient-to-b from-brand-secondary/35 to-white/[0.04] p-2 shadow-[0_60px_140px_-60px_rgba(107,85,240,0.7)] sm:p-2.5">
          <Image
            key={active}
            src={`/screenshots/${active}.png`}
            alt={`Iris Downloader: ${current?.label}`}
            width={1200}
            height={750}
            className="w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
