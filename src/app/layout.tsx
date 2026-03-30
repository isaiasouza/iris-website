import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris Downloader — Google Drive para Mac, do jeito certo",
  description:
    "Baixe e gerencie seus arquivos do Google Drive no Mac com velocidade total. Pausar, retomar, múltiplas contas. Planos a partir de R$ 49,90/ano.",
  keywords: [
    "Google Drive",
    "download",
    "upload",
    "macOS",
    "app",
    "comprar",
    "plano",
    "vitalício",
    "licença",
    "Apple Silicon",
    "Intel",
    "sem ZIP",
  ],
  openGraph: {
    title: "Iris Downloader — Google Drive para Mac, do jeito certo",
    description:
      "Baixe pastas do Google Drive sem compactar. App nativo para macOS. Planos a partir de R$ 49,90/ano.",
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
