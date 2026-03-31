"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SucessoPage() {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="min-h-screen bg-[#13131A] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Ícone */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#4C3CC6] to-[#7E60F8] flex items-center justify-center shadow-lg shadow-[#4C3CC6]/30">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Pagamento confirmado!</h1>
        <p className="text-[#9F9FA3] text-sm leading-relaxed mb-8">
          Sua licença está sendo gerada{dots}<br />
          Você receberá um <strong className="text-white">email com sua chave</strong> em instantes.
        </p>

        {/* Cards de próximos passos */}
        <div className="bg-[#19191E] border border-white/6 rounded-2xl p-5 text-left mb-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#58585F]">Próximos passos</p>

          {[
            { n: "1", text: "Verifique seu email (incluindo spam)" },
            { n: "2", text: "Abra o Iris Downloader no seu Mac" },
            { n: "3", text: "Vá em Configurações → Licença e cole a chave" },
          ].map(s => (
            <div key={s.n} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#4C3CC6]/20 border border-[#7E60F8]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-[#7E60F8]">{s.n}</span>
              </div>
              <span className="text-sm text-[#9F9FA3]">{s.text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/minha-licenca"
            className="w-full bg-gradient-to-r from-[#4C3CC6] to-[#7E60F8] text-white font-semibold py-3 rounded-xl text-sm hover:brightness-110 transition-all text-center block"
          >
            Ver minha licença →
          </Link>
          <Link
            href="/"
            className="text-[#58585F] text-sm hover:text-white transition-colors"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </main>
  );
}
