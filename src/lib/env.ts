const CORE_ENV_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_JWT_SECRET",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "CAKTO_WEBHOOK_SECRET",
  "NEXT_PUBLIC_CAKTO_LIFETIME_ID",
] as const;

type CoreEnvKey = (typeof CORE_ENV_KEYS)[number];

export type CoreEnvSource = Partial<Record<CoreEnvKey, string | undefined>>;
export type CoreEnv = Readonly<Record<CoreEnvKey, string>>;

export interface AsaasEnv {
  readonly ASAAS_API_KEY: string;
  readonly ASAAS_ENV: string;
  readonly ASAAS_WEBHOOK_TOKEN: string;
}

export interface StripeEnv {
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_WEBHOOK_SECRET: string;
}

type EnvEntry<K extends string> = readonly [K, string | undefined];

function validateEntries<K extends string>(
  scope: string,
  entries: readonly EnvEntry<K>[]
): Readonly<Record<K, string>> {
  const missing = entries
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required ${scope} environment variables: ${missing.join(", ")}`
    );
  }

  return Object.fromEntries(
    entries.map(([key, value]) => [key, value!.trim()])
  ) as Readonly<Record<K, string>>;
}

export function validateEnv(source: CoreEnvSource): CoreEnv {
  return validateEntries("CORE", [
    ["NEXT_PUBLIC_SUPABASE_URL", source.NEXT_PUBLIC_SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", source.SUPABASE_SERVICE_ROLE_KEY],
    ["JWT_SECRET", source.JWT_SECRET],
    ["ADMIN_EMAIL", source.ADMIN_EMAIL],
    ["ADMIN_PASSWORD", source.ADMIN_PASSWORD],
    ["ADMIN_JWT_SECRET", source.ADMIN_JWT_SECRET],
    ["RESEND_API_KEY", source.RESEND_API_KEY],
    ["NEXT_PUBLIC_SITE_URL", source.NEXT_PUBLIC_SITE_URL],
    ["CAKTO_WEBHOOK_SECRET", source.CAKTO_WEBHOOK_SECRET],
    ["NEXT_PUBLIC_CAKTO_LIFETIME_ID", source.NEXT_PUBLIC_CAKTO_LIFETIME_ID],
  ]);
}

function readCoreProcessEnv(): CoreEnvSource {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    CAKTO_WEBHOOK_SECRET: process.env.CAKTO_WEBHOOK_SECRET,
    NEXT_PUBLIC_CAKTO_LIFETIME_ID: process.env.NEXT_PUBLIC_CAKTO_LIFETIME_ID,
  };
}

let cachedCoreEnv: CoreEnv | undefined;

export function getCoreEnv(): CoreEnv {
  if (!cachedCoreEnv) {
    cachedCoreEnv = validateEnv(readCoreProcessEnv());
  }
  return cachedCoreEnv;
}

export function getAsaasEnv(): AsaasEnv {
  return validateEntries("ASAAS", [
    ["ASAAS_API_KEY", process.env.ASAAS_API_KEY],
    ["ASAAS_ENV", process.env.ASAAS_ENV],
    ["ASAAS_WEBHOOK_TOKEN", process.env.ASAAS_WEBHOOK_TOKEN],
  ]);
}

export function getStripeEnv(): StripeEnv {
  return validateEntries("STRIPE", [
    ["STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY],
    ["STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET],
  ]);
}
