/**
 * Cadastro de quem baixa um app grátis (hoje, o IRIS Link): nome, e-mail e
 * WhatsApp, com consentimento para receber novidades da Iris Media.
 * Validação pura, sem rede, para ser testada e usada pela rota da API.
 */

export const LEAD_PRODUCTS = ["irislink"] as const;
export type LeadProduct = (typeof LEAD_PRODUCTS)[number];

export interface Lead {
  name: string;
  email: string;
  /** Só dígitos, com DDI. Ex.: 5511987654321. */
  whatsapp: string;
  product: LeadProduct;
}

export type LeadError =
  | "INVALID_REQUEST"
  | "NAME_REQUIRED"
  | "EMAIL_INVALID"
  | "WHATSAPP_INVALID"
  | "CONSENT_REQUIRED"
  | "PRODUCT_INVALID";

export type LeadResult = { ok: true; lead: Lead } | { ok: false; error: LeadError };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normaliza o WhatsApp para dígitos com DDI.
 * Aceita número brasileiro com DDD (10 ou 11 dígitos, ganha o 55) ou um número
 * internacional digitado com "+" (8 a 15 dígitos, padrão E.164).
 */
export function normalizeWhatsapp(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    return digits.length >= 8 && digits.length <= 15 ? digits : null;
  }
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) return digits;
  return null;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

export function parseLead(body: unknown): LeadResult {
  if (!body || typeof body !== "object") return { ok: false, error: "INVALID_REQUEST" };
  const b = body as Record<string, unknown>;

  const product = b.product;
  if (typeof product !== "string" || !(LEAD_PRODUCTS as readonly string[]).includes(product)) {
    return { ok: false, error: "PRODUCT_INVALID" };
  }

  const name = text(b.name, 120);
  if (name.length < 2) return { ok: false, error: "NAME_REQUIRED" };

  const email = text(b.email, 254).toLowerCase();
  if (!EMAIL_RE.test(email)) return { ok: false, error: "EMAIL_INVALID" };

  const whatsapp = typeof b.whatsapp === "string" ? normalizeWhatsapp(b.whatsapp.slice(0, 40)) : null;
  if (!whatsapp) return { ok: false, error: "WHATSAPP_INVALID" };

  if (b.consent !== true) return { ok: false, error: "CONSENT_REQUIRED" };

  return { ok: true, lead: { name, email, whatsapp, product: product as LeadProduct } };
}

/** Campo escondido que só robô preenche. */
export function isBot(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const trap = (body as Record<string, unknown>).website;
  return typeof trap === "string" && trap.trim() !== "";
}

/** Limite simples por IP, em memória (vale por instância da função). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, { count: number; start: number }>();

export function leadRateLimited(ip: string, now = Date.now()): boolean {
  const state = hits.get(ip);
  if (!state || now - state.start >= WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    return false;
  }
  state.count += 1;
  return state.count > MAX_PER_WINDOW;
}
