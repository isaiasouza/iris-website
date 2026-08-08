import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;
  const { id } = await params;
  const { data: license, error } = await supabaseAdmin
    .from("licenses").select("id,license_key,name,email,plan").eq("id", id).maybeSingle();

  if (error) return NextResponse.json({ error: "Não foi possível consultar a licença." }, { status: 500 });
  if (!license) return NextResponse.json({ error: "Licença não encontrada." }, { status: 404 });
  if (license.plan !== "annual" && license.plan !== "lifetime") {
    return NextResponse.json({ error: "Plano da licença inválido." }, { status: 409 });
  }

  try {
    await sendLicenseEmail({
      to: license.email,
      name: license.name || "Cliente",
      licenseKey: license.license_key,
      plan: license.plan,
    });
  } catch (emailError) {
    console.error("Failed to resend license email", emailError instanceof Error ? emailError.message : "unknown");
    return NextResponse.json({ error: "A licença existe, mas o e-mail não pôde ser enviado." }, { status: 502 });
  }

  await supabaseAdmin.from("license_events").insert({
    license_id: license.id,
    event: "license_email_resent",
    metadata: { by: "admin" },
  });
  return NextResponse.json({ ok: true });
}
