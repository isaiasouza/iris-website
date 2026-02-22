"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-iris-500 to-iris-700">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">
            Iris Downloader
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Recursos
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            Como funciona
          </a>
          <a
            href="#faq"
            className="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            FAQ
          </a>
          <a
            href="#download"
            className="rounded-full bg-iris-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-iris-500 hover:shadow-lg hover:shadow-iris-600/25"
          >
            Download Grátis
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400"
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
        <div className="border-t border-white/5 bg-[#0a0a0f]/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>Recursos</a>
            <a href="#how-it-works" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#faq" className="text-sm text-zinc-400" onClick={() => setMenuOpen(false)}>FAQ</a>
            <a
              href="#download"
              className="mt-2 rounded-full bg-iris-600 px-5 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Download Grátis
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
