export const PURCHASE_CURRENCY = "BRL" as const;

const ORDER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

export function parsePurchaseValue(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;

  const normalized = raw.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) return null;

  return Math.round(amount * 100) / 100;
}

export function parseOrderId(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const orderId = raw?.trim();

  return orderId && ORDER_ID_PATTERN.test(orderId) ? orderId : null;
}

export function formatPurchaseValue(value: number | null): string | null {
  if (value === null) return null;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: PURCHASE_CURRENCY,
  }).format(value);
}
