/**
 * useUserGender — Returns the user's selected gender for BodyView components.
 *
 * Reads from profile$ first (synced store, post-onboarding),
 * then falls back to onboarding$ (local store, during onboarding),
 * and defaults to 'male' if neither is set.
 *
 * Usage:
 *   const gender = useUserGender();
 *   <BodyView gender={gender} ... />
 */

import { useSelector } from '@legendapp/state/react';
import { profile$ } from '@/store/profile$';
import { onboarding$ } from '@/store/onboarding$';

export function useUserGender(): 'male' | 'female' {
  const profileGender = useSelector(() => profile$.gender.get());
  const onboardingGender = useSelector(() => onboarding$.gender.get());
  return (profileGender ?? onboardingGender ?? 'male') as 'male' | 'female';
}
