-- ═══════════════════════════════════════════════
-- AIDEN PLATFORM — Supabase Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── CUSTOMERS ──────────────────────────────────
create table public.customers (
  id                  uuid primary key default uuid_generate_v4(),
  clerk_user_id       text unique not null,
  stripe_customer_id  text unique,
  email               text not null,
  name                text,
  phone               text,
  avatar_url          text,
  plan                text default 'free',
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- ── SUBSCRIPTIONS ──────────────────────────────
create table public.subscriptions (
  id                    uuid primary key default uuid_generate_v4(),
  customer_id           uuid references public.customers(id) on delete cascade,
  stripe_sub_id         text unique not null,
  stripe_price_id       text,
  plan_name             text,
  status                text not null default 'active',
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  cancel_at_period_end  boolean default false,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ── DOMAINS ────────────────────────────────────
create table public.domains (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid references public.customers(id) on delete cascade,
  domain       text not null,
  registrar    text default 'namecom',
  status       text default 'active',
  expires_at   timestamptz,
  auto_renew   boolean default true,
  nameservers  text[],
  namecom_id   text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── MAILBOXES ──────────────────────────────────
create table public.mailboxes (
  id                uuid primary key default uuid_generate_v4(),
  customer_id       uuid references public.customers(id) on delete cascade,
  domain_id         uuid references public.domains(id) on delete set null,
  address           text unique not null,
  quota_mb          integer default 5000,
  status            text default 'active',
  titan_account_id  text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ── SITES ──────────────────────────────────────
create table public.sites (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid references public.customers(id) on delete cascade,
  domain_id    uuid references public.domains(id) on delete set null,
  name         text not null,
  type         text default 'static',
  platform     text,
  deploy_url   text,
  status       text default 'active',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── TICKETS ────────────────────────────────────
create table public.tickets (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid references public.customers(id) on delete cascade,
  ticket_num   text unique not null,
  subject      text not null,
  message      text not null,
  status       text default 'open',
  priority     text default 'normal',
  category     text default 'general',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── TICKET REPLIES ─────────────────────────────
create table public.ticket_replies (
  id               uuid primary key default uuid_generate_v4(),
  ticket_id        uuid references public.tickets(id) on delete cascade,
  author_clerk_id  text not null,
  is_admin         boolean default false,
  message          text not null,
  created_at       timestamptz default now()
);

-- ── BILLING DETAILS ────────────────────────────
create table public.billing_details (
  id             uuid primary key default uuid_generate_v4(),
  customer_id    uuid unique references public.customers(id) on delete cascade,
  name           text,
  vat            text,
  address        text,
  billing_email  text,
  phone          text,
  updated_at     timestamptz default now()
);

-- ═══════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════

alter table public.customers       enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.domains         enable row level security;
alter table public.mailboxes       enable row level security;
alter table public.sites           enable row level security;
alter table public.tickets         enable row level security;
alter table public.ticket_replies  enable row level security;
alter table public.billing_details enable row level security;

-- Note: With Clerk, we use service role key in API routes
-- and don't rely on Supabase auth JWT. RLS policies use
-- a custom function that reads the clerk_user_id from request headers.

-- ═══════════════════════════════════════════════
-- TICKET NUMBER FUNCTION
-- ═══════════════════════════════════════════════
create or replace function generate_ticket_num()
returns trigger as $$
declare
  year_str text := to_char(now(), 'YYYY');
  seq_num  int;
  ticket_n text;
begin
  select count(*) + 1 into seq_num
  from public.tickets
  where created_at >= date_trunc('year', now());
  
  ticket_n := 'TK' || year_str || lpad(seq_num::text, 4, '0');
  new.ticket_num := ticket_n;
  return new;
end;
$$ language plpgsql;

create trigger set_ticket_num
  before insert on public.tickets
  for each row execute function generate_ticket_num();

-- ═══════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════════
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_customers_updated_at       before update on public.customers       for each row execute function update_updated_at();
create trigger update_subscriptions_updated_at   before update on public.subscriptions   for each row execute function update_updated_at();
create trigger update_domains_updated_at         before update on public.domains         for each row execute function update_updated_at();
create trigger update_mailboxes_updated_at       before update on public.mailboxes       for each row execute function update_updated_at();
create trigger update_sites_updated_at           before update on public.sites           for each row execute function update_updated_at();
create trigger update_tickets_updated_at         before update on public.tickets         for each row execute function update_updated_at();
create trigger update_billing_details_updated_at before update on public.billing_details for each row execute function update_updated_at();
