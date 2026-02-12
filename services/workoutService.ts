/**
 * Workout Service — Business Logic
 *
 * Pure functions for workout plan generation, exercise ordering,
 * and progression logic. No React, no state management.
 *
 * These functions are consumed by hooks (useWorkout.ts) which
 * bridge them to Legend-State observables and React components.
 */

import type { FitnessLevel, DifficultyLevel } from '@/data/types';
import {
  workoutPrograms,
  getWorkoutById,
  type WorkoutProgram,
  type WorkoutExercise,
} from '@/data/workouts';

// ─── Smart Plan Generation ──────────────────────────────

export interface SmartPlanInput {
  workoutId: string;
  fitnessLevel: FitnessLevel;
  targetMuscles: string[];
  availableMinutes?: number;
  previousSessionFeedback?: string[];
}

export interface SmartPlanOutput {
  exercises: WorkoutExercise[];
  estimatedDuration: string;
  estimatedCalories: number;
  warmupIncluded: boolean;
  cooldownIncluded: boolean;
}

/**
 * Generate a "smart" exercise plan by reordering/filtering exercises
 * based on user profile. This is the offline version — no API needed.
 *
 * When online, this can be enhanced with an AI endpoint.
 */
export function generateSmartPlan(input: SmartPlanInput): SmartPlanOutput {
  const workout = getWorkoutById(input.workoutId);
  if (!workout) {
    return {
      exercises: [],
      estimatedDuration: '0 min',
      estimatedCalories: 0,
      warmupIncluded: false,
      cooldownIncluded: false,
    };
  }

  let exercises = [...workout.exercises];

  // 1. Always include warmup + cooldown
  const warmup = exercises.filter((e) => e.category === 'warmup');
  const cooldown = exercises.filter((e) => e.category === 'cooldown');
  const main = exercises.filter(
    (e) => e.category !== 'warmup' && e.category !== 'cooldown'
  );

  // 2. Prioritize recommended exercises
  main.sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return 0;
  });

  // 3. Adjust based on fitness level
  let selectedMain: WorkoutExercise[];
  switch (input.fitnessLevel) {
    case 'beginner':
      // Take fewer exercises, all recommended
      selectedMain = main.filter((e) => e.isRecommended).slice(0, 4);
      break;
    case 'intermediate':
      // Take recommended + some extras
      selectedMain = main.slice(0, 6);
      break;
    case 'advanced':
      // Take all
      selectedMain = main;
      break;
    default:
      selectedMain = main.slice(0, 5);
  }

  // 4. Assemble final plan
  const plan = [...warmup, ...selectedMain, ...cooldown];

  return {
    exercises: plan,
    estimatedDuration: estimateDuration(plan),
    estimatedCalories: estimateCalories(plan, input.fitnessLevel),
    warmupIncluded: warmup.length > 0,
    cooldownIncluded: cooldown.length > 0,
  };
}

// ─── Duration / Calorie Estimation ──────────────────────

function estimateDuration(exercises: WorkoutExercise[]): string {
  let totalMinutes = 0;
  for (const ex of exercises) {
    const match = ex.duration.match(/(\d+)/);
    if (match) totalMinutes += parseInt(match[1], 10);
  }
  return `${totalMinutes} min`;
}

function estimateCalories(
  exercises: WorkoutExercise[],
  level: FitnessLevel
): number {
  const multiplier =
    level === 'beginner' ? 0.8 : level === 'advanced' ? 1.2 : 1.0;
  // Rough estimate: ~10 cal per minute of exercise
  let totalMinutes = 0;
  for (const ex of exercises) {
    const match = ex.duration.match(/(\d+)/);
    if (match) totalMinutes += parseInt(match[1], 10);
  }
  return Math.round(totalMinutes * 10 * multiplier);
}

// ─── Progression Logic ──────────────────────────────────

export interface ProgressionRecommendation {
  shouldIncrease: boolean;
  suggestion: string;
  metric: 'reps' | 'sets' | 'weight' | 'duration';
}

/**
 * Based on recent session data, suggest progression.
 * Pure function — just math, no storage.
 */
export function getProgressionRecommendation(
  avgFormScore: number,
  completionRate: number,
  sessionsCompleted: number
): ProgressionRecommendation {
  if (sessionsCompleted < 3) {
    return {
      shouldIncrease: false,
      suggestion: 'Complete at least 3 sessions before progressing',
      metric: 'reps',
    };
  }

  if (avgFormScore >= 85 && completionRate >= 0.9) {
    return {
      shouldIncrease: true,
      suggestion: 'Great form! Try increasing reps or weight',
      metric: avgFormScore >= 90 ? 'weight' : 'reps',
    };
  }

  if (avgFormScore < 70) {
    return {
      shouldIncrease: false,
      suggestion: 'Focus on form before adding intensity',
      metric: 'reps',
    };
  }

  return {
    shouldIncrease: false,
    suggestion: 'Keep it up — consistency is key',
    metric: 'reps',
  };
}
