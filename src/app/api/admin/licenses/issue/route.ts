import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin, generateIdempotentLicenseKey } from "@/lib/supabase";
import { sendLicenseEmail } from "@/lib/email";

type IssueBody = {
  name?: unknown;
  email?: unknown;
  plan?: unknown;
  expires_at?: unknown;
  max_devices?: unknown;
  send_email?: unknown;
  internal_note?: unknown;
};

type ValidIssue = {
  name: string;
  email: string;
  plan: "annual" | "lifetime";
  expiresAt: string | null;
  maxDevices: number;
  sendEmail: boolean;
  internalNote: string | null;
};

function validateIssue(body: IssueBody): { value?: ValidIssue; error?: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const plan = body.plan;
  const note = typeof body.internal_note === "string" ? body.internal_note.trim() : "";

  if (name.length < 2 || name.length > 120) return { error: "Informe um nome entre 2 e 120 caracteres." };
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Informe um e-mail válido." };
  if (plan !== "annual" && plan !== "lifetime") return { error: "Selecione um plano válido." };
  if (!Number.isInteger(body.max_devices) || Number(body.max_devices) < 1 || Number(body.max_devices) > 10) {
    return { error: "O limite de dispositivos deve ser um número inteiro entre 1 e 10." };
  }
  if (typeof body.send_email !== "boolean") return { error: "A opção de envio de e-mail é inválida." };
  if (note.length > 1000) return { error: "A nota interna deve ter no máximo 1.000 caracteres." };

  let expiresAt: string | null = null;
  if (plan === "annual") {
    if (typeof body.expires_at === "string" && body.expires_at) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.expires_at)) return { error: "Informe uma data de validade válida." };
      const parsed = new Date(`${body.expires_at}T23:59:59.999Z`);
      if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) return { error: "A validade deve ser uma data futura." };
      expiresAt = parsed.toISOString();
    } else {
      const oneYear = new Date();
      oneYear.setUTCFullYear(oneYear.getUTCFullYear() + 1);
      expiresAt = oneYear.toISOString();
    }
  }

  return { value: {
    name,
    email,
    plan,
    expiresAt,
    maxDevices: Number(body.max_devices),
    sendEmail: body.send_email,
    internalNote: note || null,
  } };
}

export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  const requestId = req.headers.get("Idempotency-Key")?.trim() ?? "";
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(requestId)) {
    return NextResponse.json({ error: "Identificador da emissão ausente ou inválido." }, { status: 400 });
  }

  let rawBody: IssueBody;
  try { rawBody = await req.json(); }
  catch { return NextResponse.json({ error: "Conteúdo da solicitação inválido." }, { status: 400 }); }

  const validation = validateIssue(rawBody);
  if (!validation.value) return NextResponse.json({ error: validation.error }, { status: 400 });
  const body = validation.value;
  const licenseKey = generateIdempotentLicenseKey(requestId);

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("licenses").select("id,license_key").eq("license_key", licenseKey).maybeSingle();
  if (lookupError) {
    console.error("Failed to check idempotent license", lookupError.code);
    return NextResponse.json({ error: "Não foi possível verificar a emissão. Tente novamente." }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json({ ok: true, reused: true, license: existing, email_status: "unchanged" });
  }

  const { data, error } = await supabaseAdmin.from("licenses").insert({
    license_key: licenseKey,
    plan: body.plan,
    status: "active",
    email: body.email,
    name: body.name,
    max_devices: body.maxDevices,
    expires_at: body.expiresAt,
    internal_note: body.internalNote,
    cakto_transaction_id: null,
  }).select("id,license_key").single();

  if (error || !data) {
    if (error?.code === "23505") {
      const { data: raced } = await supabaseAdmin
        .from("licenses").select("id,license_key").eq("license_key", licenseKey).maybeSingle();
      if (raced) return NextResponse.json({ ok: true, reused: true, license: raced, email_status: "unchanged" });
    }
    console.error("Failed to issue license", error?.code);
    return NextResponse.json({ error: "Não foi possível criar a licença. Tente novamente." }, { status: 500 });
  }

  const { error: eventError } = await supabaseAdmin.from("license_events").insert({
    license_id: data.id,
    event: "issued_manually",
    metadata: { by: "admin", send_email: body.sendEmail, request_id: requestId },
  });
  if (eventError) console.error("Failed to record issuance event", eventError.code);

  let emailStatus: "sent" | "failed" | "not_requested" = "not_requested";
  if (body.sendEmail) {
    try {
      await sendLicenseEmail({ to: body.email, name: body.name, licenseKey, plan: body.plan });
      emailStatus = "sent";
    } catch (emailError) {
      emailStatus = "failed";
      console.error("License created but email failed", emailError instanceof Error ? emailError.message : "unknown");
    }
  }

  return NextResponse.json({
    ok: true,
    license: data,
    email_status: emailStatus,
    audit_status: eventError ? "failed" : "recorded",
  }, { status: 201 });
}
