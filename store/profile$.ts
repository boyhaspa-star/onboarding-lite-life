/**
 * Profile Store — Legend-State Observable
 *
 * Synced to `profiles` table in Supabase.
 * Persisted locally with MMKV/AsyncStorage.
 *
 * Usage:
 *   import { profile$ } from '@/store/profile$';
 *   const name = profile$.displayName.get();  // read
 *   profile$.displayName.set('John');          // write → auto-syncs
 */

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mySynced, asyncStoragePersist } from '@/data/sync';
import type { FitnessLevel, Gender } from '@/data/types';

// ─── Shape ──────────────────────────────────────────────

export interface ProfileState {
  id: string;
  email: string;
  displayName: string;
  gender: Gender | null;
  age: number | null;
  birthday: string | null;
  fitnessLevel: FitnessLevel | null;
  targetMuscleGroups: string[];
  availableDays: string[];
  onboardingCompleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

const defaultProfile: ProfileState = {
  id: '',
  email: '',
  displayName: '',
  gender: null,
  age: null,
  birthday: null,
  fitnessLevel: null,
  targetMuscleGroups: [],
  availableDays: [],
  onboardingCompleted: false,
  createdAt: null,
  updatedAt: null,
};

// ─── Observable ─────────────────────────────────────────

/**
 * Synced profile observable.
 *
 * `mySynced` already has the Supabase client + persistence plugin
 * configured via `configureSynced` in data/sync.ts. We only need
 * to specify collection-specific options here.
 *
 * SQL for the table:
 * ```sql
 * CREATE TABLE profiles (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   email TEXT NOT NULL,
 *   display_name TEXT,
 *   gender TEXT,
 *   age INT,
 *   birthday TEXT,
 *   fitness_level TEXT,
 *   target_muscle_groups JSONB DEFAULT '[]',
 *   available_days JSONB DEFAULT '[]',
 *   onboarding_completed BOOLEAN DEFAULT FALSE,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   deleted BOOLEAN DEFAULT FALSE
 * );
 * ```
 */
/**
 * When Supabase is configured, profile syncs to the `profiles` table.
 * Otherwise, it's a local-only observable with AsyncStorage persistence.
 */
export const profile$ = observable<ProfileState>(
  mySynced
    ? (mySynced as any)({
        collection: 'profiles',
        select: (from: any) =>
          from.select(
            'id, email, display_name, gender, age, birthday, fitness_level, target_muscle_groups, available_days, onboarding_completed, created_at, updated_at'
          ),
        // Map DB snake_case → app camelCase
        fieldTransforms: {
          id: 'id',
          email: 'email',
          displayName: 'display_name',
          gender: 'gender',
          age: 'age',
          birthday: 'birthday',
          fitnessLevel: 'fitness_level',
          targetMuscleGroups: 'target_muscle_groups',
          availableDays: 'available_days',
          onboardingCompleted: 'onboarding_completed',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        persist: { name: 'profile' },
        initial: defaultProfile as any,
      })
    : defaultProfile
);

// When running without Supabase, still persist locally
if (!mySynced) {
  syncObservable(profile$, {
    persist: {
      name: 'profile',
      plugin: asyncStoragePersist,
    },
  });
}
