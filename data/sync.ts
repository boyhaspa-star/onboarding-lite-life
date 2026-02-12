/**
 * Legend-State Sync Configuration
 * 
 * This configures the local-first sync engine:
 * - AsyncStorage for local persistence (Expo Go compatible)
 * - Supabase for remote persistence + realtime (when configured)
 * - Automatic offline retry with exponential backoff
 * - Diff-based sync (only changes since last sync)
 *
 * When Supabase env vars are not set, `mySynced` is `null` and
 * stores fall back to local-only observables with AsyncStorage persistence.
 *
 * SETUP:
 * 1. npm install @legendapp/state@beta react-native-get-random-values uuid
 * 2. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env
 * 3. Generate Supabase types: `supabase gen types --lang=typescript --local > data/types/database.types.ts`
 */

import { configureSynced } from '@legendapp/state/sync';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
// For Expo Go development, use AsyncStorage:
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
// For production builds with native modules, switch to MMKV:
// import { ObservablePersistMMKV } from '@legendapp/state/persist-plugins/mmkv';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

/** Generate UUIDs locally so we can create records offline */
const generateId = () => uuidv4();

/** AsyncStorage persistence plugin — reused by local-only stores */
export const asyncStoragePersist = observablePersistAsyncStorage({ AsyncStorage });

/**
 * Pre-configured synced function with all defaults.
 * `null` when Supabase is not configured — stores should
 * fall back to plain observables with local persistence.
 */
export const mySynced = supabase
  ? configureSynced(syncedSupabase, {
      supabase,
      generateId,

      // Persistence — swap plugin when you move to dev builds
      persist: {
        plugin: asyncStoragePersist,
        // plugin: ObservablePersistMMKV,   // ← for production / dev builds
        retrySync: true,                    // Persist pending changes across app restarts
      },

      // Sync efficiency — only fetch rows changed since last sync
      changesSince: 'last-sync',
      fieldCreatedAt: 'created_at',
      fieldUpdatedAt: 'updated_at',
      fieldDeleted: 'deleted',             // Soft deletes

      // Retry strategy — never lose user data
      retry: {
        infinite: true,                    // Keep retrying until synced
        backoff: 'exponential',
        maxDelay: 30,                      // Cap at 30s between retries
      },

      // Debounce writes to batch rapid changes
      debounceSet: 500,
    })
  : null;
