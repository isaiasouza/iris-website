import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getCoreEnv: () => ({
    CAKTO_WEBHOOK_SECRET: "cakto-test-secret",
    NEXT_PUBLIC_CAKTO_LIFETIME_ID: "lifetime-test-offer",
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

import { POST } from "./route";

function makeRequest(secret?: string): NextRequest {
  return new NextRequest("http://localhost/api/webhook/cakto", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      event: "test_event_ignored",
      ...(secret === undefined ? {} : { secret }),
      data: {
        id: "transaction-test",
        customer: {
          name: "Cliente Teste",
          email: "cliente@example.com",
        },
        amount: 1,
      },
    }),
  });
}

describe("POST /api/webhook/cakto", () => {
  it("autentica o request com segredo válido sem testar emissão de licença", async () => {
    const response = await POST(makeRequest("cakto-test-secret"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("rejeita um segredo inválido", async () => {
    const response = await POST(makeRequest("segredo-incorreto"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejeita um segredo ausente", async () => {
    const response = await POST(makeRequest());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });
});
