import type { NextConfig } from "next";
import { register as validateEnvironment } from "./src/instrumentation";

// O Next não executa instrumentation.register() durante `next build`.
// Delegar ao mesmo ponto mantém uma única rotina explícita de validação.
validateEnvironment();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
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
