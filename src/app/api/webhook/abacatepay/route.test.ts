import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const SECRET = "webhook-secret-test";
const HMAC_KEY = "hmac-key-test";
process.env.ABACATEPAY_WEBHOOK_SECRET = SECRET;
process.env.ABACATEPAY_WEBHOOK_PUBLIC_KEY = HMAC_KEY;

type Row = Record<string, unknown>;
const licenses: Row[] = [];
const events: Row[] = [];

// Supabase mínimo: select/eq/maybeSingle, insert/select/single e update/eq.
vi.mock("@/lib/supabase", () => ({
  generateLicenseKey: () => "IRIS-TEST-TEST-TEST-TEST",
  supabaseAdmin: {
    from(table: string) {
      const rows = table === "licenses" ? licenses : events;
      return {
        select() {
          const filters: Array<[string, unknown]> = [];
          const query = {
            eq(column: string, value: unknown) {
              filters.push([column, value]);
              return query;
            },
            async maybeSingle() {
              const row = rows.find((candidate) => filters.every(([c, v]) => candidate[c] === v));
              return { data: row ?? null, error: null };
            },
          };
          return query;
        },
        insert(row: Row) {
          rows.push({ id: `row-${rows.length + 1}`, ...row });
          const result = { data: rows[rows.length - 1], error: null };
          return { select: () => ({ single: async () => result }), then: (resolve: (v: unknown) => void) => resolve(result) };
        },
        update(values: Row) {
          return {
            async eq(column: string, value: unknown) {
              rows.filter((row) => row[column] === value).forEach((row) => Object.assign(row, values));
              return { error: null };
            },
          };
        },
      };
    },
  },
}));

const sendLicenseEmail = vi.fn();
vi.mock("@/lib/email", () => ({
  sendLicenseEmail: (...args: unknown[]) => sendLicenseEmail(...args),
  sendPaymentFailedEmail: vi.fn(async () => {}),
  sendAdminNotice: vi.fn(async () => {}),
}));

const getAbacateCheckout = vi.fn();
const getAbacateSubscription = vi.fn();
vi.mock("@/lib/abacatepay", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/abacatepay")>();
  return {
    findId: actual.findId,
    acceptsPayment: actual.acceptsPayment,
    getProductId: (plan: string) => (plan === "lifetime" ? "prod_lifetime" : "prod_annual"),
    getAbacateCheckout: (...args: unknown[]) => getAbacateCheckout(...args),
    getAbacateSubscription: (...args: unknown[]) => getAbacateSubscription(...args),
    getAbacateSubscriptionCheckout: vi.fn(async () => null),
    getAbacateCustomer: vi.fn(async () => ({ id: "cust_1", email: "Cliente@Example.com", name: "Cliente" })),
  };
});

const { POST } = await import("./route");

function request(event: Record<string, unknown>, { secret = SECRET, sign = true } = {}) {
  const body = JSON.stringify(event);
  const signature = crypto.createHmac("sha256", HMAC_KEY).update(body).digest("base64");
  return new NextRequest(`http://localhost/api/webhook/abacatepay?webhookSecret=${secret}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(sign ? { "x-webhook-signature": signature } : {}) },
    body,
  });
}

const paidEvent = { id: "log_1", event: "checkout.completed", data: { checkout: { id: "bill_1" } } };

beforeEach(() => {
  licenses.length = 0;
  events.length = 0;
  sendLicenseEmail.mockReset();
  getAbacateCheckout.mockReset();
  getAbacateSubscription.mockReset();
});

describe("POST /api/webhook/abacatepay", () => {
  it("recusa segredo errado e corpo sem assinatura", async () => {
    expect((await POST(request(paidEvent, { secret: "errado" }))).status).toBe(401);
    expect((await POST(request(paidEvent, { sign: false }))).status).toBe(401);
    expect(getAbacateCheckout).not.toHaveBeenCalled();
  });

  it("cria a licença vitalícia só depois de confirmar o pagamento na API", async () => {
    getAbacateCheckout.mockResolvedValue({ id: "bill_1", status: "PAID", customerId: "cust_1", items: [{ id: "prod_lifetime", quantity: 1 }] });
    const res = await POST(request(paidEvent));
    expect(res.status).toBe(200);
    expect(getAbacateCheckout).toHaveBeenCalledWith("bill_1");
    expect(licenses).toEqual([
      expect.objectContaining({ plan: "lifetime", email: "cliente@example.com", abacatepay_checkout_id: "bill_1", max_devices: 3 }),
    ]);
    expect(sendLicenseEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "cliente@example.com", plan: "lifetime" }));
  });

  it("ignora checkout que a API não confirma como pago", async () => {
    getAbacateCheckout.mockResolvedValue({ id: "bill_1", status: "PENDING", items: [{ id: "prod_lifetime", quantity: 1 }] });
    await POST(request(paidEvent));
    expect(licenses).toHaveLength(0);
  });

  it("não duplica a licença quando o evento chega de novo", async () => {
    getAbacateCheckout.mockResolvedValue({ id: "bill_1", status: "PAID", customerId: "cust_1", items: [{ id: "prod_lifetime", quantity: 1 }] });
    await POST(request(paidEvent));
    await POST(request(paidEvent));
    expect(licenses).toHaveLength(1);
    expect(sendLicenseEmail).toHaveBeenCalledTimes(1);
  });

  it("cria a licença anual a partir da assinatura ativa", async () => {
    getAbacateSubscription.mockResolvedValue({ id: "subs_1", status: "ACTIVE", checkoutId: "bill_9", customerId: "cust_1", amount: 4990 });
    await POST(request({ id: "log_2", event: "subscription.completed", data: { subscription: { id: "subs_1" } } }));
    expect(licenses).toEqual([
      expect.objectContaining({ plan: "annual", abacatepay_subscription_id: "subs_1", abacatepay_checkout_id: "bill_9", max_devices: 1 }),
    ]);
  });

  it("renovação soma um ano ao vencimento atual", async () => {
    const end = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    licenses.push({ id: "lic-1", abacatepay_subscription_id: "subs_1", expires_at: end.toISOString(), status: "active" });
    getAbacateSubscription.mockResolvedValue({ id: "subs_1", status: "ACTIVE", checkoutId: null, customerId: "cust_1", amount: 4990 });
    await POST(request({ id: "log_3", event: "subscription.renewed", data: { id: "subs_1" } }));
    const newEnd = new Date(licenses[0].expires_at as string).getTime();
    expect(Math.round((newEnd - end.getTime()) / 86_400_000)).toBe(365);
  });

  it("reembolso cancela a licença", async () => {
    licenses.push({ id: "lic-1", abacatepay_checkout_id: "bill_1", status: "active" });
    await POST(request({ id: "log_4", event: "checkout.refunded", data: { id: "bill_1" } }));
    expect(licenses[0].status).toBe("cancelled");
  });

  it("em produção, pagamento do modo de teste não vira licença", async () => {
    process.env.VERCEL_ENV = "production";
    try {
      getAbacateCheckout.mockResolvedValue({ id: "bill_1", status: "PAID", devMode: true, customerId: "cust_1", items: [{ id: "prod_lifetime", quantity: 1 }] });
      const res = await POST(request(paidEvent));
      expect(res.status).toBe(200);
      expect(licenses).toHaveLength(0);
    } finally {
      delete process.env.VERCEL_ENV;
    }
  });
});
