/**
 * Supabase Client
 * Single Supabase instance for the entire app.
 *
 * Safe to import even when env vars are not yet configured —
 * exports `null` until EXPO_PUBLIC_SUPABASE_URL is set.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { Database } from './types/database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Will be `null` until you set EXPO_PUBLIC_SUPABASE_URL and
 * EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.
 * All downstream code (sync.ts, profile$.ts) handles the null case.
 */
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

if (!supabase) {
  console.warn(
    '[Supabase] No URL/key found — running in local-only mode. ' +
    'Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable sync.'
  );
}
