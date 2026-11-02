"use client";

import Link from "next/link";
import { ArrowRight, Download, KeyRound, Menu } from "lucide-react";
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
import BrandWordmark from "./BrandWordmark";
import { IrisMark, btnPrimary, btnSecondary } from "./brand";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Recursos", href: "#features" },
  { label: "Preços", href: "#pricing" },
  { label: "Dúvidas", href: "#faq" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 rounded-2xl bg-brand-surface/70 pl-3 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08] backdrop-blur-xl sm:pl-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Iris Downloader — início">
          <IrisMark size={28} />
          <BrandWordmark className="hidden text-[15px] text-white min-[350px]:inline-flex" />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm text-brand-text-2 transition-colors hover:bg-white/[0.05] hover:text-white lg:px-3"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/minha-licenca" className="hidden rounded-lg px-3 py-2 text-sm text-brand-text-2 transition-colors hover:text-white lg:inline-flex">
            Minha licença
          </Link>
          <Link href="/download" className={cn(btnPrimary, "iris-shine h-10 rounded-xl px-3.5 text-sm shadow-[0_8px_24px_-8px_rgba(107,85,240,0.9)]")}>
            <Download className="h-4 w-4" />
            <span className="hidden min-[390px]:inline">Testar grátis</span>
            <span className="min-[390px]:hidden">Baixar</span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-surface-2 text-white ring-1 ring-inset ring-white/10 md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="dark border-brand-line bg-brand-bg text-white">
              <SheetHeader className="p-6 pb-4">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <IrisMark size={32} />
                  <BrandWordmark className="text-[15px]" />
                </SheetTitle>
                <SheetDescription className="pt-2 text-brand-text-2">
                  Google Drive para Mac, sem ZIP e sem navegador.
                </SheetDescription>
              </SheetHeader>
              <Separator className="bg-white/[0.06]" />
              <div className="grid gap-1 px-3 py-4">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <a
                      href={item.href}
                      className="flex min-h-11 items-center justify-between rounded-lg px-3 text-base text-brand-text-2 transition hover:bg-white/[0.04] hover:text-white"
                    >
                      {item.label}
                      <ArrowRight className="h-4 w-4 text-brand-secondary" />
                    </a>
                  </SheetClose>
                ))}
              </div>
              <div className="mt-auto space-y-3 p-4">
                <Link href="/minha-licenca" className={cn(btnSecondary, "h-11 w-full")}>
                  <KeyRound className="h-4 w-4" /> Minha licença
                </Link>
                <Link href="/download" className={cn(btnPrimary, "h-11 w-full")}>
                  <Download className="h-4 w-4" /> Baixar grátis para Mac
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
