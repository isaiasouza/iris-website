import { NextResponse } from "next/server";

// Redirects to the latest download URL by reading the enclosure URL from appcast.xml
export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.irisdownloader.com.br";
    const res = await fetch(`${base}/appcast.xml`, { cache: "no-store" });
    const xml = await res.text();
    const match = xml.match(/url="([^"]+)"/);
    if (match?.[1]) {
      return NextResponse.redirect(match[1], { status: 302 });
    }
  } catch {}
  // Fallback to latest known version
  return NextResponse.redirect(
    "https://www.irisdownloader.com.br/IrisDownloader_v3.0.5.dmg",
    { status: 302 }
  );
}
