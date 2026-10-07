import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** true quando .env.local (ou os secrets do CI) definem URL e chave anon. */
export const supabaseEnabled = Boolean(url && key);

let client: SupabaseClient | null = null;

/** Client único do Supabase. Só chame quando `supabaseEnabled` for true. */
export function getSupabase(): SupabaseClient {
  if (!url || !key) throw new Error('Supabase não configurado (defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)');
  client ??= createClient(url, key, { auth: { persistSession: false } });
  return client;
}
