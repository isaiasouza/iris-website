"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Hls from "hls.js";

const videoSrc =
  "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

const posterSrc =
  "https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

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
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black text-white">
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Decorative gradients */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-20%",
          left: "20%",
          width: 600,
          height: 600,
          background: "rgba(30,58,138,0.20)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-10%",
          right: "20%",
          width: 500,
          height: 500,
          background: "rgba(49,46,129,0.20)",
          filter: "blur(120px)",
          mixBlendMode: "screen",
          borderRadius: "50%",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 flex flex-col items-center text-center mt-20 space-y-12 pb-24 pt-20">
        {/* Pre-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl lg:text-[48px] leading-[1.1] text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          O Google Drive te obriga a baixar em ZIP.
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-6xl sm:text-8xl lg:text-[136px] leading-[0.9] tracking-tighter font-semibold bg-gradient-to-b from-white via-white to-[#b4c0ff] bg-clip-text text-transparent"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          O Iris não.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl text-lg sm:text-[20px] leading-[1.65] text-white"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          Baixe pastas inteiras, arquivos grandes e várias contas Google — tudo direto
          no Mac, sem compactar, sem travar, sem abrir o navegador.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Primary */}
          <a
            href="#pricing"
            className="group flex items-center pl-6 pr-2 py-2 rounded-full bg-white transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            <span className="text-lg font-medium mr-4" style={{ color: "#0a0400" }}>
              Ver planos — a partir de R$&nbsp;49,90
            </span>
            <span
              className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
              style={{ background: "#3054ff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#2040e0")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "#3054ff")
              }
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </span>
          </a>

          {/* Secondary */}
          <a
            href="https://www.irisdownloader.com.br/IrisDownloader_v2.2.0.dmg"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 backdrop-blur-sm transition-all"
            style={{ fontFamily: "'Instrument Sans', sans-serif" }}
          >
            Baixar grátis para testar
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <p
          className="text-sm mt-2"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Instrument Sans', sans-serif" }}
        >
          macOS 14+ · Apple Silicon + Intel · Sem dependências
        </p>
      </div>
    </section>
  );
}
