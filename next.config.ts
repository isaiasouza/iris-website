import type { NextConfig } from "next";

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
