import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Iris Downloader — Baixe do Google Drive sem ZIP no Mac";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0E14",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          position: "relative",
        }}
      >
        {/* Background glow top */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,96,248,0.22) 0%, transparent 65%)",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
          }}
        />

        {/* Content row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 64,
            padding: "0 96px",
            position: "relative",
          }}
        >
          {/* App icon */}
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 36,
              background: "linear-gradient(145deg, #5b3fdf, #7E60F8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 80px rgba(126,96,248,0.5), 0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <svg width="88" height="88" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M7 12l5 5 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Text block */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  background: "rgba(126,96,248,0.18)",
                  border: "1px solid rgba(126,96,248,0.35)",
                  borderRadius: 30,
                  padding: "5px 16px",
                  display: "flex",
                }}
              >
                <span style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600, letterSpacing: "0.04em" }}>
                  macOS 14+ · App nativo
                </span>
              </div>
            </div>

            {/* Main headline */}
            <h1
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-1.5px",
              }}
            >
              Iris Downloader
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontSize: 24,
                color: "#9F9FA3",
                margin: 0,
                lineHeight: 1.35,
                maxWidth: 500,
              }}
            >
              Baixe pastas do Google Drive sem ZIP. Direto no Mac.
            </p>

            {/* Price strip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 6,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12,
                padding: "10px 20px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: 15, color: "#9F9FA3" }}>A partir de</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#c4b5fd" }}>
                R$ 49,90/ano
              </span>
              <span style={{ fontSize: 13, color: "#58585F" }}>· 7 dias de garantia</span>
            </div>
          </div>
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 52,
            fontSize: 13,
            color: "#3a3a45",
            display: "flex",
          }}
        >
          irisdownloader.com.br
        </div>
      </div>
    ),
    { ...size }
  );
}
