import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — só inicializa quando chamado, não no build
let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase env vars not set: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    }
    _client = createClient(url, key, { auth: { persistSession: false } });
  }
  return _client;
}

// Alias conveniente (mantém uso como objeto direto via getter)
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return (getSupabaseAdmin() as unknown as Record<string, unknown>)[prop as string];
  },
});

// Tipos das tabelas
export interface License {
  id: string;
  license_key: string;
  plan: "annual" | "lifetime";
  status: "active" | "suspended" | "cancelled" | "expired";
  email: string;
  name: string | null;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_payment_id: string | null;
  max_devices: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  license_id: string;
  hardware_id: string;
  device_name: string | null;
  os_version: string | null;
  is_active: boolean;
  activated_at: string;
  last_seen_at: string;
}

// Gera chave no formato IRIS-XXXX-XXXX-XXXX-XXXX
export function generateLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = () =>
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  return `IRIS-${block()}-${block()}-${block()}-${block()}`;
}
