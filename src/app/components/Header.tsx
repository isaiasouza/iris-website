"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            "linear-gradient(135deg, #13131A 0%, #1a1430 30%, #13131A 60%, #1c1240 85%, #13131A 100%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div className="absolute inset-0 bg-[#13131A]/60" />

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <Image src="/logo-web.png" alt="Iris Downloader" width={36} height={36} className="rounded-xl" priority />
          <span className="text-lg font-bold text-white">Iris Downloader</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            Recursos
          </a>
          <a href="#screenshots" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            Screenshots
          </a>
          <a href="#pricing" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            Preços
          </a>
          <a href="#faq" className="text-sm text-[#9F9FA3] transition-colors hover:text-white">
            FAQ
          </a>
          <a
            href="#pricing"
            className="rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-iris-600/30 hover:brightness-110"
          >
            Começar agora
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#9F9FA3]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="relative border-t border-white/5 bg-[#13131A]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-sm text-[#9F9FA3]" onClick={() => setMenuOpen(false)}>Recursos</a>
            <a href="#screenshots" className="text-sm text-[#9F9FA3]" onClick={() => setMenuOpen(false)}>Screenshots</a>
            <a href="#pricing" className="text-sm text-[#9F9FA3]" onClick={() => setMenuOpen(false)}>Preços</a>
            <a href="#faq" className="text-sm text-[#9F9FA3]" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a
              href="#pricing"
              className="mt-2 rounded-full bg-gradient-to-r from-iris-600 to-iris-500 px-5 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Começar agora
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
