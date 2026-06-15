-- Dabboos Frozen Capital — demo seed.
-- Run AFTER schema.sql, in the Supabase SQL editor.
-- Fills the tables with the same demo data the mock used, so the live
-- dashboard shows numbers before n8n is built. n8n later upserts real data over this.

-- ---- snapshots (aggregated panels) ----
insert into public.dead_stock_snapshots (key, data) values
('total_stock_value', $j$ 8000 $j$::jsonb),
('meta', $j$ {"products_total": 4180} $j$::jsonb),
('buckets', $j$ [
  {"label_ar":"60 – 90 يوم","label_en":"60 – 90 days","dead":510,"dorm":180,"sku":159,"min":0},
  {"label_ar":"90 – 180 يوم","label_en":"90 – 180 days","dead":720,"dorm":250,"sku":144,"min":1},
  {"label_ar":"180+ يوم","label_en":"180+ days","dead":610,"dorm":210,"sku":168,"min":2}
] $j$::jsonb),
('by_category', $j$ [
  {"name_ar":"مكيفات","name_en":"Air conditioners","v":420},
  {"name_ar":"دفايات","name_en":"Heaters","v":380},
  {"name_ar":"ثلاجات","name_en":"Refrigerators","v":310},
  {"name_ar":"غسالات","name_en":"Washing machines","v":260},
  {"name_ar":"أجهزة صغيرة","name_en":"Small appliances","v":190},
  {"name_ar":"تلفزيونات","name_en":"TVs","v":150},
  {"name_ar":"أدوات مطبخ","name_en":"Kitchenware","v":90}
] $j$::jsonb),
('by_brand', $j$ [
  {"name_ar":"Samsung","name_en":"Samsung","v":360},
  {"name_ar":"LG","name_en":"LG","v":300},
  {"name_ar":"Beko","name_en":"Beko","v":240},
  {"name_ar":"Toshiba","name_en":"Toshiba","v":210},
  {"name_ar":"Haier","name_en":"Haier","v":160},
  {"name_ar":"أخرى","name_en":"Other","v":170}
] $j$::jsonb),
('category_table', $j$ [
  {"name_ar":"مكيفات","name_en":"Air conditioners","sku":64,"val":1820,"dead":420,"season_ar":"صيف","season_en":"Summer"},
  {"name_ar":"دفايات","name_en":"Heaters","sku":51,"val":1240,"dead":380,"season_ar":"شتاء","season_en":"Winter"},
  {"name_ar":"ثلاجات","name_en":"Refrigerators","sku":48,"val":1610,"dead":310,"season_ar":"صيف خفيف","season_en":"Mild summer"},
  {"name_ar":"غسالات","name_en":"Washing machines","sku":39,"val":1180,"dead":260,"season_ar":"ثابت","season_en":"Flat"},
  {"name_ar":"أجهزة صغيرة","name_en":"Small appliances","sku":72,"val":740,"dead":190,"season_ar":"رمضان","season_en":"Ramadan"},
  {"name_ar":"تلفزيونات","name_en":"TVs","sku":33,"val":980,"dead":150,"season_ar":"رمضان/نهاية السنة","season_en":"Ramadan / year-end"},
  {"name_ar":"أدوات مطبخ","name_en":"Kitchenware","sku":58,"val":430,"dead":90,"season_ar":"رمضان","season_en":"Ramadan"}
] $j$::jsonb),
('brand_table', $j$ [
  {"name_ar":"Samsung","name_en":"Samsung","sku":88,"val":2100,"dead":360},
  {"name_ar":"LG","name_en":"LG","sku":71,"val":1740,"dead":300},
  {"name_ar":"Beko","name_en":"Beko","sku":64,"val":1280,"dead":240},
  {"name_ar":"Toshiba","name_en":"Toshiba","sku":52,"val":1020,"dead":210},
  {"name_ar":"Haier","name_en":"Haier","sku":47,"val":860,"dead":160}
] $j$::jsonb),
('seasonality', $j$ {
  "months_ar":["ي","ف","م","أ","و","ن","ل","غ","س","ك","ب","د"],
  "months_en":["J","F","M","A","M","J","J","A","S","O","N","D"],
  "rows":[
    {"name_ar":"مكيفات","name_en":"Air conditioners","d":[0,0,1,1,2,3,3,3,2,1,0,0]},
    {"name_ar":"دفايات","name_en":"Heaters","d":[3,3,1,0,0,0,0,0,0,1,2,3]},
    {"name_ar":"ثلاجات","name_en":"Refrigerators","d":[1,1,1,2,2,3,3,2,1,1,1,1]},
    {"name_ar":"غسالات","name_en":"Washing machines","d":[1,1,2,1,1,2,1,1,2,1,1,2]},
    {"name_ar":"تلفزيونات","name_en":"TVs","d":[1,1,1,1,1,1,1,1,1,1,2,3]},
    {"name_ar":"أدوات مطبخ","name_en":"Kitchenware","d":[1,1,2,3,1,1,1,1,1,1,1,2]}
  ],
  "now":{"ar":"مكيفات · ثلاجات · مراوح","en":"Air conditioners · Refrigerators · Fans"},
  "soon":{"ar":"أدوات مدرسية (سبتمبر) · تلفزيونات","en":"School supplies (Sep) · TVs"},
  "oos":{"ar":"دفايات · مدافئ غاز","en":"Heaters · Gas heaters"}
} $j$::jsonb)
on conflict (key) do update set data = excluded.data, updated_at = now();

