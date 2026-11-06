-- Contatos de quem baixa um app grátis da Iris Media (começa pelo IRIS Link).
-- Usado para e-mail marketing do Iris Downloader e de outros produtos, só com
-- consentimento marcado no formulário. Aditiva: tabela nova, nada existente muda.

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL CHECK (product IN ('irislink')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  consent_marketing BOOLEAN NOT NULL DEFAULT false,
  consent_at TIMESTAMPTZ,
  downloads INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Quem baixa de novo atualiza o mesmo registro.
  CONSTRAINT leads_email_product_key UNIQUE (email, product)
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Só o service_role (rotas do servidor) lê e grava.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'leads' AND policyname = 'no_public_access'
  ) THEN
    CREATE POLICY no_public_access ON public.leads FOR ALL TO anon USING (false);
  END IF;
END $$;
