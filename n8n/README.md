# n8n — Dead Stock Sync (Frozen Capital)

`Dead_Stock_Sync.workflow.json` pulls bounded, **server-aggregated** data from Odoo and upserts it into the Supabase tables the dashboard reads.

## Why JSON-RPC `read_group` (not the Odoo getAll node)
There are too many products/sale lines to pull row-by-row. Each Odoo call here is a `read_group` over the JSON-RPC endpoint, so Odoo does the aggregation and returns one row **per product** (or per product×month), not raw records.

## Flow
`Config → Odoo Auth → Stock (read_group) → Products (read) → Brands (read) → Sales Monthly (read_group) → Sales 90d (read_group) → Build Dead Stock → upsert snapshots + products`

- **Stock** — `stock.quant` grouped by product, internal locations, qty>0 → on-hand + valuation.
- **Products** — `product.product` read → name, category, cost, template id.
- **Brands** — reads the brand field on `product.template` (set in Config). Has `continueOnFail`, so a wrong field name won't break the run — brand just shows `—` until corrected.
- **Sales Monthly** — `sale.order.line` grouped by product × month (confirmed orders only) → last-sale date, total, seasonality profile.
- **Sales 90d** — same, last 90 days → recent velocity.
- **Build** — classifies each stuck product (dead / dormant / out-of-season), rolls up aging buckets + category + brand + seasonality (values in **millions IQD**, matching the dashboard), and writes `dead_stock_snapshots` + `dead_stock_products`.

## Setup (after import into your localhost n8n)
Fill the **Config** node:
1. `odooDb` — your Odoo database name.
2. `odooLogin` — your Odoo login email.
3. `odooApiKey` — an Odoo API key (Preferences → Account Security → New API Key). The JSON-RPC calls authenticate with this.
4. `serviceKey` — the Supabase **service_role** key (Settings → API). Needed to write; never commit it.
5. `brandModel` / `brandField` — confirm the brand field. Default `product.template` / `product_brand_id`. If different, fix it here only.
6. `monthsBack` / `deadDays` / `stuckDays` — tuning (default 12 / 90 / 60).

Then **Execute workflow** once and check the dashboard. Schedule trigger is every 6h (adjust as needed).

## Things to verify on first run
- If **Stock** returns nothing: your `stock.quant` may need a different location filter — tell me and I'll adjust the domain.
- If **value** is 0 for products: Odoo valuation isn't stored on quants; the Build node already falls back to `on_hand × standard_price`.
- If **Brands** errors: confirm the real brand field name and put it in `brandField`.
