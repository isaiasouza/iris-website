import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Iris Downloader — Google Drive para Mac, do jeito certo";
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
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0E14",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(126,96,248,0.18) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 56,
            padding: "0 80px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: 40,
              background: "linear-gradient(135deg, #4C3CC6, #7E60F8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 60px rgba(126,96,248,0.4)",
            }}
          >
            {/* Arrow down icon */}
            <svg width="96" height="96" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13.41V8h2v7.41l2.29-2.3 1.41 1.41L12 20l-4.71-4.48 1.42-1.41L11 15.41z"/>
            </svg>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#c4b5fd",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Novo
              </span>
              <div
                style={{
                  background: "rgba(126,96,248,0.2)",
                  border: "1px solid rgba(126,96,248,0.4)",
                  borderRadius: 30,
                  padding: "4px 14px",
                  display: "flex",
                }}
              >
                <span style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}>
                  macOS 14+
                </span>
              </div>
            </div>

            <h1
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              Iris Downloader
            </h1>

            <p
              style={{
                fontSize: 22,
                color: "#9F9FA3",
                margin: 0,
                lineHeight: 1.4,
                maxWidth: 520,
              }}
            >
              Google Drive para Mac, do jeito certo.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 16, color: "#58585F" }}>
                A partir de
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#c4b5fd",
                }}
              >
                R$ 49,90/ano
              </span>
            </div>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 48,
            fontSize: 14,
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
