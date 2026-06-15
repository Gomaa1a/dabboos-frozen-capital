// Dabboos Frozen Capital — runtime config
// The anon key is safe to expose publicly because RLS only allows read.
window.DDS_CONFIG = {
  SUPABASE_URL: "https://uippvtncxsnigadtsgbc.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcHB2dG5jeHNuaWdhZHRzZ2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NDA4MDgsImV4cCI6MjA5NzExNjgwOH0.LWtcPXEcYHIIACkUV_kZSuzUeE4Y8Y6UgMZMSBLp-jU",
  USE_MOCK: false,             // true = built-in demo data; false = live from Supabase
  CURRENCY: "IQD",
  PRODUCTS_PAGE_SIZE: 25
};
