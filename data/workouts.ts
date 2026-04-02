/**
 * Workout Programs — Single Source of Truth
 *
 * All workout metadata lives here. Screens import what they need.
 * When Supabase is connected, this becomes the offline fallback/seed data.
 */

import type { ExtendedBodyPart } from 'react-native-body-highlighter';

// ─── Types ──────────────────────────────────────────────

export type WorkoutCategory = 'all' | 'upper' | 'core' | 'lower' | 'cardio';

export type ExerciseDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface WorkoutExercise {
  id: string;
  name: string;
  duration: string;
  reps?: string;
  difficulty: ExerciseDifficulty;
  targetMuscles: ExtendedBodyPart[];
  bodySide: 'front' | 'back';
  category: ExerciseFilterCategory;
  muscleGroup: string;
  isRecommended: boolean;
}

export type ExerciseFilterCategory =
  | 'all'
  | 'warmup'
  | 'strength'
  | 'cardio'
  | 'core'
  | 'cooldown';

export interface WorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  category: WorkoutCategory;
  progress: number;
  duration: string;
  calories: number;
  exerciseCount: number;
  targetMuscles: ExtendedBodyPart[];
  bodySide: 'front' | 'back';
  exercises: WorkoutExercise[];
}

// ─── Filter Options ─────────────────────────────────────

export const workoutCategoryFilters: Array<{ id: WorkoutCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'upper', label: 'Upper' },
  { id: 'core', label: 'Core' },
  { id: 'lower', label: 'Lower' },
  { id: 'cardio', label: 'Cardio' },
];

export const exerciseCategoryFilters: Array<{ id: ExerciseFilterCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'warmup', label: 'Warm Up' },
  { id: 'strength', label: 'Strength' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'core', label: 'Core' },
  { id: 'cooldown', label: 'Cool Down' },
];

