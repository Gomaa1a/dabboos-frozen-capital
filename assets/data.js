// Data layer. Reads live from Supabase (PostgREST) when configured,
// otherwise falls back to the built-in demo data in mock.js.
// Live schema (see supabase/schema.sql):
//   dead_stock_snapshots(key text pk, data jsonb, updated_at)
//   dead_stock_products(name, category, brand, on_hand, value, idle_days, sold_90, peak_ar, peak_en, status, ...)
window.DDS = (function () {
  const C = window.DDS_CONFIG || {};
  const LIVE = !C.USE_MOCK && C.SUPABASE_URL && C.SUPABASE_ANON_KEY;
  const mode = LIVE ? "live" : "mock";

  function headers() {
    return { apikey: C.SUPABASE_ANON_KEY, Authorization: "Bearer " + C.SUPABASE_ANON_KEY };
  }
  async function rest(path) {
    const res = await fetch(C.SUPABASE_URL + "/rest/v1/" + path, { headers: headers() });
    if (!res.ok) throw new Error("Supabase " + res.status);
    return res;
  }

  let _snap = null;
  async function snapshots() {
    if (_snap) return _snap;
    if (!LIVE) {
      const m = window.DDS_MOCK;
      _snap = {
        buckets: m.buckets, total_stock_value: m.total_stock_value,
        by_category: m.by_category, by_brand: m.by_brand,
        category_table: m.category_table, brand_table: m.brand_table,
        seasonality: m.seasonality
      };
      return _snap;
    }
    const res = await rest("dead_stock_snapshots?select=key,data");
    const rows = await res.json();
    _snap = {};
    rows.forEach(r => { _snap[r.key] = r.data; });
    return _snap;
  }

  async function overview() {
    const s = await snapshots();
    return { buckets: s.buckets, total_stock_value: s.total_stock_value, by_category: s.by_category, by_brand: s.by_brand };
  }
  async function categories() {
    const s = await snapshots();
    return { category_table: s.category_table, brand_table: s.brand_table };
  }
  async function seasonality() {
    const s = await snapshots();
    return s.seasonality;
  }

  async function products(opts) {
    const o = Object.assign({ search: "", status: "all", sort: "value", page: 1, pageSize: C.PRODUCTS_PAGE_SIZE || 25 }, opts);
    if (!LIVE) {
      let rows = window.DDS_MOCK.products.slice();
      if (o.status !== "all") rows = rows.filter(p => p.status === o.status);
      if (o.search) {
        const q = o.search.trim();
        rows = rows.filter(p => p.name.includes(q) || p.brand.includes(q) || p.cat.includes(q));
      }
      rows.sort((a, b) => o.sort === "idle" ? b.idle - a.idle : b.value - a.value);
      const total = rows.length;
      const start = (o.page - 1) * o.pageSize;
      return { rows: rows.slice(start, start + o.pageSize), total, page: o.page, pageSize: o.pageSize };
    }
    const sortCol = o.sort === "idle" ? "idle_days" : "value";
    let path = "dead_stock_products?select=name,category,brand,on_hand,value,idle_days,sold_90,peak_ar,peak_en,status";
    if (o.status !== "all") path += "&status=eq." + o.status;
    if (o.search) {
      const q = encodeURIComponent("*" + o.search.trim() + "*");
      path += `&or=(name.ilike.${q},brand.ilike.${q},category.ilike.${q})`;
    }
    path += `&order=${sortCol}.desc&limit=${o.pageSize}&offset=${(o.page - 1) * o.pageSize}`;
    const res = await fetch(C.SUPABASE_URL + "/rest/v1/" + path, { headers: Object.assign(headers(), { Prefer: "count=exact" }) });
    if (!res.ok) throw new Error("Supabase " + res.status);
    const rows = (await res.json()).map(r => ({
      name: r.name, cat: r.category, brand: r.brand, qty: r.on_hand, value: r.value,
      idle: r.idle_days, sold90: r.sold_90, peak_ar: r.peak_ar, peak_en: r.peak_en, status: r.status
    }));
    const cr = res.headers.get("content-range") || "0-0/0";
    const total = parseInt(cr.split("/")[1], 10) || rows.length;
    return { rows, total, page: o.page, pageSize: o.pageSize };
  }

  async function productsTotal() {
    const s = await snapshots();
    return (s.meta && s.meta.products_total) || window.DDS_MOCK.products_total;
  }

  return { mode, overview, categories, seasonality, products, productsTotal };
})();
