const SUPABASE_URL = "https://jpcibhkdrdyqdfpfrcxs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwY2liaGtkcmR5cWRmcGZyY3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MDc5MTEsImV4cCI6MjA5ODI4MzkxMX0.V6-4UJ5f0NQ_IkMRRDuXIdbJwJjeb-JlK0w41YefbzI";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);