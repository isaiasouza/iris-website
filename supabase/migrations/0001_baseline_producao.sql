-- ==========================================================================
-- BASELINE DO SCHEMA DE PRODUCAO — IRIS DOWNLOADER
-- ==========================================================================
-- Extraido em: 2026-08-12T00:32:20Z (2026-08-11 America/Manaus)
-- Projeto Supabase: iris downloader (jedenbqeislklxedwpsf)
-- PostgreSQL de origem: 17.6
--
-- Este arquivo e um BASELINE declarativo do estado real observado em
-- producao. Ele nao representa o historico cronologico das alteracoes.
-- Nao aplique esta migration sobre o banco de producao existente: ao adotar
-- migrations naquele banco, marque o baseline como ja aplicado. O objetivo
-- deste SQL e reproduzir o schema public em ambientes novos.
--
-- Escopo: schema public e a extensao pgcrypto usada pelo schema versionado.
-- Schemas gerenciados pela plataforma (auth, storage, realtime, vault etc.)
-- e dados das tabelas nao fazem parte deste baseline.
--
-- Fonte: pg_dump --schema-only --schema=public, complementado por consultas
-- somente leitura a pg_catalog/pg_extension para confirmar RLS, policies,
-- extensoes e tipos de relacao. Nenhuma escrita foi feita no banco.
-- ==========================================================================

set statement_timeout = 0;
set lock_timeout = 0;
set idle_in_transaction_session_timeout = 0;
set transaction_timeout = 0;
set client_encoding = 'UTF8';
set standard_conforming_strings = on;
select pg_catalog.set_config('search_path', '', false);
set check_function_bodies = false;
set xmloption = content;
set client_min_messages = warning;
set row_security = off;

create schema if not exists public;
comment on schema public is 'standard public schema';

create extension if not exists pgcrypto with schema extensions;

create or replace function public.cleanup_expired_tokens()
returns void
language plpgsql
as $$
begin
  delete from validation_tokens where expires_at < now();
end;
$$;

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

set default_tablespace = '';
set default_table_access_method = heap;

create table public.devices (
  id uuid default gen_random_uuid() not null,
  license_id uuid not null,
  hardware_id text not null,
  device_name text,
  os_version text,
  is_active boolean default true not null,
  activated_at timestamp with time zone default now(),
  last_seen_at timestamp with time zone default now()
);

create table public.email_events (
  id uuid default gen_random_uuid() not null,
  to_email text not null,
  subject text not null,
  type text not null,
  status text not null,
  provider text default 'resend'::text not null,
  provider_id text,
  error_message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  constraint email_events_status_check
    check (status = any (array['sent'::text, 'failed'::text]))
);

