const ABACATEPAY_BASE_URL = "https://api.abacatepay.com/v2";

type Plan = "annual" | "lifetime";

interface AbacateEnvelope<T> {
  data?: T;
  success?: boolean;
  error?: unknown;
}

interface AbacateCustomer {
  id: string;
}

interface AbacateCheckout {
  id: string;
  url: string;
}

interface CreateCheckoutParams {
  plan: Plan;
  name: string;
  email: string;
  taxId?: string;
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

function getProductId(plan: Plan) {
  const productId = process.env[PRODUCT_ENV[plan]];
  if (!productId) throw new Error(`${PRODUCT_ENV[plan]} não configurado`);
  return productId;
}

async function abacateRequest<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${ABACATEPAY_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = (await res.json().catch(() => ({}))) as AbacateEnvelope<T>;
  if (!res.ok || json.success === false || !json.data) {
    const details = typeof json.error === "string" ? json.error : JSON.stringify(json.error ?? json);
    throw new Error(`AbacatePay ${path}: ${details}`);
  }

  return json.data;
}

async function findOrCreateCustomer(params: CreateCheckoutParams) {
  const payload: Record<string, unknown> = {
    email: params.email,
    name: params.name,
  };

  if (params.taxId) payload.taxId = params.taxId;

  return abacateRequest<AbacateCustomer>("/customers/create", payload);
}

export async function createAbacateCheckout(params: CreateCheckoutParams) {
  const customer = await findOrCreateCustomer(params);
  const productId = getProductId(params.plan);
  const siteUrl = getSiteUrl();

  const payload = {
    items: [{ id: productId, quantity: 1 }],
    customerId: customer.id,
    externalId: `iris-${params.plan}-${Date.now()}`,
    returnUrl: siteUrl,
    completionUrl: `${siteUrl}/sucesso`,
    metadata: {
      plan: params.plan,
      name: params.name,
      email: params.email,
      source: "iris-website",
    },
  };

  const data = params.plan === "annual"
    ? await abacateRequest<AbacateCheckout>("/subscriptions/create", {
        ...payload,
        methods: ["CARD"],
      })
    : await abacateRequest<AbacateCheckout>("/checkouts/create", {
        ...payload,
        methods: ["PIX", "CARD"],
      });

  return data.url;
}

export async function cancelAbacateSubscription(subscriptionId: string) {
  await abacateRequest<unknown>("/subscriptions/cancel", { id: subscriptionId });
}
