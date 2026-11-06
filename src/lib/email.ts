import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
const FROM = "Iris Downloader <team@irisdownloader.com.br>";

type EmailType = "license_created" | "payment_failed" | "license_recovery" | "device_removed";

interface SendTrackedEmailParams {
  to: string;
  subject: string;
  html: string;
  type: EmailType;
  metadata?: Record<string, unknown>;
}

async function logEmailEvent(params: {
  to: string;
  subject: string;
  type: EmailType;
  status: "sent" | "failed";
  providerId?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    await supabaseAdmin.from("email_events").insert({
      to_email: params.to.toLowerCase(),
      subject: params.subject,
      type: params.type,
      status: params.status,
      provider: "resend",
      provider_id: params.providerId ?? null,
      error_message: params.errorMessage ?? null,
      metadata: params.metadata ?? {},
    });
  } catch (error) {
    console.error("[email_events]", error);
  }
}

// A versão 6 do SDK do Resend não lança exceção quando a API recusa o envio:
// devolve { error }. Antes só exceções contavam como falha, e envios recusados
// ficavam registrados como "sent", sem id para o webhook de entrega achar.
const SEND_ATTEMPTS = 2;

type ResendFailure = { message?: string; statusCode?: number | null; name?: string };

/** Erros de validação (endereço inválido, domínio, chave) não melhoram tentando de novo. */
export function isRetryableResendError(error: ResendFailure | null | undefined) {
  const status = error?.statusCode ?? null;
  if (status === null) return true;
  return status === 429 || status >= 500;
}

