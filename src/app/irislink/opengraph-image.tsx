import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Node.js, não Edge: com as duas fontes a função passava do limite de 1 MB do Edge na Vercel.
export const alt = "IRIS Link — Os discos de um Mac, direto no outro. Grátis para Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Identidade Iris: quatro cores e o par Unbounded (títulos) + Inter (texto).
const C = { primaria: "#4C3CC6", secundaria: "#9A85FF", destaque: "#FFFFFF", fundo: "#13131A" };

export default async function OGImage() {
  const [unbounded, inter] = await Promise.all([
    readFile(join(process.cwd(), "src/app/og-fonts/Unbounded-Bold.ttf")),
    readFile(join(process.cwd(), "src/app/og-fonts/Inter-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.fundo,
          fontFamily: "Inter",
          position: "relative",
        }}
      >
        {/* Faixa da marca à esquerda, no degradê Noite, com o ícone */}
        <div
          style={{
            width: 400,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(180deg, #6B55F0 0%, #3A2DA8 55%, #1A1446 100%)",
          }}
        >
          <svg width="200" height="200" viewBox="0 0 100 100">
            <rect width="100" height="100" rx="22.5" fill="#3A2DA8" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            <path d="M37 50h26" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
            <rect x="15" y="31" width="24" height="38" rx="6.5" fill="#fff" />
            <rect x="61" y="31" width="24" height="38" rx="6.5" fill="#fff" />
            <circle cx="27" cy="60" r="2.6" fill="#3A2DA8" />
            <circle cx="73" cy="60" r="2.6" fill="#3A2DA8" />
            <path d="M21 39h12M67 39h12" stroke="#3A2DA8" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M51.5 41.5l-5 9h7l-5 9" fill="none" stroke="#3A2DA8" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M51.5 41.5l-5 9h7l-5 9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Texto */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontFamily: "Unbounded" }}>
            <span style={{ fontSize: 30, color: C.destaque, letterSpacing: "0.02em" }}>IRIS</span>
            <span style={{ fontSize: 18, color: C.secundaria, letterSpacing: "0.18em" }}>LINK</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 36,
              fontFamily: "Unbounded",
              fontSize: 54,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: C.destaque }}>Os discos de</span>
            <span style={{ color: C.destaque }}>um Mac, direto</span>
            <span style={{ color: C.secundaria }}>no outro.</span>
          </div>

          {/* A barra de progresso, motivo da marca */}
          <div style={{ display: "flex", marginTop: 40, height: 10, width: 520, borderRadius: 5, background: "#1E1E23" }}>
            <div style={{ width: "72%", height: 10, borderRadius: 5, background: C.secundaria }} />
          </div>

          <div style={{ display: "flex", marginTop: 22, fontSize: 24, color: "#9F9FA3" }}>
            Grátis · pelo cabo Thunderbolt ou pela rede
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: unbounded, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 500, style: "normal" },
      ],
    }
  );
}
