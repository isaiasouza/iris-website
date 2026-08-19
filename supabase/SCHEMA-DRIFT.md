# Divergência entre produção e `schema.sql`

Comparação realizada em 19/08/2026 entre o schema `public` do projeto Supabase de produção `jedenbqeislklxedwpsf`, consultado somente para leitura, e o arquivo histórico `supabase/schema.sql`.

O estado integral observado em produção está registrado em `supabase/migrations/0001_baseline_producao.sql`. Esse arquivo é um baseline declarativo, não o histórico cronológico das mudanças, e não deve ser executado novamente sobre a produção existente.

## Existe em produção e não existe em `schema.sql`

- Tabela `public.email_events`, com as colunas `id`, `to_email`, `subject`, `type`, `status`, `provider`, `provider_id`, `error_message`, `metadata` e `created_at`.
- Constraint `email_events_status_check`, que limita `status` a `sent` ou `failed`.
- Índices `idx_email_events_created_at`, `idx_email_events_status`, `idx_email_events_to_email` e `idx_email_events_type`.
- RLS habilitado em `public.email_events`. Não há policy nessa tabela em produção; portanto, para `anon` e `authenticated`, prevalece o bloqueio padrão do RLS. O backend usa `service_role`.
- Colunas de Stripe em `public.licenses`: `stripe_customer_id`, `stripe_subscription_id` e `stripe_session_id`.
- Colunas da Cakto em `public.licenses`: `cakto_transaction_id` e `cakto_subscription_id`.
- Coluna administrativa `public.licenses.internal_note`.
- Colunas da AbacatePay em `public.licenses`: `abacatepay_checkout_id`, `abacatepay_subscription_id` e `abacatepay_event_id`.
- Constraints únicas `licenses_stripe_session_id_key`, `licenses_cakto_transaction_id_key`, `licenses_abacatepay_checkout_id_key` e `licenses_abacatepay_subscription_id_key`.
- Índices `idx_licenses_abacatepay_checkout_id` e `idx_licenses_abacatepay_subscription_id`.
- Grants explícitos do schema, tabelas e funções para `postgres`, `anon`, `authenticated` e `service_role`, além dos privilégios padrão registrados no baseline. O `schema.sql` antigo não os declara.

A constraint única de `cakto_transaction_id` confirma que a produção tem suporte estrutural para idempotência por ID de transação. O código da rota ainda precisa tratar a consulta e os erros de escrita de forma explícita.

## Existe em `schema.sql` e não existe em produção

Nenhuma tabela, coluna, constraint, índice, trigger, função ou policy declarada no `schema.sql` deixou de ser encontrada em produção. As diferenças de qualificação de schema, caixa e uso de `IF NOT EXISTS` são diferenças textuais, não objetos ausentes.

## Objetos comuns aos dois estados

- Tabelas `licenses`, `devices`, `license_events` e `validation_tokens` com suas colunas históricas.
- Chaves primárias, relações e regras de exclusão em cascata ou `SET NULL` dessas tabelas.
- Constraints de plano e status de `licenses`.
- Índices históricos de licença, dispositivo e eventos.
- Funções `public.update_updated_at()` e `public.cleanup_expired_tokens()`.
- Trigger `trg_licenses_updated_at`.
- RLS e policy `no_public_access` nas quatro tabelas históricas.

## Próximo passo seguro

Depois que o baseline for incorporado ao histórico Git, qualquer mudança nova de schema deve entrar em uma migration posterior e ser aplicada de forma controlada. O baseline deve ser marcado como já aplicado na produção existente, não reaplicado.
