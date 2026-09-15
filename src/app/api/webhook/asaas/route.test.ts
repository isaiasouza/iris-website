import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getAsaasEnv: () => ({
    ASAAS_API_KEY: "asaas-test-key",
    ASAAS_ENV: "sandbox",
    ASAAS_WEBHOOK_TOKEN: "asaas-test-token",
  }),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {},
  generateLicenseKey: vi.fn(() => "IRIS-TEST-TEST-TEST-TEST"),
}));

vi.mock("@/lib/email", () => ({
  sendLicenseEmail: vi.fn(),
  sendPaymentFailedEmail: vi.fn(),
}));

vi.mock("@/lib/asaas", () => ({
  cancelSubscription: vi.fn(),
  getCustomer: vi.fn(),
}));

import { POST } from "./route";

function makeRequest(token?: string): NextRequest {
  return new NextRequest("http://localhost/api/webhook/asaas", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token === undefined ? {} : { "asaas-webhook-token": token }),
    },
    body: JSON.stringify({ event: "TEST_EVENT_IGNORED" }),
  });
}

// O webhook cria licença a partir de evento de pagamento. Aceitar uma
// requisição não autenticada aqui significa emitir licença de graça.
describe("POST /api/webhook/asaas", () => {
  it("rejeita requisição sem o token", async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(401);
  });

  it("rejeita token errado", async () => {
    const res = await POST(makeRequest("token-errado"));
    expect(res.status).toBe(401);
  });

  // Um prefixo correto não pode passar: é o que a comparação em tempo
  // constante protege.
  it("rejeita token que é prefixo do correto", async () => {
    const res = await POST(makeRequest("asaas-test"));
    expect(res.status).toBe(401);
  });

  it("aceita o token correto", async () => {
    const res = await POST(makeRequest("asaas-test-token"));
    expect(res.status).not.toBe(401);
  });
});