async function sendTrackedEmail(params: SendTrackedEmailParams) {
  let lastError = "Falha desconhecida no envio";

  for (let attempt = 1; attempt <= SEND_ATTEMPTS; attempt++) {
    let retryable = true;
    try {
      const { data, error } = await getResend().emails.send({
        from: FROM,
        to: params.to,
        subject: params.subject,
        html: params.html,
      });
      if (!error && data?.id) {
        await logEmailEvent({
          to: params.to,
          subject: params.subject,
          type: params.type,
          status: "sent",
          providerId: data.id,
          metadata: params.metadata,
        });
        return data;
      }
      lastError = error?.message ?? "O Resend não devolveu o id do envio";
      retryable = isRetryableResendError(error);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    if (!retryable) break;
    if (attempt < SEND_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await logEmailEvent({
    to: params.to,
    subject: params.subject,
    type: params.type,
    status: "failed",
    errorMessage: lastError,
    metadata: params.metadata,
  });
  await alertAdminAboutFailedSend(params, lastError);
  throw new Error(lastError);
}

/** Avisa o administrador na hora em que um envio falha, sem derrubar quem chamou. */
async function alertAdminAboutFailedSend(params: SendTrackedEmailParams, reason: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) return;
  try {
    await sendDeliveryProblemAlert({
      adminEmail,
      customerEmail: params.to,
      subject: params.subject,
      type: params.type,
      statusLabel: "Falhou no envio",
      detail: reason,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[email] admin alert failed", error instanceof Error ? error.message : "unknown");
  }
}

// Dados vindos do comprador (nome, chave, dispositivo) entram no HTML do
// e-mail. Sem escapar, um nome com marcação injeta conteúdo na mensagem.
// Esta proteção veio do lado local e é reaplicada sobre a versão do remoto,
// que traz o registro de entrega mas não escapava nada.
function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  };
  return value.replace(/[&<>'"]/g, (character) => entities[character]);
}

export async function sendLicenseEmail(params: {
  to: string;
  name: string;
  licenseKey: string;
  plan: "annual" | "lifetime";
}) {
  const planLabel = params.plan === "lifetime" ? "Vitalício" : "Anual";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`;

  // /download redireciona sempre para o DMG da versão mais recente.
  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/download`;

  const subject = "🔑 Iris Downloader — Sua licença está pronta";
  await sendTrackedEmail({
    to: params.to,
    subject,
    type: "license_created",
    // A chave não vai para o registro de e-mails: ela já está na licença.
    metadata: { plan: params.plan },
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sua licença Iris Downloader</title>
</head>
<body style="margin:0;padding:0;background:#0E0E14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0E0E14;padding:40px 16px;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

      <!-- HEADER -->
      <tr><td style="background:linear-gradient(135deg,#1E1440 0%,#13131A 100%);border-radius:16px 16px 0 0;padding:36px 32px;text-align:center;border:1px solid rgba(126,96,248,0.2);border-bottom:none;">
        <img src="https://www.irisdownloader.com.br/logo-email.png" width="72" height="72" alt="Iris Downloader" style="border-radius:16px;display:block;margin:0 auto 16px;" />
        <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Seu acesso está pronto! 🎉</h1>
        <p style="margin:8px 0 0;color:#9F9FA3;font-size:14px;">Obrigado pela sua compra, <strong style="color:#c4b5fd;">${escapeHtml(params.name)}</strong></p>
      </td></tr>

      <!-- PLAN BADGE -->
      <tr><td style="background:#19191E;padding:24px 32px 0;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);text-align:center;">
        <span style="display:inline-block;background:rgba(126,96,248,0.15);border:1px solid rgba(126,96,248,0.35);border-radius:30px;padding:6px 18px;color:#c4b5fd;font-size:13px;font-weight:600;">
          Plano ${planLabel}
        </span>
      </td></tr>

      <!-- LICENSE KEY -->
      <tr><td style="background:#19191E;padding:20px 32px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#13131A;border:1px solid rgba(126,96,248,0.3);border-radius:12px;">
          <tr><td style="padding:20px;text-align:center;">
            <p style="margin:0 0 8px;color:#9F9FA3;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Sua chave de licença</p>
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#c4b5fd;letter-spacing:3px;">${escapeHtml(params.licenseKey)}</p>
            <p style="margin:12px 0 0;color:#58585F;font-size:11px;">Guarde esta chave — você precisará dela para ativar o app</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- DOWNLOAD BUTTON -->
      <tr><td style="background:#19191E;padding:8px 32px 0;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);text-align:center;">
        <a href="${downloadUrl}" style="display:inline-block;background:linear-gradient(135deg,#4C3CC6,#7E60F8);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:10px;">
          ⬇ Baixar Iris Downloader para Mac
        </a>
        <p style="margin:8px 0 0;color:#58585F;font-size:11px;">Compatível com macOS 14+ · Apple Silicon &amp; Intel</p>
      </td></tr>

      <!-- DIVIDER -->
      <tr><td style="background:#19191E;padding:24px 32px 0;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:0;" />
      </td></tr>

      <!-- STEPS -->
      <tr><td style="background:#19191E;padding:24px 32px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);">
        <p style="margin:0 0 16px;color:#ffffff;font-size:14px;font-weight:700;">Como ativar sua licença</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="32" valign="top" style="padding-bottom:16px;">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(126,96,248,0.2);border:1px solid rgba(126,96,248,0.3);text-align:center;line-height:26px;color:#c4b5fd;font-size:12px;font-weight:700;">1</div>
            </td>
            <td style="padding-bottom:16px;padding-left:12px;vertical-align:top;">
              <p style="margin:0;color:#e4e4e7;font-size:13px;font-weight:600;line-height:26px;">Baixe e instale o app</p>
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Clique no botão acima, abra o .dmg e arraste o Iris para Aplicativos</p>
            </td>
          </tr>
          <tr>
            <td width="32" valign="top" style="padding-bottom:16px;">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(126,96,248,0.2);border:1px solid rgba(126,96,248,0.3);text-align:center;line-height:26px;color:#c4b5fd;font-size:12px;font-weight:700;">2</div>
            </td>
            <td style="padding-bottom:16px;padding-left:12px;vertical-align:top;">
              <p style="margin:0;color:#e4e4e7;font-size:13px;font-weight:600;line-height:26px;">Abra o Iris e ative</p>
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Na primeira abertura o app pede a chave: cole a chave acima e clique em Ativar</p>
            </td>
          </tr>
          <tr>
            <td width="32" valign="top">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(126,96,248,0.2);border:1px solid rgba(126,96,248,0.3);text-align:center;line-height:26px;color:#c4b5fd;font-size:12px;font-weight:700;">3</div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0;color:#e4e4e7;font-size:13px;font-weight:600;line-height:26px;">Comece a baixar</p>
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Cole um link do Drive, Dropbox, OneDrive ou YouTube, ou entre com sua conta Google para baixar pastas inteiras</p>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- PORTAL BUTTON -->
      <tr><td style="background:#19191E;padding:0 32px 28px;border-left:1px solid rgba(255,255,255,0.05);border-right:1px solid rgba(255,255,255,0.05);text-align:center;">
        <a href="${portalUrl}" style="display:inline-block;background:rgba(126,96,248,0.12);border:1px solid rgba(126,96,248,0.3);color:#c4b5fd;text-decoration:none;font-size:13px;font-weight:600;padding:11px 24px;border-radius:8px;">
          Gerenciar minha licença →
        </a>
      </td></tr>

      <!-- FOOTER -->
      <tr><td style="background:#13131A;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border:1px solid rgba(255,255,255,0.05);border-top:none;">
        <p style="margin:0;color:#58585F;font-size:11px;line-height:1.6;">
          Iris Downloader · <a href="https://www.irisdownloader.com.br" style="color:#7E60F8;text-decoration:none;">irisdownloader.com.br</a><br>
          Em caso de dúvidas, responda este email.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`,
  });
}

export async function sendPaymentFailedEmail(params: {
  to: string;
  name: string;
  portalUrl: string;
}) {
  await sendTrackedEmail({
    to: params.to,
    subject: "⚠️ Problema no pagamento — Iris Downloader",
    type: "payment_failed",
    metadata: { portal_url: params.portalUrl },
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#19191E;border-radius:16px;color:#e4e4e7;">
  <h2 style="color:#fff;">Problema no pagamento</h2>
  <p style="color:#9F9FA3;">Olá ${escapeHtml(params.name)}, identificamos um problema na cobrança da sua assinatura Iris Downloader.</p>
  <p style="color:#9F9FA3;">A renovação anual não foi cobrada. Sua licença continua valendo até o vencimento; atualize o cartão para não perder o acesso depois dele.</p>
  <a href="${escapeHtml(params.portalUrl)}" style="display:block;background:#5A3ED4;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:24px;">Atualizar pagamento →</a>
</div>`,
  });
}

export async function sendLicenseRecoveryEmail(params: {
  to: string;
  name: string;
  licenses: Array<{
    licenseKey: string;
    plan: "annual" | "lifetime";
    status: string;
    expiresAt: string | null;
    devicesUsed: number;
    devicesMax: number;
  }>;
}) {
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`;
  const rows = params.licenses.map((license) => {
    const planLabel = license.plan === "lifetime" ? "Vitalício" : "Anual";
    const expires = license.expiresAt
      ? new Date(license.expiresAt).toLocaleDateString("pt-BR")
      : "Sem expiração";

    return `
      <tr>
        <td style="padding:16px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 8px;color:#c4b5fd;font-family:'Courier New',Courier,monospace;font-size:16px;font-weight:700;letter-spacing:2px;">${escapeHtml(license.licenseKey)}</p>
          <p style="margin:0;color:#9F9FA3;font-size:12px;">Plano ${planLabel} · ${license.status} · ${license.devicesUsed}/${license.devicesMax} dispositivos · ${expires}</p>
        </td>
      </tr>`;
  }).join("");

  await sendTrackedEmail({
    to: params.to,
    subject: "Iris Downloader — suas licenças",
    type: "license_recovery",
    metadata: { licenses_count: params.licenses.length },
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:560px;margin:40px auto;padding:0;background:#19191E;border-radius:16px;color:#e4e4e7;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">
  <div style="padding:32px;text-align:center;background:linear-gradient(135deg,#1E1440 0%,#13131A 100%);">
    <img src="https://www.irisdownloader.com.br/logo-email.png" width="64" height="64" alt="Iris Downloader" style="border-radius:14px;margin-bottom:14px;" />
    <h1 style="margin:0;color:#fff;font-size:22px;">Suas licenças Iris Downloader</h1>
    <p style="margin:8px 0 0;color:#9F9FA3;font-size:14px;">Olá ${escapeHtml(params.name)}, encontramos as licenças vinculadas a este email.</p>
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#19191E;">
    ${rows}
  </table>
  <div style="padding:28px 32px;text-align:center;">
    <a href="${portalUrl}" style="display:inline-block;background:#5A3ED4;color:#fff;text-align:center;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:700;">Gerenciar dispositivos</a>
    <p style="margin:16px 0 0;color:#58585F;font-size:12px;line-height:1.5;">Cole a chave no portal para ver seus dispositivos ativos e liberar uma ativação quando trocar de Mac.</p>
  </div>
</div>`,
  });
}

export async function sendDeviceRemovedEmail(params: {
  to: string;
  deviceName: string;
}) {
  await sendTrackedEmail({
    to: params.to,
    subject: "🔒 Dispositivo removido — Iris Downloader",
    type: "device_removed",
    metadata: { device_name: params.deviceName },
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#19191E;border-radius:16px;color:#e4e4e7;">
  <h2 style="color:#fff;">Dispositivo removido</h2>
  <p style="color:#9F9FA3;">O dispositivo <strong>${escapeHtml(params.deviceName)}</strong> foi removido da sua licença Iris Downloader.</p>
  <p style="color:#9F9FA3;">Se você não reconhece essa ação, acesse o portal imediatamente.</p>
  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca" style="display:block;background:#5A3ED4;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:24px;">Acessar portal →</a>
</div>`,
  });
}

/**
 * Aviso para o administrador quando um e-mail de cliente não chega
 * (devolvido, marcado como spam, falhou ou suprimido). Não entra em
 * email_events, para o próprio aviso não gerar outro aviso.
 */
export async function sendDeliveryProblemAlert(params: {
  adminEmail: string;
  customerEmail: string;
  subject: string;
  type: string;
  statusLabel: string;
  detail: string | null;
  sentAt: string;
}) {
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/emails?q=${encodeURIComponent(params.customerEmail)}`;
  const sentAt = new Date(params.sentAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const row = (label: string, value: string) =>
    `<tr><td style="padding:8px 0;color:#9F9FA3;font-size:13px;width:130px;vertical-align:top;">${label}</td><td style="padding:8px 0;color:#fff;font-size:13px;">${value}</td></tr>`;

  const { error } = await getResend().emails.send({
    from: FROM,
    to: params.adminEmail,
    subject: `⚠️ E-mail não entregue: ${params.statusLabel.toLowerCase()} para ${params.customerEmail}`,
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:32px auto;padding:28px;background:#19191E;border-radius:14px;">
  <p style="margin:0;color:#9A85FF;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;">Entrega de e-mail</p>
  <h2 style="margin:8px 0 4px;color:#fff;font-size:20px;">Um cliente não recebeu um e-mail</h2>
  <p style="margin:0 0 16px;color:#9F9FA3;font-size:14px;line-height:1.5;">Confirme o endereço com o cliente, corrija na licença e reenvie pelo painel.</p>
  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("Status", escapeHtml(params.statusLabel))}
    ${row("Para", escapeHtml(params.customerEmail))}
    ${row("Assunto", escapeHtml(params.subject))}
    ${row("Tipo", escapeHtml(params.type))}
    ${row("Enviado em", escapeHtml(sentAt))}
    ${params.detail ? row("Motivo", escapeHtml(params.detail)) : ""}
  </table>
  <a href="${adminUrl}" style="display:inline-block;margin-top:20px;background:#4C3CC6;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Abrir no painel</a>
</div>`,
  });
  if (error) throw new Error(error.message);
}

/** Aviso genérico para o administrador (ex.: pagamento que não virou licença). Não entra em email_events. */
export async function sendAdminNotice(params: { subject: string; title: string; lines: Array<[string, string]> }) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) return;
  const rows = params.lines
    .map(([label, value]) =>
      `<tr><td style="padding:8px 0;color:#9F9FA3;font-size:13px;width:130px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#fff;font-size:13px;">${escapeHtml(value)}</td></tr>`)
    .join("");
  const { error } = await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: params.subject,
    html: `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:32px auto;padding:28px;background:#19191E;border-radius:14px;">
  <h2 style="margin:0 0 16px;color:#fff;font-size:20px;">${escapeHtml(params.title)}</h2>
  <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
</div>`,
  });
  if (error) throw new Error(error.message);
}
