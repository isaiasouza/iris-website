import { Check, FolderDown, FolderTree, PauseCircle, PlaySquare, ShieldCheck, Trash2, Upload, Users } from "lucide-react";
import { BetaBadge, SectionHeader } from "./brand";
import SpotlightCard from "./SpotlightCard";

const tree = [
  { name: "Camera A", count: "112 arquivos", depth: 1 },
  { name: "Audio", count: "24 arquivos", depth: 1 },
  { name: "Proxies", count: "112 arquivos", depth: 1 },
  { name: "Cena04_v3.prproj", count: "", depth: 1 },
];

const accounts = [
  { letter: "E", color: "#9A85FF" },
  { letter: "C", color: "#F59E0B" },
  { letter: "P", color: "#22C55E" },
];

// beta: precisa entrar com o Google, o que está em liberação gradual.
const sideFeatures: { icon: typeof Check; title: string; description: string; beta?: boolean }[] = [
  { icon: PauseCircle, title: "Pausar e retomar", description: "A internet caiu? Retome de onde parou, sem recomeçar a pasta inteira." },
  { icon: PlaySquare, title: "YouTube, Instagram e TikTok", description: "Vídeo até 4K ou só o áudio em MP3. Cole o link e pronto, sem conta." },
  { icon: ShieldCheck, title: "Seus dados não saem do seu Mac", description: "Comunicação direta com o serviço de origem. Nenhum servidor intermediário." },
  { icon: FolderTree, title: "Navegador de pastas", description: "Navegue pelo seu Drive dentro do app, sem abrir o navegador.", beta: true },
  { icon: Upload, title: "Envio arrastando", description: "Arraste arquivos do Finder direto para qualquer pasta do Drive.", beta: true },
  { icon: Trash2, title: "Excluir pelo app", description: "Mova arquivos para a lixeira do Drive sem abrir o navegador.", beta: true },
];

function Icon({ icon: I }: { icon: typeof Check }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-secondary/12 text-brand-secondary">
      <I className="h-5 w-5" />
    </span>
  );
}

export default function Features() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="O que muda"
          title={<>O fluxo do Drive, <span className="text-iris-grad">sem sair do Mac</span></>}
          text="Não é sincronização automática nem navegador disfarçado. É download e envio sob seu controle. O que tem o selo Beta pede login no Google e está em liberação gradual."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <article className="bg-noite relative overflow-hidden rounded-2xl p-7 sm:p-9 md:col-span-4 md:row-span-2">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/12 text-white">
                <FolderDown className="h-6 w-6" />
              </span>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white">Principal diferencial</span>
            </div>
            <h3 className="mt-8 text-balance font-display text-2xl font-bold leading-tight text-white sm:text-[30px]">
              Sem ZIP, sem limite, sem dor de cabeça
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-white/80">
              O Drive gera ZIP para pastas. ZIP trava, corrompe e falha quando a pasta é grande. O Iris baixa cada arquivo individualmente, mantendo a estrutura original intacta, não importa quantos GB ou quantos arquivos.
            </p>
            <div className="mt-7 rounded-xl bg-black/25 p-4 font-mono text-[13px] leading-8 text-iris-100 ring-1 ring-inset ring-white/12" aria-label="Exemplo: a pasta chega com as subpastas intactas">
              <p className="flex items-center gap-2"><FolderTree className="h-4 w-4" /> Brutos — Cena 04</p>
              {tree.map((t) => (
                <p key={t.name} className="flex items-center justify-between gap-3 pl-6">
                  <span className="truncate">{t.name}</span>
                  <span className="flex shrink-0 items-center gap-1 text-emerald-300"><Check className="h-3.5 w-3.5" />{t.count}</span>
                </p>
              ))}
            </div>
          </article>

          <SpotlightCard className="p-6 md:col-span-2">
            <Icon icon={Users} />
            <h3 className="mt-5 flex flex-wrap items-center gap-2 text-base font-semibold text-white">Várias contas Google no mesmo app <BetaBadge /></h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-2">Pessoal, trabalho e cliente: tudo em um lugar. Um clique para trocar.</p>
            <div className="mt-5 flex" aria-hidden="true">
              {accounts.map((a, i) => (
                <span key={a.letter} className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold text-white ring-2 ring-brand-surface ${i ? "-ml-2" : ""}`} style={{ background: a.color }}>{a.letter}</span>
              ))}
              <span className="-ml-2 grid h-9 w-9 place-items-center rounded-full bg-brand-line text-xs font-bold text-white ring-2 ring-brand-surface">+2</span>
            </div>
          </SpotlightCard>

          <SpotlightCard className="p-6 md:col-span-2">
            <Icon icon={sideFeatures[0].icon} />
            <h3 className="mt-5 text-base font-semibold text-white">{sideFeatures[0].title}</h3>
            <p className="mt-2 text-sm leading-6 text-brand-text-2">{sideFeatures[0].description}</p>
          </SpotlightCard>

          {/* 5 cards: 2 numa linha (3+3) e 3 na outra (2+2+2), sem buraco no grid */}
          {sideFeatures.slice(1).map(({ icon, title, description, beta }, i) => (
            <SpotlightCard key={title} className={`p-6 ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}>
              <Icon icon={icon} />
              <h3 className="mt-5 flex flex-wrap items-center gap-2 text-base font-semibold text-white">{title}{beta && <BetaBadge />}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-text-2">{description}</p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
