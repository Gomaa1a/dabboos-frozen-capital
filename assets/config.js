// Dabboos Frozen Capital — runtime config
// When Supabase is wired, fill these in and set USE_MOCK to false.
// The anon key is safe to expose publicly *only* with RLS enabled (read-only policies).
window.DDS_CONFIG = {
  SUPABASE_URL: "",            // e.g. https://xxxx.supabase.co
  SUPABASE_ANON_KEY: "",       // anon public key (RLS-protected, read-only)
  USE_MOCK: true,              // true = show built-in demo data; false = read live from Supabase
  CURRENCY: "IQD",
  PRODUCTS_PAGE_SIZE: 25
};
