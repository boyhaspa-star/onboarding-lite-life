/**
 * App-Level Model Types
 * 
 * These are the types your UI and services work with.
 * They may differ from database row types (e.g., no deleted field, parsed dates).
 */

// ─── Exercise Catalog (bundled, offline) ────────────────

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  instructions: string[];
  tips: string[];
  /** URL or local asset reference for exercise demonstration */
  imageUrl?: string;
  videoUrl?: string;
  /** Pose estimation config for this exercise */
  poseConfig?: ExercisePoseConfig;
}

export type ExerciseCategory =
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'plyometric';

export type MuscleGroup =
  | 'chest'
  | 'deltoids'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quadriceps'
  | 'hamstring'
  | 'gluteal'
  | 'calves'
  | 'trapezius'
  | 'upper-back'
  | 'lower-back'
  | 'adductors'
  | 'abductors';

export type Equipment =
  | 'bodyweight'
  | 'dumbbell'
  | 'barbell'
  | 'kettlebell'
  | 'resistance-band'
  | 'cable-machine'
  | 'bench'
  | 'pull-up-bar';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type Gender = 'male' | 'female' | 'other';

// ─── Pose Estimation ────────────────────────────────────

export interface ExercisePoseConfig {
  /** Which landmark indices matter for form checking */
  relevantLandmarks: number[];
  /** Joint angle rules for form validation */
  angleRules: AngleRule[];
  /** How to detect a rep (e.g., which joints flex/extend) */
  repDetection: RepDetectionConfig;
  /** Camera position recommendation */
  cameraPosition: 'front' | 'side' | 'any';
}

export interface AngleRule {
  name: string;
  /** Landmark indices forming the angle: [pointA, vertex, pointB] */
  landmarks: [number, number, number];
  /** Acceptable range in degrees */
  minAngle: number;
  maxAngle: number;
  /** Phase when this rule is active */
  phase: 'concentric' | 'eccentric' | 'both';
  /** Feedback message when out of range */
  feedback: string;
}

export interface RepDetectionConfig {
  /** Primary joint to track for rep counting */
  trackingJoint: [number, number, number];
  /** Angle at top of rep (extended) */
  topAngle: number;
  /** Angle at bottom of rep (contracted) */
  bottomAngle: number;
  /** Minimum angle change to register as movement */
  threshold: number;
}

// ─── Workout Session ────────────────────────────────────

export interface WorkoutSession {
  id: string;
  planId: string;
  startedAt: Date;
  completedAt?: Date;
  exercises: SessionExercise[];
  totalDuration: number;
  caloriesBurned?: number;
}

export interface SessionExercise {
  exerciseId: string;
  sets: SessionSet[];
}

export interface SessionSet {
  reps: number;
  weightKg?: number;
  durationSeconds?: number;
  formScore?: number;
  completed: boolean;
}

// ─── Onboarding State ───────────────────────────────────

export interface OnboardingData {
  gender?: Gender;
  age?: number;
  birthday?: string;
  fitnessLevel?: FitnessLevel;
  targetMuscleGroups: string[];
  availableDays: string[];
  completed: boolean;
}
