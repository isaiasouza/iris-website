import { ArrowRight, CircleX, FileArchive, FolderOpen } from "lucide-react";
import { SectionHeader } from "./brand";
import { FileRows } from "./HeroApp";

const pains = [
  {
    pain: "ZIP de vários GB que trava na entrega do job",
    fix: "O Iris baixa arquivo por arquivo. Sem ZIP, sem corrupção.",
  },
  {
    pain: "O Drive demora para preparar e divide o download",
    fix: "O Iris transfere arquivo por arquivo, sem montar um pacote antes.",
  },
  {
    pain: "Abrir o navegador só para pegar um arquivo",
    fix: "Tudo no app. Navegue, baixe e envie sem sair do Mac.",
  },
  {
    pain: "Trocar de conta Google é uma via-sacra",
    fix: "Todas as contas na barra lateral. Um clique para trocar.",
  },
];

const files = [
  { name: "A001_C004_0912.mov", size: "4,82 GB" },
  { name: "A001_C005_0912.mov", size: "3,10 GB" },
  { name: "Trilha_final.wav", size: "94 MB" },
];

export default function PainSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="pain-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div id="pain-title">
          <SectionHeader
            eyebrow="O vilão é o ZIP"
            title={<>Um único ZIP pode atrasar <span className="text-iris-grad">a pasta inteira</span></>}
            text="Para quem trabalha com arquivos grandes, repetir download não é detalhe: é prazo perdido."
          />
        </div>

        {/* Comparação: o mesmo pedido, dois caminhos */}
        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-brand-surface p-6 ring-1 ring-white/[0.06] sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-brand-muted">
                <FileArchive className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-text-2">Pelo navegador</p>
                <p className="text-xs text-brand-muted">drive-download-20260912.zip</p>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-brand-text-2">Compactando a pasta…</span>
                <span className="tabular-nums text-brand-muted">98%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <i className="iris-stuck block h-full rounded-full bg-brand-muted/70" />
              </div>
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-400/[0.08] px-3 py-2 text-sm text-red-400 ring-1 ring-inset ring-red-400/25">
                <CircleX className="h-4 w-4" /> Falha no download. Tente de novo.
              </p>
              <p className="mt-4 text-sm leading-6 text-brand-muted">
                Nada chega ao Mac até o ZIP ficar pronto. Se falhar no fim, o download recomeça do zero.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-brand-surface p-6 shadow-[0_30px_80px_-40px_rgba(107,85,240,0.6)] ring-1 ring-brand-secondary/35 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/12 text-brand-secondary">
                <FolderOpen className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Com o Iris</p>
                <p className="text-xs text-brand-muted">Brutos — Cena 04 · 48 arquivos</p>
              </div>
            </div>
            <div className="mt-6">
              <FileRows items={files} />
            </div>
          </div>
        </div>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map(({ pain, fix }) => (
            <li key={pain} className="rounded-2xl bg-brand-surface p-5 ring-1 ring-white/[0.06]">
              <p className="text-sm text-brand-muted line-through decoration-red-400/60">{pain}</p>
              <p className="mt-3 flex items-start gap-2.5 text-[15px] leading-6 text-white">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand-secondary" />
                {fix}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
