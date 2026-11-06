import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const inserted: Array<Record<string, unknown>> = [];

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: async (row: Record<string, unknown>) => {
        inserted.push(row);
        return { error: null };
      },
    }),
  },
}));

process.env.RESEND_API_KEY = "re_test";
process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
process.env.ADMIN_EMAIL = "admin@example.test";

const { sendLicenseEmail, isRetryableResendError } = await import("./email");

const license = { to: "cliente@example.test", name: "Cliente", licenseKey: "IRIS-AAAA-BBBB-CCCC-DDDD", plan: "lifetime" as const };

beforeEach(() => {
  send.mockReset();
  inserted.length = 0;
});

describe("sendLicenseEmail", () => {
  it("registra como enviado só quando o Resend devolve o id", async () => {
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    await sendLicenseEmail(license);
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({ status: "sent", provider_id: "email-1" });
    expect(JSON.stringify(inserted[0].metadata)).not.toContain(license.licenseKey);
  });

  it("trata o erro devolvido pelo Resend como falha e avisa o administrador", async () => {
    send.mockResolvedValue({ data: null, error: { message: "Invalid `to` field", statusCode: 422 } });
    await expect(sendLicenseEmail(license)).rejects.toThrow("Invalid `to` field");
    const customerSends = send.mock.calls.filter(([message]) => message.to === license.to);
    expect(customerSends).toHaveLength(1); // erro de validação não é repetido
    expect(inserted).toEqual([expect.objectContaining({ status: "failed", error_message: "Invalid `to` field" })]);
    expect(send.mock.calls.some(([message]) => message.to === "admin@example.test")).toBe(true);
  });

  it("tenta de novo quando o Resend falha temporariamente", async () => {
    send
      .mockResolvedValueOnce({ data: null, error: { message: "rate limited", statusCode: 429 } })
      .mockResolvedValueOnce({ data: { id: "email-2" }, error: null });
    await sendLicenseEmail(license);
    expect(inserted).toEqual([expect.objectContaining({ status: "sent", provider_id: "email-2" })]);
  });

  it("aponta o download para a versão mais recente", async () => {
    send.mockResolvedValue({ data: { id: "email-3" }, error: null });
    await sendLicenseEmail(license);
    expect(send.mock.calls[0][0].html).toContain("https://example.test/download");
  });
});

describe("isRetryableResendError", () => {
  it("só repete limite de taxa, erro do servidor ou falha sem código", () => {
    expect(isRetryableResendError({ statusCode: 429 })).toBe(true);
    expect(isRetryableResendError({ statusCode: 503 })).toBe(true);
    expect(isRetryableResendError({ statusCode: null })).toBe(true);
    expect(isRetryableResendError({ statusCode: 422 })).toBe(false);
    expect(isRetryableResendError({ statusCode: 403 })).toBe(false);
  });
});
