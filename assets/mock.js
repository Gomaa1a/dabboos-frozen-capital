// Built-in demo data so the dashboard renders before Supabase is connected.
// Shapes here MATCH what data.js expects from the live snapshots/tables.
// Values are in millions of IQD (the UI formats B/M).
window.DDS_MOCK = {
  // aging buckets: min = threshold index it belongs to (0=60+,1=90+,2=180+)
  buckets: [
    { key: "60-90",  label_ar: "60 – 90 يوم",  label_en: "60 – 90 days",  dead: 510, dorm: 180, sku: 159, min: 0 },
    { key: "90-180", label_ar: "90 – 180 يوم", label_en: "90 – 180 days", dead: 720, dorm: 250, sku: 144, min: 1 },
    { key: "180+",   label_ar: "180+ يوم",     label_en: "180+ days",     dead: 610, dorm: 210, sku: 168, min: 2 }
  ],
  total_stock_value: 8000,
  by_category: [
    { name_ar: "مكيفات", name_en: "Air conditioners", v: 420 },
    { name_ar: "دفايات", name_en: "Heaters", v: 380 },
    { name_ar: "ثلاجات", name_en: "Refrigerators", v: 310 },
    { name_ar: "غسالات", name_en: "Washing machines", v: 260 },
    { name_ar: "أجهزة صغيرة", name_en: "Small appliances", v: 190 },
    { name_ar: "تلفزيونات", name_en: "TVs", v: 150 },
    { name_ar: "أدوات مطبخ", name_en: "Kitchenware", v: 90 }
  ],
  by_brand: [
    { name_ar: "Samsung", name_en: "Samsung", v: 360 },
    { name_ar: "LG", name_en: "LG", v: 300 },
    { name_ar: "Beko", name_en: "Beko", v: 240 },
    { name_ar: "Toshiba", name_en: "Toshiba", v: 210 },
    { name_ar: "Haier", name_en: "Haier", v: 160 },
    { name_ar: "أخرى", name_en: "Other", v: 170 }
  ],
  category_table: [
    { name_ar: "مكيفات", name_en: "Air conditioners", sku: 64, val: 1820, dead: 420, season_ar: "صيف", season_en: "Summer" },
    { name_ar: "دفايات", name_en: "Heaters", sku: 51, val: 1240, dead: 380, season_ar: "شتاء", season_en: "Winter" },
    { name_ar: "ثلاجات", name_en: "Refrigerators", sku: 48, val: 1610, dead: 310, season_ar: "صيف خفيف", season_en: "Mild summer" },
    { name_ar: "غسالات", name_en: "Washing machines", sku: 39, val: 1180, dead: 260, season_ar: "ثابت", season_en: "Flat" },
    { name_ar: "أجهزة صغيرة", name_en: "Small appliances", sku: 72, val: 740, dead: 190, season_ar: "رمضان", season_en: "Ramadan" },
    { name_ar: "تلفزيونات", name_en: "TVs", sku: 33, val: 980, dead: 150, season_ar: "رمضان/نهاية السنة", season_en: "Ramadan / year-end" },
    { name_ar: "أدوات مطبخ", name_en: "Kitchenware", sku: 58, val: 430, dead: 90, season_ar: "رمضان", season_en: "Ramadan" }
  ],
  brand_table: [
    { name_ar: "Samsung", name_en: "Samsung", sku: 88, val: 2100, dead: 360 },
    { name_ar: "LG", name_en: "LG", sku: 71, val: 1740, dead: 300 },
    { name_ar: "Beko", name_en: "Beko", sku: 64, val: 1280, dead: 240 },
    { name_ar: "Toshiba", name_en: "Toshiba", sku: 52, val: 1020, dead: 210 },
    { name_ar: "Haier", name_en: "Haier", sku: 47, val: 860, dead: 160 }
  ],
  products: [
    { name: "مكيف سبليت 1.5 طن", cat: "مكيفات", brand: "Samsung", qty: 42, value: 520, idle: 74, sold90: 3, peak_ar: "يونيو–أغسطس", peak_en: "Jun–Aug", status: "dormant" },
    { name: "دفاية غاز 3 شعلة", cat: "دفايات", brand: "Beko", qty: 88, value: 310, idle: 118, sold90: 0, peak_ar: "ديسمبر–فبراير", peak_en: "Dec–Feb", status: "oos" },
    { name: "خلاط يدوي 400 واط", cat: "أجهزة صغيرة", brand: "Haier", qty: 130, value: 95, idle: 211, sold90: 0, peak_ar: "لا نمط واضح", peak_en: "No pattern", status: "dead" },
    { name: "تلفزيون 43 بوصة", cat: "تلفزيونات", brand: "LG", qty: 24, value: 240, idle: 96, sold90: 2, peak_ar: "رمضان", peak_en: "Ramadan", status: "dormant" },
    { name: "غسالة أوتوماتيك 7كجم", cat: "غسالات", brand: "Toshiba", qty: 17, value: 280, idle: 142, sold90: 1, peak_ar: "ثابت", peak_en: "Flat", status: "dead" },
    { name: "مروحة عمود", cat: "أجهزة صغيرة", brand: "أخرى", qty: 64, value: 70, idle: 63, sold90: 5, peak_ar: "يونيو–أغسطس", peak_en: "Jun–Aug", status: "dormant" },
    { name: "ثلاجة نوفروست 16 قدم", cat: "ثلاجات", brand: "Samsung", qty: 9, value: 190, idle: 188, sold90: 0, peak_ar: "صيف خفيف", peak_en: "Mild summer", status: "dead" },
    { name: "سخان مياه 50 لتر", cat: "أجهزة صغيرة", brand: "Beko", qty: 31, value: 150, idle: 205, sold90: 0, peak_ar: "شتاء", peak_en: "Winter", status: "oos" },
    { name: "ميكروويف 25 لتر", cat: "أجهزة صغيرة", brand: "LG", qty: 40, value: 110, idle: 88, sold90: 1, peak_ar: "رمضان", peak_en: "Ramadan", status: "dead" },
    { name: "مكيف شباك 1 طن", cat: "مكيفات", brand: "Haier", qty: 19, value: 230, idle: 70, sold90: 4, peak_ar: "يونيو–أغسطس", peak_en: "Jun–Aug", status: "dormant" },
    { name: "تلفزيون 55 بوصة سمارت", cat: "تلفزيونات", brand: "Samsung", qty: 12, value: 360, idle: 134, sold90: 0, peak_ar: "نهاية السنة", peak_en: "Year-end", status: "dead" },
    { name: "غسالة نصف أوتوماتيك", cat: "غسالات", brand: "أخرى", qty: 26, value: 130, idle: 167, sold90: 0, peak_ar: "ثابت", peak_en: "Flat", status: "dead" }
  ],
  products_total: 4180,
  seasonality: {
    months_ar: ["ي","ف","م","أ","و","ن","ل","غ","س","ك","ب","د"],
    months_en: ["J","F","M","A","M","J","J","A","S","O","N","D"],
    rows: [
      { name_ar: "مكيفات", name_en: "Air conditioners", d: [0,0,1,1,2,3,3,3,2,1,0,0] },
      { name_ar: "دفايات", name_en: "Heaters", d: [3,3,1,0,0,0,0,0,0,1,2,3] },
      { name_ar: "ثلاجات", name_en: "Refrigerators", d: [1,1,1,2,2,3,3,2,1,1,1,1] },
      { name_ar: "غسالات", name_en: "Washing machines", d: [1,1,2,1,1,2,1,1,2,1,1,2] },
      { name_ar: "تلفزيونات", name_en: "TVs", d: [1,1,1,1,1,1,1,1,1,1,2,3] },
      { name_ar: "أدوات مطبخ", name_en: "Kitchenware", d: [1,1,2,3,1,1,1,1,1,1,1,2] }
    ],
    now: { ar: "مكيفات · ثلاجات · مراوح", en: "Air conditioners · Refrigerators · Fans" },
    soon: { ar: "أدوات مدرسية (سبتمبر) · تلفزيونات", en: "School supplies (Sep) · TVs" },
    oos: { ar: "دفايات · مدافئ غاز", en: "Heaters · Gas heaters" }
  }
};