-- ---- per-product detail (paginated explorer) ----
insert into public.dead_stock_products
  (product_id, name, category, brand, on_hand, value, idle_days, sold_90, peak_ar, peak_en, status) values
(1,'مكيف سبليت 1.5 طن','مكيفات','Samsung',42,520,74,3,'يونيو–أغسطس','Jun–Aug','dormant'),
(2,'دفاية غاز 3 شعلة','دفايات','Beko',88,310,118,0,'ديسمبر–فبراير','Dec–Feb','oos'),
(3,'خلاط يدوي 400 واط','أجهزة صغيرة','Haier',130,95,211,0,'لا نمط واضح','No pattern','dead'),
(4,'تلفزيون 43 بوصة','تلفزيونات','LG',24,240,96,2,'رمضان','Ramadan','dormant'),
(5,'غسالة أوتوماتيك 7كجم','غسالات','Toshiba',17,280,142,1,'ثابت','Flat','dead'),
(6,'مروحة عمود','أجهزة صغيرة','أخرى',64,70,63,5,'يونيو–أغسطس','Jun–Aug','dormant'),
(7,'ثلاجة نوفروست 16 قدم','ثلاجات','Samsung',9,190,188,0,'صيف خفيف','Mild summer','dead'),
(8,'سخان مياه 50 لتر','أجهزة صغيرة','Beko',31,150,205,0,'شتاء','Winter','oos'),
(9,'ميكروويف 25 لتر','أجهزة صغيرة','LG',40,110,88,1,'رمضان','Ramadan','dead'),
(10,'مكيف شباك 1 طن','مكيفات','Haier',19,230,70,4,'يونيو–أغسطس','Jun–Aug','dormant'),
(11,'تلفزيون 55 بوصة سمارت','تلفزيونات','Samsung',12,360,134,0,'نهاية السنة','Year-end','dead'),
(12,'غسالة نصف أوتوماتيك','غسالات','أخرى',26,130,167,0,'ثابت','Flat','dead')
on conflict (product_id) do update set
  name=excluded.name, category=excluded.category, brand=excluded.brand, on_hand=excluded.on_hand,
  value=excluded.value, idle_days=excluded.idle_days, sold_90=excluded.sold_90,
  peak_ar=excluded.peak_ar, peak_en=excluded.peak_en, status=excluded.status, updated_at=now();
