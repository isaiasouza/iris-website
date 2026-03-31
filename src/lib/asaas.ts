const BASE_URL =
  process.env.ASAAS_ENV === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

const API_KEY = process.env.ASAAS_API_KEY!;

async function asaasFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "access_token": API_KEY,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Asaas ${options.method ?? "GET"} ${path}: ${JSON.stringify(data)}`
    );
  }
  return data;
}

// ─── Clientes ────────────────────────────────────────────────

export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj?: string;
}): Promise<{ id: string }> {
  // Busca cliente existente pelo email
  const search = await asaasFetch(`/customers?email=${encodeURIComponent(params.email)}`);
  if (search.data?.length > 0) return { id: search.data[0].id };

  // Cria novo
  return asaasFetch("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      cpfCnpj: params.cpfCnpj,
    }),
  });
}

// ─── Pagamento único (Vitalício) ─────────────────────────────

export async function createPayment(params: {
  customerId: string;
  value: number;
  description: string;
}): Promise<{ id: string; invoiceUrl: string; status: string }> {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);

  return asaasFetch("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "UNDEFINED",
      value: params.value,
      dueDate: dueDate.toISOString().split("T")[0],
      description: params.description,
      externalReference: `iris_lifetime_${Date.now()}`,
      callback: {
        successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`,
        autoRedirect: true,
      },
    }),
  });
}

// ─── Assinatura recorrente (Anual) ────────────────────────────

export async function createSubscription(params: {
  customerId: string;
  value: number;
  description: string;
}): Promise<{ id: string; invoiceUrl: string; status: string }> {
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + 1);

  const sub = await asaasFetch("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customerId,
      billingType: "UNDEFINED",
      value: params.value,
      nextDueDate: nextDue.toISOString().split("T")[0],
      cycle: "YEARLY",
      description: params.description,
      externalReference: `iris_annual_${Date.now()}`,
      callback: {
        successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/sucesso`,
        autoRedirect: true,
      },
    }),
  });

  // Busca o primeiro pagamento da assinatura para obter o invoiceUrl
  const payments = await asaasFetch(`/payments?subscription=${sub.id}&limit=1`);
  const firstPayment = payments.data?.[0];
  const invoiceUrl = firstPayment?.invoiceUrl ?? firstPayment?.bankSlipUrl ?? "";

  return { ...sub, invoiceUrl };
}

// ─── Cancelar assinatura ──────────────────────────────────────

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await asaasFetch(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}

// ─── Buscar cliente por ID ────────────────────────────────────

export async function getCustomer(customerId: string): Promise<{ id: string; name: string; email: string }> {
  return asaasFetch(`/customers/${customerId}`);
}

// ─── Link de pagamento do portal Asaas ───────────────────────

export async function getCustomerPortalUrl(customerId: string): Promise<string> {
  const data = await asaasFetch(`/customers/${customerId}/customerPortalUrl`);
  return data.url ?? `https://www.asaas.com/customerPortal/${customerId}`;
}
