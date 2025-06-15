// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and/or Anon Key are missing. Please check your environment variables."
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Additional global options
});

// Optional: Type definitions for your database
type Database = {}; // Define your database types here if using TypeScript
export const typedSupabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
