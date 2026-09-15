ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_checkout_id TEXT UNIQUE;
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_subscription_id TEXT UNIQUE;
ALTER TABLE licenses ADD COLUMN IF NOT EXISTS abacatepay_event_id TEXT;

CREATE INDEX IF NOT EXISTS idx_licenses_abacatepay_checkout_id
  ON licenses(abacatepay_checkout_id);

CREATE INDEX IF NOT EXISTS idx_licenses_abacatepay_subscription_id
  ON licenses(abacatepay_subscription_id);
