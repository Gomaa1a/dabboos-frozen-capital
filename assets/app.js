(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let lang = localStorage.getItem("dds_lang") || "ar";
  let prodPage = 1;

  // --- tiny inline icon set (no external font dependency) ---
  const ICONS = {
    snowflake: 'M12 2v20M4.2 7l15.6 10M19.8 7L4.2 17M12 5l3 2-3 2-3-2zM12 19l3-2-3-2-3 2z',
    moon: 'M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z',
    sun: 'M12 5V3M12 21v-2M5 12H3M21 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M18 6l1.5-1.5M4.5 19.5L6 18M12 8a4 4 0 100 8 4 4 0 000-8z',
    dashboard: 'M4 13h6V4H4zM14 9h6V4h-6zM14 20h6v-9h-6zM4 20h6v-5H4z',
    category: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
    box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
    calendar: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
    flame: 'M12 3c1 4 5 5 5 9a5 5 0 11-10 0c0-2 1-3 2-4 0 2 1 3 3 3 0-3-1-5 0-8z',
    clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
    discount: 'M9 3H5a2 2 0 00-2 2v4l12 12 6-6L9 3zM7.5 7.5h.01'
  };
  function svg(name) {
    return `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name] || ''}"/></svg>`;
  }
  function paintIcons() { $$("[data-icon]").forEach(el => el.innerHTML = svg(el.dataset.icon)); }

  // --- formatting ---
  const cur = (window.DDS_CONFIG && window.DDS_CONFIG.CURRENCY) || "IQD";
  function fmt(n) { return n >= 1000 ? (n / 1000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1") + "B" : Math.round(n) + "M"; }
  function money(n) { return cur + " " + fmt(n); }
  const t = (ar, en) => lang === "ar" ? ar : en;
  function nm(o) { return lang === "ar" ? o.name_ar : o.name_en; }

  // --- theme ---
  function applyTheme(th) {
    document.documentElement.classList.toggle("light", th === "light");
    localStorage.setItem("dds_theme", th);
    $("#themeToggle").innerHTML = svg(th === "light" ? "moon" : "sun");
  }
  $("#themeToggle").addEventListener("click", () => applyTheme(document.documentElement.classList.contains("light") ? "dark" : "light"));

  // --- language ---
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    $("#langToggle").textContent = lang === "ar" ? "EN" : "ع";
    $$("[data-en]").forEach(el => {
      if (!el.dataset.ar) el.dataset.ar = el.textContent.trim();
      el.textContent = lang === "ar" ? el.dataset.ar : el.dataset.en;
    });
    localStorage.setItem("dds_lang", lang);
  }
  $("#langToggle").addEventListener("click", () => { lang = lang === "ar" ? "en" : "ar"; applyLang(); renderAll(); });

  // --- tabs ---
  function show(tab) {
    $$(".navtab").forEach(b => b.setAttribute("aria-selected", b.dataset.t === tab));
    $$("section[data-page]").forEach(s => s.hidden = s.dataset.page !== tab);
    localStorage.setItem("dds_tab", tab);
  }
  $$(".navtab").forEach(b => b.addEventListener("click", () => show(b.dataset.t)));

  // --- bars helper ---
  function bars(el, rows, color) {
    const max = Math.max(...rows.map(r => r.v), 1);
    $(el).innerHTML = rows.map(r => `<div class="bar-row">
      <span class="lbl">${nm(r)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${r.v / max * 100}%;background:${color}"></div></div>
      <span class="val">${fmt(r.v)}</span></div>`).join("");
  }

  // --- OVERVIEW ---
  const CUT_LABELS = [["60+ يوم", "60+ days"], ["90+ يوم", "90+ days"], ["180+ يوم", "180+ days"]];
  let OV = null;
  function renderOverview() {
    if (!OV) return;
    const cut = +$("#thresh").value;
    const inc = OV.buckets.filter(b => b.min >= cut);
    const dead = inc.reduce((s, b) => s + b.dead, 0);
    const dorm = inc.reduce((s, b) => s + b.dorm, 0);
    const sku = inc.reduce((s, b) => s + b.sku, 0);
    $("#kDead").textContent = money(dead);
    $("#kSku").textContent = sku.toLocaleString();
    $("#kDorm").textContent = money(dorm);
    $("#kPct").textContent = Math.round(dead / OV.total_stock_value * 100) + "%";
    $("#threshOut").textContent = t(CUT_LABELS[cut][0], CUT_LABELS[cut][1]);
    const maxB = Math.max(...OV.buckets.map(b => b.dead + b.dorm), 1);
    $("#buckets").innerHTML = OV.buckets.map(b => {
      const on = b.min >= cut;
      return `<div class="bucket" style="opacity:${on ? 1 : .4}">
        <div class="bucket-head"><span>${t(b.label_ar, b.label_en)} · <span class="sku">${b.sku} ${t("منتج", "SKUs")}</span></span>
        <span>${money(b.dead + b.dorm)}</span></div>
        <div class="bucket-bar">
          <div class="dead" style="width:${b.dead / maxB * 100}%"></div>
          <div class="dorm" style="width:${b.dorm / maxB * 100}%"></div>
        </div></div>`;
    }).join("") + `<div class="legend">
      <span><span class="dot" style="background:var(--danger)"></span>${t("راكد فعلاً", "truly dead")}</span>
      <span><span class="dot" style="background:var(--warning)"></span>${t("نائم موسمي", "dormant / seasonal")}</span></div>`;
    bars("#byCat", OV.by_category, "var(--danger)");
    bars("#byBrand", OV.by_brand, "var(--accent)");
  }
  $("#thresh").addEventListener("input", renderOverview);

  // --- CATEGORIES / BRANDS ---
  let CAT = null;
  function renderCategories() {
    if (!CAT) return;
    $("#catTable").innerHTML = `<table class="mk"><thead><tr>
      <th>${t("الفئة", "Category")}</th><th>SKUs</th><th>${t("قيمة المخزون", "Stock value")}</th>
      <th>${t("راكد", "Dead")}</th><th>${t("% راكد", "% dead")}</th><th>${t("الموسم", "Season")}</th></tr></thead><tbody>` +
      CAT.category_table.map(r => `<tr><td>${nm(r)}</td><td>${r.sku}</td><td>${money(r.val)}</td>
      <td style="color:var(--danger)">${money(r.dead)}</td><td>${Math.round(r.dead / r.val * 100)}%</td>
      <td style="color:var(--txt2)">${t(r.season_ar, r.season_en)}</td></tr>`).join("") + `</tbody></table>`;
    $("#brandTable").innerHTML = `<table class="mk"><thead><tr>
      <th>${t("البراند", "Brand")}</th><th>SKUs</th><th>${t("قيمة المخزون", "Stock value")}</th>
      <th>${t("راكد", "Dead")}</th><th>${t("% راكد", "% dead")}</th></tr></thead><tbody>` +
      CAT.brand_table.map(r => `<tr><td>${nm(r)}</td><td>${r.sku}</td><td>${money(r.val)}</td>
      <td style="color:var(--danger)">${money(r.dead)}</td><td>${Math.round(r.dead / r.val * 100)}%</td></tr>`).join("") + `</tbody></table>`;
  }

  // --- PRODUCTS ---
  const ST = { dead: ["راكد", "dead", "b-dead"], dormant: ["نائم", "dormant", "b-dorm"], oos: ["انتهى موسمه", "out of season", "b-oos"] };
  async function renderProducts() {
    const opts = { search: $("#search").value, status: $("#fStatus").value, sort: $("#fSort").value, page: prodPage };
    let res;
    try { res = await DDS.products(opts); }
    catch (e) { $("#prodTable").innerHTML = `<p class="muted-note">${t("تعذّر تحميل البيانات", "Could not load data")}: ${e.message}</p>`; return; }
    $("#prodTable").innerHTML = `<table class="mk"><thead><tr>
      <th>${t("المنتج", "Product")}</th><th>${t("الفئة", "Category")}</th><th>${t("البراند", "Brand")}</th>
      <th>${t("المخزون", "On hand")}</th><th>${t("القيمة", "Value")}</th><th>${t("أيام ركود", "Idle days")}</th>
      <th>${t("مبيعات 90ي", "90d sales")}</th><th>${t("ذروة", "Peak")}</th><th>${t("الحالة", "Status")}</th></tr></thead><tbody>` +
      res.rows.map(p => `<tr><td>${p.name}</td><td style="color:var(--txt2)">${p.cat}</td><td style="color:var(--txt2)">${p.brand}</td>
      <td>${p.qty}</td><td>${money(p.value)}</td><td>${p.idle}</td><td>${p.sold90}</td>
      <td style="color:var(--txt2)">${t(p.peak_ar || p.peak || "", p.peak_en || p.peak || "")}</td>
      <td><span class="badge ${ST[p.status][2]}">${t(ST[p.status][0], ST[p.status][1])}</span></td></tr>`).join("") + `</tbody></table>`;
    const pages = Math.max(1, Math.ceil(res.total / res.pageSize));
    $("#pageInfo").textContent = `${t("صفحة", "page")} ${res.page} / ${pages} · ${res.total.toLocaleString()} ${t("منتج", "items")}`;
    $("#prevPage").disabled = res.page <= 1;
    $("#nextPage").disabled = res.page >= pages;
  }
  ["#search", "#fStatus", "#fSort"].forEach(s => $(s).addEventListener("input", () => { prodPage = 1; renderProducts(); }));
  $("#prevPage").addEventListener("click", () => { if (prodPage > 1) { prodPage--; renderProducts(); } });
  $("#nextPage").addEventListener("click", () => { prodPage++; renderProducts(); });

  // --- SEASONALITY ---
  let SEA = null;
  function renderSeasonality() {
    if (!SEA) return;
    const months = lang === "ar" ? SEA.months_ar : SEA.months_en;
    const ramp = ["var(--bg3)", "#1d7a5e", "#16a37a", "#34d399"];
    let html = `<div class="hm-grid" style="grid-template-columns:90px repeat(12,1fr)"><span></span>` +
      months.map(m => `<span class="hm-mlabel">${m}</span>`).join("");
    SEA.rows.forEach(r => {
      html += `<span class="hm-rlabel">${nm(r)}</span>` +
        r.d.map((v, i) => `<div class="hm-cell" title="${nm(r)} — ${months[i]}: ${v}" style="background:${ramp[v]}"></div>`).join("");
    });
    html += `</div>`;
    $("#heatmap").innerHTML = html;
    $("#seasNow").textContent = t(SEA.now.ar, SEA.now.en);
    $("#seasSoon").textContent = t(SEA.soon.ar, SEA.soon.en);
    $("#seasOos").textContent = t(SEA.oos.ar, SEA.oos.en);
  }

  function renderAll() { renderOverview(); renderCategories(); renderSeasonality(); renderProducts(); }

  // --- boot ---
  async function boot() {
    paintIcons();
    applyTheme(localStorage.getItem("dds_theme") || "dark");
    applyLang();
    const statusEl = $("#dataStatus"), footEl = $("#footMode");
    if (DDS.mode === "live") { statusEl.className = "pill pill-live"; statusEl.textContent = t("بيانات مباشرة", "live data"); }
    else { statusEl.className = "pill pill-mock"; statusEl.textContent = t("بيانات تجريبية", "demo data"); }
    footEl.textContent = DDS.mode === "live" ? "Supabase" : "mock";
    try {
      OV = await DDS.overview();
      CAT = await DDS.categories();
      SEA = await DDS.seasonality();
    } catch (e) {
      statusEl.className = "pill pill-mock"; statusEl.textContent = t("خطأ بالاتصال", "connection error");
    }
    renderAll();
    show(localStorage.getItem("dds_tab") || "ov");
  }
  boot();
})();
