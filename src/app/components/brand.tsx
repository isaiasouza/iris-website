import { useId } from "react";

/**
 * Peças da identidade Iris usadas em todas as seções do site.
 * Cores e tipos vêm do design system "Iris" (tokens brand-* e noite-* em globals.css).
 */

/** Ícone Iris: nuvem com seta vazada sobre o degradê Noite (branding/iris-icon.svg). */
export function IrisMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`noite-${id}`} gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="50" y2="100">
          <stop offset="0" stopColor="#6B55F0" />
          <stop offset="0.55" stopColor="#3A2DA8" />
          <stop offset="1" stopColor="#1A1446" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22.5" fill={`url(#noite-${id})`} />
      <g fill="#fff">
        <circle cx="35" cy="56" r="13" />
        <circle cx="54" cy="46" r="19" />
        <circle cx="68" cy="57" r="11" />
        <rect x="20" y="54" width="60" height="21" rx="10.5" />
      </g>
      <path
        d="M50 49v15M43.5 57.5L50 64l6.5-6.5"
        fill="none"
        stroke={`url(#noite-${id})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rótulo curto acima de títulos de seção. */
export function Eyebrow({
  children,
  className = "",
  onBrand = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** Sobre o degradê Noite ou o roxo: branco em vez de #9A85FF. */
  onBrand?: boolean;
}) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${onBrand ? "text-white" : "text-brand-secondary"} ${className}`}>
      {children}
    </p>
  );
}

/** Rótulo, título em Unbounded e texto de apoio de uma seção. */
export function SectionHeader({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: React.ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[40px]">
        {title}
      </h2>
      {text && (
        <p className={`mt-5 text-pretty text-base leading-7 text-brand-text-2 sm:text-lg ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {text}
        </p>
      )}
    </div>
  );
}

/** Ação principal: sólido em #4C3CC6 com texto branco (7,58:1). */
/** Selo das funções que pedem login no Google, em liberação gradual. */
export function BetaBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-inset ring-amber-300/25 ${className}`}
    >
      Beta
    </span>
  );
}

export const btnPrimary =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-brand-primary px-5 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/12 transition-colors hover:bg-brand-primary-hover active:opacity-85";

/** Ação secundária: neutra, com contorno. */
export const btnSecondary =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-brand-surface-2 px-5 text-[15px] font-medium text-white ring-1 ring-inset ring-white/10 transition-colors hover:bg-[#26262d]";

/** Ação sobre o degradê Noite ou sobre o roxo: branco com texto escuro. */
export const btnOnBrand =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] bg-white px-5 text-[15px] font-semibold text-brand-bg transition-colors hover:bg-iris-50 active:opacity-90";

/** A barra de progresso do app, motivo gráfico da marca. */
export function ProgressBar({
  value,
  className = "",
  track = "bg-brand-surface-2",
  fill = "bg-brand-secondary",
}: {
  value: number;
  className?: string;
  track?: string;
  fill?: string;
}) {
  return (
    <div className={`h-1.5 overflow-hidden rounded-full ${track} ${className}`}>
      <div className={`h-full rounded-full ${fill}`} style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} />
    </div>
  );
}
