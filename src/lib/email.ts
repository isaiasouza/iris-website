import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}
const FROM = "Iris Downloader <team@irisdownloader.com.br>";

export async function sendLicenseEmail(params: {
  to: string;
  name: string;
  licenseKey: string;
  plan: "annual" | "lifetime";
}) {
  const planLabel = params.plan === "lifetime" ? "Vitalício" : "Anual";
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca`;

  const downloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/IrisDownloader_v2.2.0.dmg`;

  await getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "🔑 Iris Downloader — Sua licença está pronta",
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
        <p style="margin:8px 0 0;color:#9F9FA3;font-size:14px;">Obrigado pela sua compra, <strong style="color:#c4b5fd;">${params.name}</strong></p>
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
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:20px;font-weight:700;color:#c4b5fd;letter-spacing:3px;">${params.licenseKey}</p>
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
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Clique no botão acima, abra o .dmg e arraste para Applications</p>
            </td>
          </tr>
          <tr>
            <td width="32" valign="top" style="padding-bottom:16px;">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(126,96,248,0.2);border:1px solid rgba(126,96,248,0.3);text-align:center;line-height:26px;color:#c4b5fd;font-size:12px;font-weight:700;">2</div>
            </td>
            <td style="padding-bottom:16px;padding-left:12px;vertical-align:top;">
              <p style="margin:0;color:#e4e4e7;font-size:13px;font-weight:600;line-height:26px;">Conecte sua conta Google</p>
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Faça login com a conta do Google Drive que deseja usar</p>
            </td>
          </tr>
          <tr>
            <td width="32" valign="top">
              <div style="width:26px;height:26px;border-radius:50%;background:rgba(126,96,248,0.2);border:1px solid rgba(126,96,248,0.3);text-align:center;line-height:26px;color:#c4b5fd;font-size:12px;font-weight:700;">3</div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0;color:#e4e4e7;font-size:13px;font-weight:600;line-height:26px;">Ative sua licença</p>
              <p style="margin:2px 0 0;color:#9F9FA3;font-size:12px;">Vá em <strong style="color:#c4b5fd;">Configurações → Licença</strong>, cole a chave acima e clique em Ativar</p>
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
  await getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "⚠️ Problema no pagamento — Iris Downloader",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#19191E;border-radius:16px;color:#e4e4e7;">
  <h2 style="color:#fff;">Problema no pagamento</h2>
  <p style="color:#9F9FA3;">Olá ${params.name}, identificamos um problema na cobrança da sua assinatura Iris Downloader.</p>
  <p style="color:#9F9FA3;">Sua licença permanecerá ativa por mais <strong>7 dias</strong>. Atualize sua forma de pagamento para não perder o acesso.</p>
  <a href="${params.portalUrl}" style="display:block;background:#5A3ED4;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:24px;">Atualizar pagamento →</a>
</div>`,
  });
}

export async function sendDeviceRemovedEmail(params: {
  to: string;
  deviceName: string;
}) {
  await getResend().emails.send({
    from: FROM,
    to: params.to,
    subject: "🔒 Dispositivo removido — Iris Downloader",
    html: `
<div style="font-family:sans-serif;max-width:480px;margin:40px auto;padding:32px;background:#19191E;border-radius:16px;color:#e4e4e7;">
  <h2 style="color:#fff;">Dispositivo removido</h2>
  <p style="color:#9F9FA3;">O dispositivo <strong>${params.deviceName}</strong> foi removido da sua licença Iris Downloader.</p>
  <p style="color:#9F9FA3;">Se você não reconhece essa ação, acesse o portal imediatamente.</p>
  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/minha-licenca" style="display:block;background:#5A3ED4;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600;margin-top:24px;">Acessar portal →</a>
</div>`,
  });
}
