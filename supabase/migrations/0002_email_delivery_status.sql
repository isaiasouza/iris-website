-- Status de entrega real dos e-mails, vindo do webhook do Resend.
-- `status` continua dizendo se o Resend ACEITOU o envio (sent/failed);
-- `delivery_status` diz o que aconteceu depois: entregue, atrasado,
-- devolvido, marcado como spam, falhou ou suprimido.
-- Aditiva: só colunas anuláveis, uma constraint e um índice.

ALTER TABLE public.email_events
  ADD COLUMN IF NOT EXISTS delivery_status TEXT,
  ADD COLUMN IF NOT EXISTS delivery_detail TEXT,
  ADD COLUMN IF NOT EXISTS delivery_updated_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'email_events_delivery_status_check'
  ) THEN
    ALTER TABLE public.email_events
      ADD CONSTRAINT email_events_delivery_status_check CHECK (
        delivery_status IS NULL OR delivery_status IN (
          'delivered', 'delivery_delayed', 'bounced', 'complained', 'failed', 'suppressed'
        )
      );
  END IF;
END $$;

-- O webhook localiza o registro pelo id do Resend.
CREATE INDEX IF NOT EXISTS idx_email_events_provider_id ON public.email_events(provider_id);
CREATE INDEX IF NOT EXISTS idx_email_events_delivery_status ON public.email_events(delivery_status);
