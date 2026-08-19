import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
