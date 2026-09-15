import type { NextConfig } from "next";
import { register as validateEnvironment } from "./src/instrumentation";

// O Next não executa instrumentation.register() durante `next build`.
// Delegar ao mesmo ponto mantém uma única rotina explícita de validação.
validateEnvironment();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  // Cabeçalhos verificados pelo scan DAST da avaliação CASA (base OWASP ASVS).
  // CSP não entra aqui de propósito: exige testar cada página para não quebrar
  // estilos e scripts, e é trabalho à parte — veja VERIFICACAO-GOOGLE.md.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Impede o navegador de adivinhar o tipo do conteúdo (XSS por MIME).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // O site não é embutido em lugar nenhum; bloquear clickjacking,
          // especialmente sobre o /admin.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Recursos que o site não usa ficam desligados explicitamente.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legado — versão específica antiga redireciona para /download
      {
        source: "/IrisDownloader_v2.2.0.dmg",
        destination: "/download",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
