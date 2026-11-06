import { HardDrive, Monitor, Zap } from "lucide-react";

/**
 * A aba "Usar discos" do IRIS Link, recriada em HTML a partir das telas do app
 * (ConnectTab). Decorativa: o texto do hero já diz tudo para leitores de tela.
 */
export default function LinkAppWindow() {
  return (
    <div className="relative mx-auto mt-14 max-w-4xl sm:mt-16" aria-hidden="true">
      <div className="absolute -inset-x-10 -top-10 bottom-0 rounded-[40px] bg-noite-top/20 blur-[80px]" />
      <div className="relative overflow-hidden rounded-2xl bg-brand-surface text-left shadow-[0_40px_100px_-30px_#000] ring-1 ring-white/10">
        {/* Barra da janela */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-brand-muted">IRIS Link</span>
        </div>

        {/* Cabeçalho do app */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-5 sm:px-6">
          <div>
            <p className="text-base font-semibold text-white">Usar discos</p>
            <p className="text-xs text-brand-muted">Monte os discos dos seus outros Macs</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF8A3D]/15 px-2.5 py-1 text-[11px] font-semibold text-[#FFB27F] ring-1 ring-inset ring-[#FF8A3D]/35">
            <Zap className="h-3 w-3" /> Thunderbolt
          </span>
        </div>

        {/* Mac remoto e seus discos */}
        <div className="m-4 rounded-xl bg-brand-surface-2 p-3 ring-1 ring-white/[0.06] sm:m-6 sm:p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Monitor className="h-4 w-4 text-brand-secondary" /> Mac Studio
            <span className="rounded-full bg-[#FF8A3D]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FFB27F]">Thunderbolt</span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-white/[0.05] pt-3">
            <HardDrive className="h-5 w-5 shrink-0 text-[#33C85A]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">RAID Projetos</p>
              <p className="text-xs text-[#33C85A]">Montado via Thunderbolt</p>
            </div>
            <div className="flex gap-1.5 text-[11px] text-white/85">
              <span className="rounded-md bg-white/[0.06] px-2 py-1">Abrir</span>
              <span className="hidden rounded-md bg-white/[0.06] px-2 py-1 min-[420px]:inline">Testar velocidade</span>
              <span className="rounded-md bg-white/[0.06] px-2 py-1">Ejetar</span>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-2 pl-8 text-[11px] text-brand-text-2">
            <span className="grid h-3.5 w-3.5 place-items-center rounded-[4px] bg-brand-primary text-[9px] text-white">✓</span>
            Montar sozinho quando este Mac aparecer
          </p>

          <div className="mt-3 flex items-center gap-3 border-t border-white/[0.05] pt-3">
            <HardDrive className="h-5 w-5 shrink-0 text-brand-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">SSD Mídia</p>
              <p className="text-xs text-brand-muted">Desconectado</p>
            </div>
            <span className="rounded-md bg-brand-primary px-2.5 py-1 text-[11px] font-semibold text-white">Conectar</span>
          </div>
        </div>

        {/* Rodapé com o velocímetro */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-2.5 text-[11px] text-brand-muted sm:px-6">
          <span className="flex items-center gap-3">
            <span>Thunderbolt ↓ ↑</span>
            <span className="hidden sm:inline">Rede (en0) ↓ ↑</span>
          </span>
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#33C85A]" />1 disco montado</span>
        </div>
      </div>
    </div>
  );
}
