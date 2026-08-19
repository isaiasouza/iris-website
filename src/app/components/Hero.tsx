"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Check, Cloud, Download, HardDrive, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedGradient from "@/components/ui/animated-gradient";

const proof = ["2.000+ downloads", "Assinado pela Apple", "API oficial do Google"];

const heroGradientConfig = {
  preset: "custom",
  color1: "#171717",
  color2: "#1e3a8a",
  color3: "#3b82f6",
  rotation: -32,
  proportion: 18,
  scale: 0.38,
  speed: 9,
  distortion: 4,
  swirl: 24,
  swirlIterations: 5,
  softness: 92,
  offset: -240,
  shape: "Edge",
  shapeSize: 42,
} as const;

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#404040] bg-[#171717] pb-14 pt-24 text-white sm:pb-20 sm:pt-32 lg:pt-36">
      <AnimatedGradient
        config={heroGradientConfig}
        noise={{ opacity: 0.12, scale: 0.75 }}
        className="pointer-events-none opacity-55"
        style={{ zIndex: 0 }}
      />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(23,23,23,.96)_0%,rgba(23,23,23,.84)_46%,rgba(23,23,23,.48)_100%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl"
        >
          <Badge variant="outline" className="h-6 max-w-full rounded-md border-[#404040] bg-[#1f1f1f] px-2.5 font-mono text-[10px] uppercase tracking-normal text-neutral-300">
            <span className="sm:hidden">Para profissionais criativos no Mac</span>
            <span className="hidden sm:inline">Para designers, editores e videomakers no Mac</span>
          </Badge>

          <h1 className="mt-5 max-w-[760px] text-[36px] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[68px]">
            Baixe pastas grandes do Drive. <span className="text-blue-400">Sem esperar o ZIP.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15px] leading-6 text-neutral-400 sm:text-lg sm:leading-7">
            O Iris baixa 10, 50 ou 100 GB direto no Mac, preserva as pastas e reúne todas as suas contas Google em um app nativo.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group h-12 min-w-0 max-w-full rounded-md bg-blue-500 px-5 text-base font-semibold text-white shadow-none hover:bg-blue-400 sm:w-auto">
              <a href="/download">
                <Download className="h-5 w-5" />
                <span className="sm:hidden">Baixar grátis</span>
                <span className="hidden sm:inline">Baixar grátis para Mac</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 w-full rounded-md border-[#404040] bg-[#262626] px-5 text-sm font-medium text-neutral-200 shadow-none hover:bg-[#303030] hover:text-white sm:w-auto">
              <a href="#pricing">Licenças a partir de R$ 49,90</a>
            </Button>
          </div>

          <p className="mt-3 font-mono text-[10px] uppercase text-neutral-500">
            Teste sem cartão · macOS 14+
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="min-w-0"
        >
          <div className="overflow-hidden rounded-md border border-[#404040] bg-[#262626]">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-[#404040] px-3 py-3 font-mono text-[10px] uppercase text-neutral-400 sm:px-4">
              <span className="flex items-center gap-1.5 text-neutral-200"><Cloud className="h-3.5 w-3.5 text-blue-400" /> Drive</span>
              <span className="relative h-px overflow-hidden bg-[#404040]">
                <span className="absolute inset-y-0 left-0 w-3/4 bg-blue-500" />
              </span>
              <span className="flex items-center gap-1.5 text-neutral-200"><HardDrive className="h-3.5 w-3.5 text-blue-400" /> Mac</span>
            </div>
            <div className="p-2">
              <Image
                src="/screenshots/downloads.png"
                alt="Fila de downloads do Iris Downloader preservando pastas do Google Drive"
                width={1200}
                height={750}
                className="w-full rounded-sm"
                priority
              />
            </div>
            <div className="flex items-center justify-between border-t border-[#404040] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">Projeto_cliente_2026</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase text-neutral-500">Estrutura original preservada</p>
              </div>
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <ul className="relative z-10 mx-auto mt-10 grid max-w-6xl grid-cols-3 gap-2 px-4 text-[10px] leading-4 text-neutral-400 sm:flex sm:gap-6 sm:px-6 sm:text-xs" aria-label="Provas de confiança">
        {proof.map((item) => (
          <li key={item} className="flex items-start gap-1.5">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-blue-400" strokeWidth={2.5} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
