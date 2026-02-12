/**
 * Onboarding Store — Legend-State Observable
 *
 * Local-only state for the onboarding flow.
 * Persisted locally so users can resume if they close the app.
 * On completion, data is merged into profile$ and synced to Supabase.
 *
 * This replaces the existing OnboardingContext.tsx with a simpler,
 * non-React approach that works anywhere in the app.
 *
 * Usage:
 *   import { onboarding$ } from '@/store/onboarding$';
 *   onboarding$.gender.set('male');
 *   const muscles = onboarding$.targetMuscleGroups.get();
 */

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Gender, FitnessLevel } from '@/data/types';
import { profile$ } from './profile$';

// ─── Shape ──────────────────────────────────────────────

export interface OnboardingState {
  /** Current step index for resume tracking */
  currentStep: number;
  gender: Gender | null;
  age: number | null;
  birthday: string | null;
  fitnessLevel: FitnessLevel | null;
  targetMuscleGroups: string[];
  availableDays: string[];
  completed: boolean;
}

const defaultOnboarding: OnboardingState = {
  currentStep: 0,
  gender: null,
  age: null,
  birthday: null,
  fitnessLevel: null,
  targetMuscleGroups: [],
  availableDays: [],
  completed: false,
};

// ─── Observable ─────────────────────────────────────────

/** Onboarding is local-only — no Supabase sync, just persistence */
export const onboarding$ = observable<OnboardingState>(defaultOnboarding);

// Persist locally so users can resume
syncObservable(onboarding$, {
  persist: {
    name: 'onboarding',
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
  },
});

// ─── Actions ────────────────────────────────────────────

/**
 * Complete onboarding — merge data into profile$ which syncs to Supabase.
 * This is the bridge between onboarding (local) and profile (synced).
 */
export function completeOnboarding() {
  const data = onboarding$.peek();

  // Push to synced profile
  profile$.gender.set(data.gender);
  profile$.age.set(data.age);
  profile$.birthday.set(data.birthday);
  profile$.fitnessLevel.set(data.fitnessLevel);
  profile$.targetMuscleGroups.set(data.targetMuscleGroups);
  profile$.availableDays.set(data.availableDays);
  profile$.onboardingCompleted.set(true);

  // Mark onboarding as complete
  onboarding$.completed.set(true);
}

/** Reset onboarding (for testing or re-onboarding) */
export function resetOnboarding() {
  onboarding$.set(defaultOnboarding);
}
