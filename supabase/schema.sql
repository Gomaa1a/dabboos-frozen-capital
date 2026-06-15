-- Dabboos Frozen Capital — Supabase schema
-- Run in the Supabase SQL editor. Anon role gets READ-ONLY access via RLS.

-- 1) Aggregated snapshots (one row per panel key, jsonb payload).
create table if not exists public.dead_stock_snapshots (
  key        text primary key,           -- buckets | by_category | by_brand | category_table | brand_table | seasonality | meta
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- 2) Per-product detail for the paginated explorer.
create table if not exists public.dead_stock_products (
  product_id integer primary key,        -- Odoo product.template id
  name       text,
  category   text,
  brand      text,
  on_hand    numeric,                    -- units in internal locations
  value      numeric,                    -- frozen capital at cost (millions IQD, matching snapshots)
  idle_days  integer,                    -- days since last confirmed sale
  sold_90    numeric,                    -- qty sold in last 90 days (confirmed)
  peak_ar    text,
  peak_en    text,
  status     text,                       -- dead | dormant | oos
  updated_at timestamptz not null default now()
);

create index if not exists idx_dsp_status on public.dead_stock_products (status);
create index if not exists idx_dsp_value  on public.dead_stock_products (value desc);
create index if not exists idx_dsp_idle   on public.dead_stock_products (idle_days desc);

-- RLS: anon can read, only service_role (used by n8n) can write.
alter table public.dead_stock_snapshots enable row level security;
alter table public.dead_stock_products  enable row level security;

drop policy if exists "anon read snapshots" on public.dead_stock_snapshots;
create policy "anon read snapshots" on public.dead_stock_snapshots for select to anon using (true);

drop policy if exists "anon read products" on public.dead_stock_products;
create policy "anon read products" on public.dead_stock_products for select to anon using (true);
-- (no insert/update/delete policies for anon → writes require the service_role key)
