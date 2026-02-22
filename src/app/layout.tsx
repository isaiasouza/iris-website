import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris Downloader — Baixe do Google Drive sem compactar",
  description:
    "Baixe pastas e arquivos do Google Drive diretamente para o seu Mac, sem precisar compactar. Upload fácil com drag-and-drop. Grátis e open source.",
  keywords: [
    "Google Drive",
    "download",
    "upload",
    "macOS",
    "app",
    "grátis",
    "rclone",
  ],
  openGraph: {
    title: "Iris Downloader",
    description:
      "Baixe pastas do Google Drive sem compactar. App nativo para macOS.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
