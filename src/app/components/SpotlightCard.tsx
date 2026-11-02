"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card com a borda que acende onde o mouse está (classe .iris-spot em globals.css). */
export default function SpotlightCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <article
      className={cn("iris-spot relative overflow-hidden rounded-2xl bg-brand-surface ring-1 ring-white/[0.07]", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </article>
  );
}