// ─── Workout Data ───────────────────────────────────────

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: '1',
    title: 'Full Body',
    subtitle: 'Exercise',
    category: 'all',
    progress: 50,
    duration: '45 min',
    calories: 320,
    exerciseCount: 12,
    targetMuscles: [
      { slug: 'chest', intensity: 2 },
      { slug: 'deltoids', intensity: 2 },
      { slug: 'biceps', intensity: 2 },
      { slug: 'forearm', intensity: 2 },
      { slug: 'abs', intensity: 2 },
      { slug: 'obliques', intensity: 2 },
      { slug: 'quadriceps', intensity: 2 },
      { slug: 'adductors', intensity: 2 },
      { slug: 'calves', intensity: 2 },
    ],
    bodySide: 'front',
    exercises: [
      { id: 'e1', name: 'Warm Up Jog', duration: '5 min', difficulty: 'Easy', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'full', isRecommended: true },
      { id: 'e2', name: 'Push Ups', duration: '3 min', reps: '3 x 15', difficulty: 'Medium', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'deltoids', intensity: 2 }, { slug: 'triceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: true },
      { id: 'e3', name: 'Squats', duration: '4 min', reps: '3 x 20', difficulty: 'Medium', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Plank Hold', duration: '3 min', reps: '3 x 45s', difficulty: 'Medium', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'core', muscleGroup: 'abs', isRecommended: true },
      { id: 'e5', name: 'Lunges', duration: '4 min', reps: '3 x 12', difficulty: 'Easy', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: false },
      { id: 'e6', name: 'Burpees', duration: '4 min', reps: '3 x 10', difficulty: 'Hard', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: false },
      { id: 'e7', name: 'Mountain Climbers', duration: '3 min', reps: '3 x 30s', difficulty: 'Hard', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'core', isRecommended: false },
      { id: 'e8', name: 'Jumping Jacks', duration: '3 min', difficulty: 'Easy', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: false },
      { id: 'e9', name: 'Tricep Dips', duration: '3 min', reps: '3 x 12', difficulty: 'Medium', targetMuscles: [{ slug: 'triceps', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'arms', isRecommended: false },
      { id: 'e10', name: 'Cool Down Stretch', duration: '5 min', difficulty: 'Easy', targetMuscles: [{ slug: 'hamstring', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }], bodySide: 'front', category: 'cooldown', muscleGroup: 'full', isRecommended: true },
    ],
  },
  {
    id: '2',
    title: 'Chest & Arms',
    subtitle: 'Strength',
    category: 'upper',
    progress: 25,
    duration: '35 min',
    calories: 280,
    exerciseCount: 8,
    targetMuscles: [
      { slug: 'chest', intensity: 2 },
      { slug: 'deltoids', intensity: 2 },
      { slug: 'biceps', intensity: 2 },
      { slug: 'forearm', intensity: 2 },
      { slug: 'trapezius', intensity: 2 },
    ],
    bodySide: 'front',
    exercises: [
      { id: 'e1', name: 'Arm Circles', duration: '3 min', difficulty: 'Easy', targetMuscles: [{ slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'arms', isRecommended: true },
      { id: 'e2', name: 'Diamond Push Ups', duration: '4 min', reps: '3 x 12', difficulty: 'Hard', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'triceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: true },
      { id: 'e3', name: 'Tricep Dips', duration: '4 min', reps: '3 x 15', difficulty: 'Medium', targetMuscles: [{ slug: 'triceps', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'arms', isRecommended: true },
      { id: 'e4', name: 'Bicep Curls', duration: '4 min', reps: '3 x 12', difficulty: 'Easy', targetMuscles: [{ slug: 'biceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'arms', isRecommended: true },
      { id: 'e5', name: 'Wide Push Ups', duration: '4 min', reps: '3 x 12', difficulty: 'Medium', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'deltoids', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'chest', isRecommended: false },
      { id: 'e6', name: 'Shoulder Taps', duration: '3 min', reps: '3 x 20', difficulty: 'Medium', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'shoulders', isRecommended: false },
    ],
  },
  {
    id: '3',
    title: 'HIIT Cardio',
    subtitle: 'Fat Burn',
    category: 'cardio',
    progress: 60,
    duration: '25 min',
    calories: 350,
    exerciseCount: 10,
    targetMuscles: [
      { slug: 'quadriceps', intensity: 2 },
      { slug: 'calves', intensity: 2 },
      { slug: 'abs', intensity: 2 },
      { slug: 'deltoids', intensity: 2 },
    ],
    bodySide: 'front',
    exercises: [
      { id: 'e1', name: 'Jumping Jacks', duration: '3 min', difficulty: 'Easy', targetMuscles: [{ slug: 'deltoids', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'full', isRecommended: true },
      { id: 'e2', name: 'Burpees', duration: '4 min', reps: '4 x 10', difficulty: 'Hard', targetMuscles: [{ slug: 'chest', intensity: 2 }, { slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'full', isRecommended: true },
      { id: 'e3', name: 'High Knees', duration: '3 min', difficulty: 'Medium', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'abs', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Mountain Climbers', duration: '4 min', reps: '3 x 30s', difficulty: 'Hard', targetMuscles: [{ slug: 'abs', intensity: 2 }, { slug: 'obliques', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'core', isRecommended: true },
      { id: 'e5', name: 'Box Jumps', duration: '4 min', reps: '3 x 12', difficulty: 'Hard', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: false },
      { id: 'e6', name: 'Sprint Intervals', duration: '5 min', difficulty: 'Hard', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'hamstring', intensity: 2 }, { slug: 'calves', intensity: 2 }], bodySide: 'front', category: 'cardio', muscleGroup: 'legs', isRecommended: false },
    ],
  },
  {
    id: '4',
    title: 'Leg Day',
    subtitle: 'Power',
    category: 'lower',
    progress: 0,
    duration: '40 min',
    calories: 300,
    exerciseCount: 9,
    targetMuscles: [
      { slug: 'quadriceps', intensity: 2 },
      { slug: 'hamstring', intensity: 2 },
      { slug: 'gluteal', intensity: 2 },
      { slug: 'calves', intensity: 2 },
    ],
    bodySide: 'back',
    exercises: [
      { id: 'e1', name: 'Leg Swings', duration: '3 min', difficulty: 'Easy', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'front', category: 'warmup', muscleGroup: 'legs', isRecommended: true },
      { id: 'e2', name: 'Goblet Squats', duration: '5 min', reps: '4 x 12', difficulty: 'Medium', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e3', name: 'Walking Lunges', duration: '5 min', reps: '3 x 20', difficulty: 'Medium', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }, { slug: 'gluteal', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e4', name: 'Calf Raises', duration: '4 min', reps: '3 x 20', difficulty: 'Easy', targetMuscles: [{ slug: 'calves', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'legs', isRecommended: true },
      { id: 'e5', name: 'Glute Bridges', duration: '4 min', reps: '3 x 15', difficulty: 'Easy', targetMuscles: [{ slug: 'gluteal', intensity: 2 }, { slug: 'hamstring', intensity: 2 }], bodySide: 'back', category: 'strength', muscleGroup: 'glutes', isRecommended: false },
      { id: 'e6', name: 'Wall Sit', duration: '3 min', reps: '3 x 45s', difficulty: 'Medium', targetMuscles: [{ slug: 'quadriceps', intensity: 2 }], bodySide: 'front', category: 'strength', muscleGroup: 'legs', isRecommended: false },
    ],
  },
];

// ─── Lookup Helpers ─────────────────────────────────────

/** Get a workout by ID */
export function getWorkoutById(id: string): WorkoutProgram | undefined {
  return workoutPrograms.find((w) => w.id === id);
}

/** Get workouts filtered by category */
export function getWorkoutsByCategory(category: WorkoutCategory): WorkoutProgram[] {
  if (category === 'all') return workoutPrograms;
  return workoutPrograms.filter((w) => w.category === category);
}

/** Get a workout's meta (for preference/header screens that don't need exercises) */
export function getWorkoutMeta(id: string) {
  const w = getWorkoutById(id);
  if (!w) return null;
  return {
    title: w.title,
    subtitle: w.subtitle,
    targetMuscles: w.targetMuscles,
    bodySide: w.bodySide,
    duration: w.duration,
    calories: w.calories,
  };
}
