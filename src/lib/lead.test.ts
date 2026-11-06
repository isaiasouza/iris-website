import { describe, expect, it } from "vitest";
import { isBot, leadRateLimited, normalizeWhatsapp, parseLead } from "./lead";

const valid = {
  product: "irislink",
  name: "  Ana   Souza ",
  email: " Ana@Exemplo.com ",
  whatsapp: "(11) 98765-4321",
  consent: true,
};

describe("normalizeWhatsapp", () => {
  it("adiciona o 55 em número brasileiro com DDD", () => {
    expect(normalizeWhatsapp("(11) 98765-4321")).toBe("5511987654321");
    expect(normalizeWhatsapp("11 3456-7890")).toBe("551134567890");
  });

  it("mantém número que já tem o 55", () => {
    expect(normalizeWhatsapp("+55 11 98765-4321")).toBe("5511987654321");
    expect(normalizeWhatsapp("5511987654321")).toBe("5511987654321");
  });

  it("aceita número internacional com +", () => {
    expect(normalizeWhatsapp("+1 415 555 0100")).toBe("14155550100");
  });

  it("recusa número curto ou longo demais", () => {
    expect(normalizeWhatsapp("98765-4321")).toBeNull();
    expect(normalizeWhatsapp("")).toBeNull();
    expect(normalizeWhatsapp("+1234567890123456")).toBeNull();
  });
});

describe("parseLead", () => {
  it("normaliza nome, e-mail e WhatsApp", () => {
    expect(parseLead(valid)).toEqual({
      ok: true,
      lead: { product: "irislink", name: "Ana Souza", email: "ana@exemplo.com", whatsapp: "5511987654321" },
    });
  });

  it("exige consentimento marcado", () => {
    expect(parseLead({ ...valid, consent: false })).toEqual({ ok: false, error: "CONSENT_REQUIRED" });
    expect(parseLead({ ...valid, consent: "true" })).toEqual({ ok: false, error: "CONSENT_REQUIRED" });
  });

  it("recusa campos inválidos", () => {
    expect(parseLead(null)).toEqual({ ok: false, error: "INVALID_REQUEST" });
    expect(parseLead({ ...valid, product: "outro" })).toEqual({ ok: false, error: "PRODUCT_INVALID" });
    expect(parseLead({ ...valid, name: " a " })).toEqual({ ok: false, error: "NAME_REQUIRED" });
    expect(parseLead({ ...valid, email: "ana@exemplo" })).toEqual({ ok: false, error: "EMAIL_INVALID" });
    expect(parseLead({ ...valid, whatsapp: 11987654321 })).toEqual({ ok: false, error: "WHATSAPP_INVALID" });
  });
});

describe("isBot", () => {
  it("só marca quando o campo escondido vem preenchido", () => {
    expect(isBot({ website: "" })).toBe(false);
    expect(isBot({})).toBe(false);
    expect(isBot({ website: "http://spam" })).toBe(true);
  });
});

describe("leadRateLimited", () => {
  it("bloqueia depois de 8 envios na janela e libera depois", () => {
    const ip = "203.0.113.9";
    const t0 = 1_000_000;
    for (let i = 0; i < 8; i++) expect(leadRateLimited(ip, t0 + i)).toBe(false);
    expect(leadRateLimited(ip, t0 + 9)).toBe(true);
    expect(leadRateLimited(ip, t0 + 10 * 60 * 1000 + 1)).toBe(false);
  });
});
