// Client Supabase de l'espace client (navigateur uniquement).
// La clé publique est faite pour être exposée : l'accès aux données est limité par les règles RLS
// (voir supabase/migrations), chaque client ne voit que ses propres dossiers et documents.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://xxmpdprtwigzchwkxdiv.supabase.co";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "sb_publishable_FPqEnpT1UL3ndrZVkYxvAw_o6q3IS7T";

let client: SupabaseClient | null = null;

export function supabase() {
  if (!client) client = createClient(URL, KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "mziane-auth" } });
  return client;
}
