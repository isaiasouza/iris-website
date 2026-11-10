import { afterEach, describe, expect, it, vi } from "vitest";
import { createAbacateCheckout } from "./abacatepay";

process.env.ABACATEPAY_API_KEY = "abc_test";
process.env.ABACATEPAY_LIFETIME_PRODUCT_ID = "prod_lifetime";
process.env.ABACATEPAY_ANNUAL_PRODUCT_ID = "prod_annual";

type Call = { path: string; body: Record<string, unknown> };

function mockApi(rejectCard: boolean) {
  const calls: Call[] = [];
  vi.stubGlobal("fetch", vi.fn(async (url: URL, init: RequestInit) => {
    const body = JSON.parse(String(init.body ?? "{}"));
    const path = new URL(url).pathname.replace("/v2", "");
    calls.push({ path, body });
    if (path === "/customers/create") return Response.json({ data: { id: "cust_1" }, success: true });
    if (rejectCard && (body.methods as string[]).includes("CARD")) {
      return Response.json({ data: null, success: false, error: "CARD is not available for this store" }, { status: 400 });
    }
    return Response.json({ data: { id: "bill_1", url: "https://app.abacatepay.com/pay/bill_1" }, success: true });
  }));
  return calls;
}

afterEach(() => vi.unstubAllGlobals());

describe("createAbacateCheckout", () => {
  it("oferece PIX e cartão quando a loja aceita cartão", async () => {
    const calls = mockApi(false);
    await createAbacateCheckout({ plan: "lifetime", name: "Cliente", email: "c@example.com" });
    expect(calls.at(-1)).toMatchObject({ path: "/checkouts/create", body: { methods: ["PIX", "CARD"] } });
  });

  it("cai para PIX quando a AbacatePay ainda não liberou cartão", async () => {
    const calls = mockApi(true);
    const url = await createAbacateCheckout({ plan: "annual", name: "Cliente", email: "c@example.com" });
    expect(url).toContain("bill_1");
    expect(calls.at(-1)).toMatchObject({ path: "/subscriptions/create", body: { methods: ["PIX"] } });
  });
});

describe("parseCheckoutRef", () => {
  it("aceita só o ref que o próprio site gera", async () => {
    const { parseCheckoutRef } = await import("./abacatepay");
    expect(parseCheckoutRef("iris-lifetime-0b7c6a3e-1f2d-4c5b-9a8e-7d6c5b4a3f2e")).toEqual({
      plan: "lifetime",
      ref: "iris-lifetime-0b7c6a3e-1f2d-4c5b-9a8e-7d6c5b4a3f2e",
    });
    expect(parseCheckoutRef("iris-lifetime-x")).toBeNull();
    expect(parseCheckoutRef("iris-pro-0b7c6a3e-1f2d-4c5b-9a8e-7d6c5b4a3f2e")).toBeNull();
    expect(parseCheckoutRef(undefined)).toBeNull();
  });

  it("devolve /obrigado com o ref no checkout", async () => {
    const calls = mockApi(false);
    await createAbacateCheckout({ plan: "lifetime", name: "Cliente", email: "c@example.com" });
    const body = calls.at(-1)!.body;
    expect(body.completionUrl).toBe(`https://www.irisdownloader.com.br/obrigado?ref=${body.externalId}`);
  });
});