create table public.license_events (
  id uuid default gen_random_uuid() not null,
  license_id uuid,
  event text not null,
  hardware_id text,
  ip_address text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create table public.licenses (
  id uuid default gen_random_uuid() not null,
  license_key text not null,
  plan text not null,
  status text default 'active'::text not null,
  email text not null,
  name text,
  asaas_customer_id text,
  asaas_subscription_id text,
  asaas_payment_id text,
  max_devices integer default 1 not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_session_id text,
  cakto_transaction_id text,
  cakto_subscription_id text,
  internal_note text,
  abacatepay_checkout_id text,
  abacatepay_subscription_id text,
  abacatepay_event_id text,
  constraint licenses_plan_check
    check (plan = any (array['annual'::text, 'lifetime'::text])),
  constraint licenses_status_check
    check (status = any (
      array[
        'active'::text,
        'suspended'::text,
        'cancelled'::text,
        'expired'::text
      ]
    ))
);

create table public.validation_tokens (
  hardware_id text not null,
  license_id uuid not null,
  token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

alter table only public.devices
  add constraint devices_license_id_hardware_id_key
  unique (license_id, hardware_id);

alter table only public.devices
  add constraint devices_pkey primary key (id);

alter table only public.email_events
  add constraint email_events_pkey primary key (id);

alter table only public.license_events
  add constraint license_events_pkey primary key (id);

alter table only public.licenses
  add constraint licenses_abacatepay_checkout_id_key
  unique (abacatepay_checkout_id);

alter table only public.licenses
  add constraint licenses_abacatepay_subscription_id_key
  unique (abacatepay_subscription_id);

alter table only public.licenses
  add constraint licenses_asaas_payment_id_key unique (asaas_payment_id);

alter table only public.licenses
  add constraint licenses_cakto_transaction_id_key unique (cakto_transaction_id);

alter table only public.licenses
  add constraint licenses_license_key_key unique (license_key);

alter table only public.licenses
  add constraint licenses_pkey primary key (id);

alter table only public.licenses
  add constraint licenses_stripe_session_id_key unique (stripe_session_id);

alter table only public.validation_tokens
  add constraint validation_tokens_pkey primary key (hardware_id, license_id);

create index idx_devices_active
  on public.devices using btree (license_id, is_active);
create index idx_devices_hardware_id
  on public.devices using btree (hardware_id);
create index idx_devices_license_id
  on public.devices using btree (license_id);

create index idx_email_events_created_at
  on public.email_events using btree (created_at desc);
create index idx_email_events_status
  on public.email_events using btree (status);
create index idx_email_events_to_email
  on public.email_events using btree (to_email);
create index idx_email_events_type
  on public.email_events using btree (type);

create index idx_events_created_at
  on public.license_events using btree (created_at desc);
create index idx_events_license_id
  on public.license_events using btree (license_id);

create index idx_licenses_abacatepay_checkout_id
  on public.licenses using btree (abacatepay_checkout_id);
create index idx_licenses_abacatepay_subscription_id
  on public.licenses using btree (abacatepay_subscription_id);
create index idx_licenses_email
  on public.licenses using btree (email);
create index idx_licenses_payment_id
  on public.licenses using btree (asaas_payment_id);
create index idx_licenses_status
  on public.licenses using btree (status);

create trigger trg_licenses_updated_at
before update on public.licenses
for each row execute function public.update_updated_at();

alter table only public.devices
  add constraint devices_license_id_fkey
  foreign key (license_id) references public.licenses(id) on delete cascade;

alter table only public.license_events
  add constraint license_events_license_id_fkey
  foreign key (license_id) references public.licenses(id) on delete set null;

alter table only public.validation_tokens
  add constraint validation_tokens_license_id_fkey
  foreign key (license_id) references public.licenses(id) on delete cascade;

alter table public.devices enable row level security;
alter table public.email_events enable row level security;
alter table public.license_events enable row level security;
alter table public.licenses enable row level security;
alter table public.validation_tokens enable row level security;

create policy no_public_access
  on public.devices
  for all
  to anon
  using (false);

-- Producao nao possui policy em email_events. Com RLS habilitado, a tabela
-- permanece em default-deny para anon/authenticated e e usada via service_role.

create policy no_public_access
  on public.license_events
  for all
  to anon
  using (false);

create policy no_public_access
  on public.licenses
  for all
  to anon
  using (false);

create policy no_public_access
  on public.validation_tokens
  for all
  to anon
  using (false);

grant usage on schema public to postgres;
grant usage on schema public to anon;
grant usage on schema public to authenticated;
grant usage on schema public to service_role;

grant all on function public.cleanup_expired_tokens() to anon;
grant all on function public.cleanup_expired_tokens() to authenticated;
grant all on function public.cleanup_expired_tokens() to service_role;

grant all on function public.update_updated_at() to anon;
grant all on function public.update_updated_at() to authenticated;
grant all on function public.update_updated_at() to service_role;

grant all on table public.devices to anon;
grant all on table public.devices to authenticated;
grant all on table public.devices to service_role;

grant all on table public.email_events to anon;
grant all on table public.email_events to authenticated;
grant all on table public.email_events to service_role;

grant all on table public.license_events to anon;
grant all on table public.license_events to authenticated;
grant all on table public.license_events to service_role;

grant all on table public.licenses to anon;
grant all on table public.licenses to authenticated;
grant all on table public.licenses to service_role;

grant all on table public.validation_tokens to anon;
grant all on table public.validation_tokens to authenticated;
grant all on table public.validation_tokens to service_role;

alter default privileges for role postgres in schema public
  grant all on sequences to postgres, anon, authenticated, service_role;
alter default privileges for role supabase_admin in schema public
  grant all on sequences to postgres, anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges for role supabase_admin in schema public
  grant all on functions to postgres, anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges for role supabase_admin in schema public
  grant all on tables to postgres, anon, authenticated, service_role;
