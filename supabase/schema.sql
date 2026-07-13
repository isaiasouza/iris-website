-- ============================================================
-- Iris Downloader — Schema de Licenciamento
-- Execute no Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- LICENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS licenses (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key            TEXT UNIQUE NOT NULL,
  plan                   TEXT NOT NULL CHECK (plan IN ('annual', 'lifetime')),
  status                 TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active', 'suspended', 'cancelled', 'expired')),
  email                  TEXT NOT NULL,
  name                   TEXT,
  asaas_customer_id      TEXT,
  asaas_subscription_id  TEXT,
  asaas_payment_id       TEXT UNIQUE,
  abacatepay_checkout_id TEXT UNIQUE,
  abacatepay_subscription_id TEXT UNIQUE,
  abacatepay_event_id    TEXT,
  max_devices            INT NOT NULL DEFAULT 1,
  expires_at             TIMESTAMPTZ,
  created_at             TIMESTAMPTZ DEFAULT now(),
  updated_at             TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_licenses_email      ON licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_status     ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON licenses(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_licenses_abacatepay_checkout_id ON licenses(abacatepay_checkout_id);
CREATE INDEX IF NOT EXISTS idx_licenses_abacatepay_subscription_id ON licenses(abacatepay_subscription_id);

ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_checkout_id TEXT UNIQUE;
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_subscription_id TEXT UNIQUE;
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_event_id TEXT;

-- ============================================================
-- DEVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS devices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id   UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  hardware_id  TEXT NOT NULL,
  device_name  TEXT,
  os_version   TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  activated_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(license_id, hardware_id)
);

CREATE INDEX IF NOT EXISTS idx_devices_license_id  ON devices(license_id);
CREATE INDEX IF NOT EXISTS idx_devices_hardware_id ON devices(hardware_id);
CREATE INDEX IF NOT EXISTS idx_devices_active      ON devices(license_id, is_active);

-- ============================================================
-- LICENSE EVENTS (audit log)
-- ============================================================
CREATE TABLE IF NOT EXISTS license_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id  UUID REFERENCES licenses(id) ON DELETE SET NULL,
  event       TEXT NOT NULL,
  hardware_id TEXT,
  ip_address  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_license_id ON license_events(license_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON license_events(created_at DESC);

-- ============================================================
-- VALIDATION TOKENS (cache online → offline TTL 72h)
-- ============================================================
CREATE TABLE IF NOT EXISTS validation_tokens (
  hardware_id TEXT NOT NULL,
  license_id  UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
  token       TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (hardware_id, license_id)
);

-- ============================================================
-- Row Level Security — tudo fechado, acesso só via service_role
-- ============================================================
ALTER TABLE licenses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices           ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_tokens ENABLE ROW LEVEL SECURITY;

-- Bloqueia acesso público (anon key)
CREATE POLICY "no_public_access" ON licenses          FOR ALL TO anon USING (false);
CREATE POLICY "no_public_access" ON devices           FOR ALL TO anon USING (false);
CREATE POLICY "no_public_access" ON license_events    FOR ALL TO anon USING (false);
CREATE POLICY "no_public_access" ON validation_tokens FOR ALL TO anon USING (false);

-- ============================================================
-- Helper: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_licenses_updated_at
  BEFORE UPDATE ON licenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Helper: limpar tokens expirados (rodar como cron job no Supabase)
-- ============================================================
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM validation_tokens WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;
