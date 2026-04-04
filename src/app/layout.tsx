import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iris Downloader — Baixe pastas do Google Drive sem ZIP no Mac",
  description:
    "Pare de sofrer com ZIP corrompido. O Iris baixa pastas inteiras do Google Drive direto no seu Mac, sem compactar. App nativo para macOS. A partir de R$ 49,90/ano.",
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
    title: "Iris Downloader — Baixe do Google Drive sem ZIP",
    description:
      "Baixe pastas inteiras do Google Drive direto no Mac. Sem compactar, sem travar, sem ZIP corrompido. A partir de R$ 49,90/ano.",
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
    title: "Iris Downloader — Baixe do Google Drive sem ZIP",
    description:
      "Baixe pastas inteiras do Google Drive direto no Mac. Sem ZIP, sem travar. A partir de R$ 49,90/ano.",
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
    <html lang="pt-BR">
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
