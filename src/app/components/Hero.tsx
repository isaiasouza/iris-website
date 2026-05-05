"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Hls from "hls.js";

const videoSrc =
  "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch(() => {});
      });
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background video — sem poster para não mostrar imagem estranha */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Gradiente inferior para transição suave com a próxima seção */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#13131A] to-transparent pointer-events-none z-20" />

      {/* Glow decorativo topo */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 500,
          background: "radial-gradient(ellipse, rgba(90,62,212,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 flex flex-col items-center text-center pt-36 pb-16">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-iris-400" style={{ background: "#8B6EF8" }} />
          <span className="text-sm font-medium text-white/70" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
            v2.7.3 · Download de vídeos do Drive
          </span>
        </motion.div>

        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-[36px] leading-[1.2] text-white/60 mb-4"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          O Google Drive te obriga a baixar em ZIP.
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-[72px] sm:text-[100px] lg:text-[128px] leading-[0.9] tracking-tighter font-semibold bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent mb-8"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          O Iris não.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-lg text-lg sm:text-xl leading-[1.65] text-white/55 mb-10"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Baixe pastas inteiras, arquivos grandes e múltiplas contas Google —
          direto no Mac, sem ZIP, sem travar, sem abrir o navegador.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-5"
        >
          {/* Primário */}
          <a
            href="#pricing"
            className="group flex items-center gap-0 pl-6 pr-2 py-2 rounded-full bg-white transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,110,248,0.4)] hover:scale-[1.02]"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            <span className="text-base font-semibold mr-4" style={{ color: "#0a0010" }}>
              Ver planos — a partir de R$&nbsp;49,90
            </span>
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5A3ED4] group-hover:bg-[#4430B0] transition-colors">
              <ArrowRight className="w-4 h-4 text-white" />
            </span>
          </a>

          {/* Secundário */}
          <a
            href="/download"
            className="group flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200"
            style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: "0.95rem" }}
          >
            <Download className="w-4 h-4" />
            Baixar grátis
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* Meta info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs text-white/25 mb-16"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          macOS 14+ · Apple Silicon + Intel · Sem dependências
        </motion.p>

        {/* Screenshot do app */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          {/* Glow atrás da imagem */}
          <div
            className="absolute -inset-4 rounded-2xl pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(90,62,212,0.3) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
          />
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
            <Image
              src="/screenshots/downloads.png"
              alt="Iris Downloader — downloads direto do Google Drive no Mac"
              width={1200}
              height={750}
              className="w-full object-cover object-top"
              priority
            />
            {/* Fade inferior */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
