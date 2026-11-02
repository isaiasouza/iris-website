import { ArrowDownToLine, Check, CheckCircle2, FolderTree, Wifi } from "lucide-react";

/**
 * A janela do app no hero: contas na lateral e uma pasta descendo arquivo por
 * arquivo, com as barras do app animadas (só CSS). Decorativa: o texto do hero
 * já diz tudo para leitores de tela.
 */

const accounts = [
  { name: "estudio@gmail.com", color: "#9A85FF", on: true },
  { name: "cliente.agencia", color: "#F59E0B" },
  { name: "pessoal", color: "#22C55E" },
];

const files = [
  { name: "A001_C004_0412.braw", size: "12,4 GB" },
  { name: "A001_C005_0412.braw", size: "9,8 GB" },
  { name: "Audio/Boom_T03.wav", size: "840 MB" },
  { name: "Proxies/A001_C004.mov", size: "1,2 GB" },
  { name: "Projeto/Cena04_v3.prproj", size: "38 MB" },
];

export function FileRows({ items, offset = 0 }: { items: { name: string; size: string }[]; offset?: number }) {
  return (
    <ul>
      {items.map((f, i) => (
        <li key={f.name} className="grid grid-cols-[22px_1fr_auto] items-center gap-3 border-t border-white/[0.05] py-2.5 text-left text-[13px] sm:py-3">
          <span className="h-5 w-5 rounded-md bg-gradient-to-br from-brand-secondary/50 to-brand-primary/40" />
          <div className="min-w-0">
            <p className="truncate text-white/90">{f.name}</p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
              <i className="iris-fill block h-full rounded-full bg-gradient-to-r from-noite-top to-brand-secondary" style={{ animationDelay: `${(i + offset) * 0.5}s` }} />
            </div>
          </div>
          <span className="text-xs tabular-nums text-brand-muted">{f.size}</span>
        </li>
      ))}
    </ul>
  );
}

function Chip({ className, label, value, icon: Icon, delay = 0 }: { className: string; label: string; value: string; icon: typeof Check; delay?: number }) {
  return (
    <div className={`iris-bob absolute z-10 hidden rounded-2xl bg-brand-surface/90 px-3.5 py-2.5 text-left shadow-[0_24px_50px_-20px_#000] ring-1 ring-white/10 backdrop-blur-md lg:block ${className}`} style={{ animationDelay: `${delay}s` }}>
      <p className="flex items-center gap-1.5 text-xs text-brand-muted"><Icon className="h-3.5 w-3.5 text-brand-secondary" />{label}</p>
      <p className="mt-0.5 text-[15px] font-semibold text-white">{value}</p>
    </div>
  );
}

export default function HeroApp() {
  return (
    <div className="relative mx-auto mt-14 max-w-[920px] [perspective:1600px] sm:mt-16" aria-hidden="true">
      <div className="grid overflow-hidden rounded-2xl bg-[#16161c] shadow-[0_60px_160px_-40px_rgba(76,60,198,0.75)] ring-1 ring-white/10 [transform-origin:top_center] md:grid-cols-[190px_1fr] md:[transform:rotateX(14deg)]">
        <aside className="hidden border-r border-white/[0.06] bg-[#131318] p-3.5 text-[12.5px] text-brand-text-2 md:block">
          <div className="mb-5 flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <p className="mb-1 ml-2 text-[10px] uppercase tracking-[0.12em] text-brand-muted">Contas</p>
          {accounts.map((a) => (
            <p key={a.name} className={`mt-1 flex items-center gap-2 truncate rounded-lg px-2 py-1.5 ${a.on ? "bg-brand-secondary/14 text-white" : ""}`}>
              <span className="h-5 w-5 shrink-0 rounded-full" style={{ background: a.color }} />
              {a.name}
            </p>
          ))}
          <p className="mb-1 ml-2 mt-5 text-[10px] uppercase tracking-[0.12em] text-brand-muted">Transferências</p>
          <p className="flex items-center gap-2 rounded-lg bg-brand-secondary/14 px-2 py-1.5 text-white"><ArrowDownToLine className="h-3.5 w-3.5" /> Baixando · 5</p>
          <p className="mt-1 flex items-center gap-2 px-2 py-1.5"><Check className="h-3.5 w-3.5" /> Concluídos · 307</p>
        </aside>

        <div className="p-4 sm:px-5 sm:py-4">
          <div className="mb-2 flex items-end justify-between gap-4 sm:mb-3">
            <div className="min-w-0 text-left">
              <p className="truncate text-[15px] font-semibold text-white">Brutos — Cena 04</p>
              <p className="truncate text-xs text-brand-text-2">Google Drive › Mac › Downloads</p>
            </div>
            <p className="shrink-0 font-display text-2xl font-bold text-white sm:text-[30px]">
              86<span className="ml-1 font-sans text-xs font-normal text-brand-text-2">MB/s</span>
            </p>
          </div>
          <FileRows items={files} />
        </div>
      </div>

      <Chip className="-left-14 top-[250px]" icon={FolderTree} label="Sem ZIP" value="48,2 GB · 312 arquivos" />
      <Chip className="-right-8 top-14" icon={Wifi} label="Internet caiu?" value="Continua de onde parou" delay={1.2} />
      <Chip className="right-10 top-[300px]" icon={CheckCircle2} label="Pastas" value="Estrutura intacta" delay={2.4} />
    </div>
  );
}
