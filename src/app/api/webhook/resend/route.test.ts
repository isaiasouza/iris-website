import { createHmac, randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const SECRET_BYTES = randomBytes(24);
const WEBHOOK_SECRET = `whsec_${SECRET_BYTES.toString("base64")}`;

// Banco em memória: uma linha de email_events por provider_id.
type Row = { id: string; provider_id: string; to_email: string; subject: string; type: string; delivery_status: string | null; created_at: string };
const rows = new Map<string, Row>();
const updates: Array<{ id: string; values: Record<string, unknown> }> = [];

vi.mock("@/lib/env", () => ({
  getCoreEnv: () => ({ RESEND_API_KEY: "re_test_key", ADMIN_EMAIL: "admin@example.com" }),
  getResendWebhookEnv: () => {
    if (!process.env.TEST_WEBHOOK_SECRET) throw new Error("missing");
    return { RESEND_WEBHOOK_SECRET: process.env.TEST_WEBHOOK_SECRET };
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        eq: (_col: string, providerId: string) => ({
          maybeSingle: async () => ({ data: rows.get(providerId) ?? null, error: null }),
        }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: async (_col: string, id: string) => {
          updates.push({ id, values });
          for (const row of rows.values()) if (row.id === id) Object.assign(row, values);
          return { error: null };
        },
      }),
    }),
  },
}));

const alert = vi.fn();
vi.mock("@/lib/email", () => ({ sendDeliveryProblemAlert: (...args: unknown[]) => alert(...args) }));

import { POST } from "./route";

/** Assina como o Resend (Standard Webhooks): v1,base64(HMAC-SHA256(id.timestamp.corpo)). */
function signedRequest(body: object, opts: { tamper?: boolean } = {}): NextRequest {
  const payload = JSON.stringify(body);
  const id = `msg_${randomBytes(6).toString("hex")}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac("sha256", SECRET_BYTES).update(`${id}.${timestamp}.${payload}`).digest("base64");
  return new NextRequest("http://localhost/api/webhook/resend", {
    method: "POST",
    headers: { "content-type": "application/json", "svix-id": id, "svix-timestamp": timestamp, "svix-signature": `v1,${signature}` },
    body: opts.tamper ? payload.replace("bounced", "delivered") : payload,
  });
}

const bounced = {
  type: "email.bounced",
  created_at: "2026-09-25T19:02:25.000Z",
  data: { email_id: "resend-1", to: ["cliente@example.com"], bounce: { type: "Permanent", subType: "General", message: "Conta não existe" } },
};

beforeEach(() => {
  process.env.TEST_WEBHOOK_SECRET = WEBHOOK_SECRET;
  rows.clear();
  updates.length = 0;
  alert.mockReset();
  rows.set("resend-1", {
    id: "row-1",
    provider_id: "resend-1",
    to_email: "cliente@example.com",
    subject: "Sua licença está pronta",
    type: "license_created",
    delivery_status: null,
    created_at: "2026-09-25T19:02:20.000Z",
  });
});

describe("POST /api/webhook/resend", () => {
  it("grava a devolução e avisa o administrador uma única vez", async () => {
    const first = await POST(signedRequest(bounced));
    expect(first.status).toBe(200);
    expect(rows.get("resend-1")?.delivery_status).toBe("bounced");
    expect(rows.get("resend-1")).toMatchObject({ delivery_status: "bounced" });
    expect(updates[0].values.delivery_detail).toBe("Permanent/General: Conta não existe");
    expect(alert).toHaveBeenCalledTimes(1);
    expect(alert.mock.calls[0][0]).toMatchObject({ adminEmail: "admin@example.com", customerEmail: "cliente@example.com", statusLabel: "Devolvido" });

    // O Resend reenvia o mesmo evento: nada muda e não há segundo aviso.
    await POST(signedRequest(bounced));
    expect(alert).toHaveBeenCalledTimes(1);
  });

  it("não deixa uma entrega tardia apagar a devolução", async () => {
    await POST(signedRequest(bounced));
    await POST(signedRequest({ type: "email.delivered", data: { email_id: "resend-1" } }));
    expect(rows.get("resend-1")?.delivery_status).toBe("bounced");
  });

  it("marca como entregue sem avisar", async () => {
    const res = await POST(signedRequest({ type: "email.delivered", data: { email_id: "resend-1" } }));
    expect(res.status).toBe(200);
    expect(rows.get("resend-1")?.delivery_status).toBe("delivered");
    expect(alert).not.toHaveBeenCalled();
  });

  it("rejeita corpo alterado depois da assinatura", async () => {
    const res = await POST(signedRequest(bounced, { tamper: true }));
    expect(res.status).toBe(401);
    expect(updates).toHaveLength(0);
  });

  it("ignora e-mails que o site não registrou", async () => {
    const res = await POST(signedRequest({ ...bounced, data: { ...bounced.data, email_id: "desconhecido" } }));
    expect(res.status).toBe(200);
    expect(updates).toHaveLength(0);
    expect(alert).not.toHaveBeenCalled();
  });

  it("responde 503 enquanto o segredo não estiver configurado", async () => {
    delete process.env.TEST_WEBHOOK_SECRET;
    const res = await POST(signedRequest(bounced));
    expect(res.status).toBe(503);
  });
});
