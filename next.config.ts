import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  async redirects() {
    return [
      // Legado — qualquer link antigo do DMG vai para a rota /download
      {
        source: "/IrisDownloader_v2.2.0.dmg",
        destination: "/download",
        permanent: false,
      },
      {
        source: "/IrisDownloader_v:version.dmg",
        destination: "/download",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
