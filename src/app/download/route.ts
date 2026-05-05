import { NextResponse } from "next/server";

// Always redirects to the latest version zip by reading appcast.xml
export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.irisdownloader.com.br";
    const res = await fetch(`${base}/appcast.xml`, { cache: "no-store" });
    const xml = await res.text();
    const match = xml.match(/<sparkle:shortVersionString>([^<]+)<\/sparkle:shortVersionString>/);
    if (match?.[1]) {
      const version = match[1].trim();
      const zip = `${base}/Iris%20Downloader%20${encodeURIComponent(version)}.zip`;
      return NextResponse.redirect(zip, { status: 302 });
    }
  } catch {}
  // Fallback to latest known version
  return NextResponse.redirect(
    "https://www.irisdownloader.com.br/Iris%20Downloader%202.7.3.zip",
    { status: 302 }
  );
}
