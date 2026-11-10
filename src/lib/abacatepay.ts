import crypto from "node:crypto";

const ABACATEPAY_BASE_URL = "https://api.abacatepay.com/v2";

export type Plan = "annual" | "lifetime";

interface AbacateEnvelope<T> {
  data?: T;
  success?: boolean;
  error?: unknown;
}

/** Checkout ("Billing") como a API v2 devolve. */
export interface AbacateBilling {
  id: string;
  url: string;
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUNDED" | "REDEEMED";
  customerId?: string | null;
  externalId?: string | null;
  amount?: number;
  metadata?: Record<string, unknown> | null;
  items?: Array<{ id: string; quantity: number }>;
  devMode?: boolean;
}

export interface AbacateSubscription {
  id: string;
  checkoutId: string | null;
  customerId: string;
  status: "PENDING" | "ACTIVE" | "CANCELLED";
  amount: number;
  devMode?: boolean;
}

interface AbacateCustomer {
  id: string;
  email: string;
  name?: string | null;
}

const PRODUCT_ENV: Record<Plan, string> = {
  annual: "ABACATEPAY_ANNUAL_PRODUCT_ID",
  lifetime: "ABACATEPAY_LIFETIME_PRODUCT_ID",
};

function getApiKey() {
  const key = process.env.ABACATEPAY_API_KEY;
  if (!key) throw new Error("ABACATEPAY_API_KEY não configurada");
  return key;
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.irisdownloader.com.br";
}

/**
 * Pagamentos do modo de teste (cartão 4242…) não podem virar licença no site
 * em produção. Fora da produção (local, preview) eles servem para testar.
 */
export function acceptsPayment(record: { devMode?: boolean }) {
  if (record.devMode !== true) return true;
  return process.env.VERCEL_ENV !== "production";
}

export function getProductId(plan: Plan) {
  const productId = process.env[PRODUCT_ENV[plan]];
  if (!productId) throw new Error(`${PRODUCT_ENV[plan]} não configurado`);
  return productId;
}

async function abacateRequest<T>(
  method: "GET" | "POST",
  path: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const url = new URL(`${ABACATEPAY_BASE_URL}${path}`);
  if (method === "GET") {
    for (const [key, value] of Object.entries(payload)) url.searchParams.set(key, String(value));
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: method === "POST" ? JSON.stringify(payload) : undefined,
    cache: "no-store",
  });

  const json = (await res.json().catch(() => ({}))) as AbacateEnvelope<T>;
  if (!res.ok || json.success === false || !json.data) {
    const details = typeof json.error === "string" ? json.error : JSON.stringify(json.error ?? json);
    throw new Error(`AbacatePay ${path}: ${details}`);
  }
  return json.data;
}

export async function createAbacateCheckout(params: {
  plan: Plan;
  name: string;
  email: string;
  taxId?: string;
}) {
  const customerPayload: Record<string, unknown> = { email: params.email, name: params.name };
  if (params.taxId) customerPayload.taxId = params.taxId;
  const customer = await abacateRequest<{ id: string }>("POST", "/customers/create", customerPayload);

  const siteUrl = getSiteUrl();
  const externalId = `iris-${params.plan}-${crypto.randomUUID()}`;
  const payload = {
    items: [{ id: getProductId(params.plan), quantity: 1 }],
    customerId: customer.id,
    externalId,
    returnUrl: `${siteUrl}/#pricing`,
    // O ref aleatório só chega a quem pagou; com ele /obrigado mostra a chave.
    completionUrl: `${siteUrl}/obrigado?ref=${externalId}`,
    metadata: { plan: params.plan, email: params.email, name: params.name, source: "iris-website" },
  };

  // Anual é assinatura (renova sozinha); vitalício é pagamento único.
  const path = params.plan === "annual" ? "/subscriptions/create" : "/checkouts/create";
  const preferred = params.plan === "annual" ? ["CARD"] : ["PIX", "CARD"];
  try {
    const checkout = await abacateRequest<AbacateBilling>("POST", path, { ...payload, methods: preferred });
    return checkout.url;
  } catch (error) {
    // Enquanto a AbacatePay não libera cartão na loja, a API recusa CARD.
    // Nesse caso o checkout sai só com PIX (no anual, Pix Automático).
    if (!isCardUnavailable(error)) throw error;
    const checkout = await abacateRequest<AbacateBilling>("POST", path, { ...payload, methods: ["PIX"] });
    return checkout.url;
  }
}

export function isCardUnavailable(error: unknown) {
  return error instanceof Error && /CARD is not available/i.test(error.message);
}

export function getAbacateCheckout(id: string) {
  return abacateRequest<AbacateBilling>("GET", "/checkouts/get", { id });
}

/** ref que o site gera em createAbacateCheckout e devolve em /obrigado?ref=. */
export function parseCheckoutRef(value: unknown): { plan: Plan; ref: string } | null {
  if (typeof value !== "string") return null;
  const match = /^iris-(annual|lifetime)-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.exec(value);
  return match ? { plan: match[1] as Plan, ref: value } : null;
}

export function getAbacateCheckoutByRef(externalId: string) {
  return abacateRequest<AbacateBilling>("GET", "/checkouts/get", { externalId });
}

export function getAbacateSubscriptionByRef(externalId: string) {
  return abacateRequest<AbacateSubscription>("GET", "/subscriptions/get", { externalId });
}

/** Checkout que originou uma assinatura: não aparece em /checkouts/get. */
export function getAbacateSubscriptionCheckout(id: string) {
  return abacateRequest<AbacateBilling>("GET", "/subscriptions/checkouts/get", { id });
}

export function getAbacateSubscription(id: string) {
  return abacateRequest<AbacateSubscription>("GET", "/subscriptions/get", { id });
}

export function getAbacateCustomer(id: string) {
  return abacateRequest<AbacateCustomer>("GET", "/customers/get", { id });
}

export async function cancelAbacateSubscription(subscriptionId: string) {
  await abacateRequest<unknown>("POST", "/subscriptions/cancel", { id: subscriptionId });
}

/**
 * Procura no payload o primeiro id com o prefixo dado (bill_, subs_).
 * A documentação não publica o formato de cada evento, então não dependemos
 * de um caminho fixo: o id é só o ponto de partida para consultar a API.
 */
export function findId(value: unknown, prefix: string): string {
  const queue: unknown[] = [value];
  while (queue.length > 0) {
    const current = queue.shift();
    if (typeof current === "string" && current.startsWith(prefix)) return current;
    if (current && typeof current === "object") queue.push(...Object.values(current));
  }
  return "";
}
