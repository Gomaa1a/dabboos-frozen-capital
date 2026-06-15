# Dabboos — Frozen Capital (Dead-Stock Dashboard)

داشبورد للمنتجات الراكدة (التي لم تُسحب) لشركة دبوس. يفصل رأس المال المجمّد إلى **راكد فعلاً** و**نائم موسمي**، ويصنّفه حسب الفئة والبراند، مع تحليل موسمية.

A dashboard for unsold / dead stock at Dabboos. It splits frozen capital into **truly dead** vs **dormant (seasonal)** stock, breaks it down by category and brand, and adds seasonality analysis.

## Pages
1. **Overview** — frozen-capital KPIs, aging buckets (60–90 / 90–180 / 180+) split dead vs dormant, with a live idle-threshold slider; dead value by category & brand.
2. **Categories & brands** — per-category and per-brand tables with stock value, dead %, and season.
3. **Products** — paginated, searchable explorer with status badges (dead / dormant / out of season).
4. **Seasonality** — monthly sales-intensity heatmap per category + a "peaking now / waking up / clear it now" calendar.

## Stack
- Static HTML/CSS/JS (no build step). Bilingual AR/EN, dark/light theme.
- Reads from **Supabase** (PostgREST, anon key + RLS, read-only) — see `supabase/schema.sql`.
- Data is filled by an **n8n** workflow that pulls bounded, aggregated data from Odoo (`stock.quant`, `sale.order.line`, `product.template`, `product.category`, `product.brand`, `stock.valuation.layer`).

## Running locally
Just open `index.html`, or serve the folder:
```
npx serve .
```
It ships with built-in demo data (`assets/mock.js`) so it renders before Supabase is connected.

## Going live
1. Run `supabase/schema.sql` in your Supabase project.
2. Put your project URL + anon key in `assets/config.js` and set `USE_MOCK: false`.
3. Point the n8n workflow at `dead_stock_snapshots` and `dead_stock_products` (service_role key).

Bump the `?v=N` query string in `index.html` whenever you change JS/CSS (cache-busting).
