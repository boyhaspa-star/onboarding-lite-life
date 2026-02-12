/**
 * useOnboarding Hook
 *
 * Bridges onboarding$ store → React components.
 * Drop-in replacement for the old OnboardingContext.
 *
 * Usage:
 *   const { data, setGender, nextStep, isComplete } = useOnboardingFlow();
 */

import { useSelector } from '@legendapp/state/react';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  onboarding$,
  completeOnboarding,
  resetOnboarding,
} from '@/store/onboarding$';
import type { Gender, FitnessLevel } from '@/data/types';

/** Ordered onboarding route segments */
const ONBOARDING_STEPS = [
  '/onboarding/gender',
  '/onboarding/age',
  '/onboarding/birthday',
  '/onboarding/fitnessLevel',
  '/onboarding/bodyParts',
  '/onboarding/week',
  '/onboarding/complete',
] as const;

export function useOnboardingFlow() {
  const router = useRouter();

  // Reactive reads from the store
  const data = useSelector(() => onboarding$.get());
  const currentStep = useSelector(() => onboarding$.currentStep.get());
  const isComplete = useSelector(() => onboarding$.completed.get());

  // ─── Setters ──────────────────────────────────────

  const setGender = useCallback((gender: Gender) => {
    onboarding$.gender.set(gender);
  }, []);

  const setAge = useCallback((age: number) => {
    onboarding$.age.set(age);
  }, []);

  const setBirthday = useCallback((birthday: string) => {
    onboarding$.birthday.set(birthday);
  }, []);

  const setFitnessLevel = useCallback((level: FitnessLevel) => {
    onboarding$.fitnessLevel.set(level);
  }, []);

  const setTargetMuscleGroups = useCallback((muscles: string[]) => {
    onboarding$.targetMuscleGroups.set(muscles);
  }, []);

  const toggleMuscleGroup = useCallback((muscleId: string) => {
    const current = onboarding$.targetMuscleGroups.peek();
    if (current.includes(muscleId)) {
      onboarding$.targetMuscleGroups.set(
        current.filter((id) => id !== muscleId)
      );
    } else {
      onboarding$.targetMuscleGroups.set([...current, muscleId]);
    }
  }, []);

  const setAvailableDays = useCallback((days: string[]) => {
    onboarding$.availableDays.set(days);
  }, []);

  // ─── Navigation ───────────────────────────────────

  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (next < ONBOARDING_STEPS.length) {
      onboarding$.currentStep.set(next);
      router.push(ONBOARDING_STEPS[next] as any);
    }
  }, [currentStep, router]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      onboarding$.currentStep.set(currentStep - 1);
      router.back();
    }
  }, [currentStep, router]);

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/(tabs)');
  }, [router]);

  const reset = useCallback(() => {
    resetOnboarding();
  }, []);

  return {
    data,
    currentStep,
    totalSteps: ONBOARDING_STEPS.length,
    isComplete,
    // Setters
    setGender,
    setAge,
    setBirthday,
    setFitnessLevel,
    setTargetMuscleGroups,
    toggleMuscleGroup,
    setAvailableDays,
    // Navigation
    nextStep,
    prevStep,
    finish,
    reset,
  };
}
