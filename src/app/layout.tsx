import type { Metadata } from "next";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

// Par tipográfico da marca fora do app: Unbounded nos títulos, Inter no texto (OFL).
const display = Unbounded({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-unbounded", display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Iris Downloader — Baixe pastas grandes do Drive sem ZIP",
  description:
    "Baixe pastas de 10, 50 ou 100 GB do Google Drive direto no Mac. Sem esperar o ZIP, sem perder a estrutura e com múltiplas contas. Teste grátis.",
  keywords: [
    "Google Drive download Mac",
    "baixar pasta Google Drive sem ZIP",
    "app Google Drive macOS",
    "download Google Drive Apple Silicon",
    "gerenciador Google Drive Mac",
    "Iris Downloader",
    "baixar do Drive sem compactar",
    "múltiplas contas Google Drive Mac",
  ],
  metadataBase: new URL("https://www.irisdownloader.com.br"),
  alternates: {
    canonical: "https://www.irisdownloader.com.br",
  },
  openGraph: {
    title: "Baixe pastas grandes do Google Drive sem esperar o ZIP",
    description:
      "App nativo para designers, editores e videomakers baixarem pastas grandes do Drive direto no Mac. Teste grátis.",
    type: "website",
    url: "https://www.irisdownloader.com.br",
    siteName: "Iris Downloader",
    locale: "pt_BR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Iris Downloader — Baixe do Google Drive sem ZIP no Mac",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baixe pastas grandes do Google Drive sem esperar o ZIP",
    description:
      "App nativo para baixar pastas grandes do Drive direto no Mac. Sem ZIP e com múltiplas contas.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${display.variable} ${body.variable}`}>
      <head>
        <link rel="icon" href="/iris-icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:ital,wght@0,500;0,600;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
