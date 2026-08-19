"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, KeyRound, Menu } from "lucide-react";
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#404040] bg-[#171717]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Iris Downloader — início">
          <Image src="/logo-web.png" alt="" width={32} height={32} className="rounded-md" priority />
          <span className="hidden text-sm font-semibold text-white min-[350px]:inline">Iris Downloader</span>
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase text-neutral-400 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            macOS nativo
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm" className="rounded-md text-neutral-400 hover:bg-[#262626] hover:text-white">
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild size="lg" className="h-9 rounded-md bg-blue-500 px-3.5 font-semibold text-white shadow-none hover:bg-blue-400">
            <Link href="/download">
              <Download data-icon="inline-start" />
              <span className="hidden min-[390px]:inline">Testar grátis</span>
              <span className="min-[390px]:hidden">Baixar</span>
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon-lg" className="h-9 w-9 rounded-md border-[#404040] bg-[#262626] text-white hover:bg-[#303030] hover:text-white md:hidden" aria-label="Abrir menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="dark border-[#404040] bg-[#171717] text-white">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <Image src="/logo-web.png" alt="" width={32} height={32} className="rounded-md" />
                  Iris Downloader
                </SheetTitle>
                <SheetDescription className="pt-2 text-neutral-400">
                  Google Drive para Mac, sem ZIP e sem navegador.
                </SheetDescription>
              </SheetHeader>
              <Separator className="bg-[#404040]" />
              <div className="grid gap-1 px-3 py-4">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a href={item.href} className="flex min-h-11 items-center justify-between rounded-md px-3 text-base text-neutral-300 transition hover:bg-[#262626] hover:text-white">
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-blue-400" />
                    </a>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto space-y-3 p-4">
                <Button asChild variant="outline" className="h-11 w-full rounded-md border-[#404040] bg-[#262626] text-white hover:bg-[#303030] hover:text-white">
                  <Link href="/minha-licenca"><KeyRound /> Minha licença</Link>
                </Button>
                <Button asChild className="h-11 w-full rounded-md bg-blue-500 font-semibold text-white hover:bg-blue-400">
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
