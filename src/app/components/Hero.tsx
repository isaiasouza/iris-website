"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Download, FolderDown, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const proof = [
  "2.000+ downloads",
  "Assinado pela Apple",
  "API oficial do Google",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#071018] pb-12 pt-24 text-white sm:pb-20 sm:pt-32 lg:min-h-[760px] lg:pt-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_25%,rgba(56,189,248,.2),transparent_30%),linear-gradient(120deg,#071018_0%,#081723_54%,#071018_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#13131A] to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.04fr_.96fr] lg:gap-16">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 sm:mb-4"
          >
            <Badge variant="outline" className="h-6 max-w-full border-cyan-200/18 bg-cyan-200/6 px-2.5 text-[10px] uppercase tracking-[0.12em] text-cyan-100 sm:text-xs sm:tracking-[0.16em]">
              <span className="sm:hidden">Para profissionais criativos no Mac</span>
              <span className="hidden sm:inline">Para designers, editores e videomakers no Mac</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="max-w-[820px] text-[34px] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[72px]"
          >
            Baixe pastas de 10, 50 ou 100 GB do Drive.{" "}
            <span className="text-cyan-200">Sem esperar o ZIP.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-4 max-w-xl text-sm leading-5 text-white/68 sm:mt-5 sm:text-lg sm:leading-7"
          >
            O Iris baixa cada arquivo direto no Mac, preserva a estrutura das pastas e reúne suas contas Google em um único app nativo.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.24 }}
            className="mt-4 grid grid-cols-3 gap-2 text-[10px] leading-4 text-white/58 sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-2 sm:text-sm"
            aria-label="Provas de confiança"
          >
            {proof.map((item) => (
              <li key={item} className="flex items-start gap-1">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-cyan-300 sm:h-4 sm:w-4" />
                {item}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row"
          >
            <Button asChild size="lg" className="group h-13 min-w-0 max-w-full rounded-xl bg-white px-5 text-base font-semibold text-[#081018] shadow-[0_16px_45px_rgba(113,223,255,.2)] hover:-translate-y-0.5 hover:bg-cyan-50 sm:w-auto sm:px-6">
              <a href="/download">
                <Download className="h-5 w-5" />
                <span className="sm:hidden">Baixar grátis</span>
                <span className="hidden sm:inline">Baixar grátis para Mac</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-13 w-full rounded-xl border-white/15 bg-white/6 px-5 text-sm font-medium text-white/80 backdrop-blur hover:border-white/30 hover:bg-white/10 hover:text-white sm:w-auto">
              <a href="#pricing">Ver licença a partir de R$ 49,90</a>
            </Button>
          </motion.div>

          <p className="mt-3 text-center text-xs text-white/42 sm:text-left">
            Teste antes de pagar · sem cartão · macOS 14+
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.22, duration: 0.65 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute -inset-10 bg-cyan-300/12 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/14 bg-[#101824]/90 p-2 shadow-[0_30px_100px_rgba(0,0,0,.55)]">
            <Image
              src="/screenshots/downloads.png"
              alt="Fila de downloads do Iris Downloader preservando pastas do Google Drive"
              width={1200}
              height={750}
              className="w-full rounded-xl"
              priority
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-xl border border-cyan-200/15 bg-[#06121c]/92 p-3 backdrop-blur">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300/12 text-cyan-200">
                <FolderDown className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">Projeto_cliente_2026</p>
                <p className="text-xs text-white/45">Estrutura original preservada</p>
              </div>
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-300" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
