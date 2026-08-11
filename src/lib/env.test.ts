import { describe, expect, it } from "vitest";
import { validateEnv, type CoreEnvSource } from "./env";

const validSource: CoreEnvSource = {
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  JWT_SECRET: "jwt-test",
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD: "password-test",
  ADMIN_JWT_SECRET: "admin-jwt-test",
  RESEND_API_KEY: "re_test",
  NEXT_PUBLIC_SITE_URL: "https://example.com",
  CAKTO_WEBHOOK_SECRET: "cakto-test",
  NEXT_PUBLIC_CAKTO_LIFETIME_ID: "offer-test",
};

describe("validateEnv", () => {
  it.each([
    ["ausente", undefined],
    ["vazia", ""],
    ["somente espaços", "   "],
  ])("rejeita uma chave obrigatória %s", (_description, value) => {
    const source = { ...validSource };

    if (value === undefined) {
      delete source.JWT_SECRET;
    } else {
      source.JWT_SECRET = value;
    }

    expect(() => validateEnv(source)).toThrow(
      "[env] Missing required CORE environment variables: JWT_SECRET"
    );
  });

  it("lista todas as chaves obrigatórias ausentes", () => {
    const source = {
      ...validSource,
      JWT_SECRET: "",
      ADMIN_PASSWORD: "   ",
    };

    expect(() => validateEnv(source)).toThrow(
      "[env] Missing required CORE environment variables: JWT_SECRET, ADMIN_PASSWORD"
    );
  });
});
