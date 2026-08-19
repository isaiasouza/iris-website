"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, KeyRound, Menu } from "lucide-react";
import { ShaderBackground } from "@/components/ui/manu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Recursos", href: "#features" },
  { label: "Preços", href: "#pricing" },
  { label: "Dúvidas", href: "#faq" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="relative mx-auto flex h-16 max-w-6xl items-center justify-between overflow-hidden rounded-2xl border border-white/12 bg-[#071018]/92 px-3 shadow-[0_18px_55px_rgba(0,0,0,.32)] backdrop-blur-xl sm:px-4">
        <ShaderBackground className="iris-shader pointer-events-none absolute inset-0 h-full w-full opacity-65" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,12,20,.88),rgba(5,12,20,.52),rgba(5,12,20,.88))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />

        <Link href="/" className="relative flex min-w-0 items-center gap-2.5" aria-label="Iris Downloader — início">
          <Image src="/logo-web.png" alt="" width={34} height={34} className="rounded-[10px]" priority />
          <span className="hidden text-sm font-semibold text-white min-[360px]:inline sm:text-base">
            Iris Downloader
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/8 px-2 py-1 text-[10px] font-medium text-emerald-200 lg:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            macOS nativo
          </span>
        </Link>

        <div className="relative hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm" className="text-white/58 hover:bg-white/7 hover:text-white">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>

        <div className="relative flex items-center gap-2">
          <Button asChild size="lg" className="h-10 rounded-full bg-white px-4 font-semibold text-[#071018] shadow-[0_8px_30px_rgba(255,255,255,.12)] hover:bg-cyan-50">
            <Link href="/download">
              <Download data-icon="inline-start" />
              <span className="hidden min-[390px]:inline">Testar grátis</span>
              <span className="min-[390px]:hidden">Baixar</span>
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-lg" className="border-white/12 bg-white/5 text-white hover:bg-white/10 hover:text-white md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="dark border-white/10 bg-[#071018] text-white">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <Image src="/logo-web.png" alt="" width={34} height={34} className="rounded-[10px]" />
                  Iris Downloader
                </SheetTitle>
                <SheetDescription className="pt-2 text-white/45">
                  Google Drive para Mac, sem ZIP e sem navegador.
                </SheetDescription>
              </SheetHeader>
              <Separator className="bg-white/8" />
              <div className="grid gap-1 px-3 py-4">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a href={item.href} className="flex min-h-11 items-center justify-between rounded-xl px-3 text-base text-white/72 transition hover:bg-white/6 hover:text-white">
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-cyan-200/60" />
                    </a>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto space-y-3 p-4">
                <Button asChild variant="outline" className="h-11 w-full border-white/12 bg-white/4 text-white hover:bg-white/8 hover:text-white">
                  <Link href="/minha-licenca"><KeyRound /> Minha licença</Link>
                </Button>
                <Button asChild className="h-12 w-full bg-cyan-100 font-semibold text-[#071018] hover:bg-white">
                  <Link href="/download"><Download /> Baixar grátis para Mac</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
