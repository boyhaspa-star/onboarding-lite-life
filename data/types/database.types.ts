/**
 * Database Types
 * 
 * Generate this file from your Supabase schema:
 *   supabase gen types --lang=typescript --local > data/types/database.types.ts
 * 
 * For now, this is a placeholder with the expected table shapes.
 * Replace with the auto-generated version once your DB is set up.
 */

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfileRow;
        Insert: Omit<UserProfileRow, 'created_at' | 'updated_at'>;
        Update: Partial<UserProfileRow>;
      };
      workout_plans: {
        Row: WorkoutPlanRow;
        Insert: Omit<WorkoutPlanRow, 'created_at' | 'updated_at'>;
        Update: Partial<WorkoutPlanRow>;
      };
      exercise_sessions: {
        Row: ExerciseSessionRow;
        Insert: Omit<ExerciseSessionRow, 'created_at' | 'updated_at'>;
        Update: Partial<ExerciseSessionRow>;
      };
      pose_analysis_results: {
        Row: PoseAnalysisRow;
        Insert: Omit<PoseAnalysisRow, 'created_at' | 'updated_at'>;
        Update: Partial<PoseAnalysisRow>;
      };
    };
  };
}

// ─── Row Types ──────────────────────────────────────────

export interface UserProfileRow {
  id: string;
  user_id: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  birthday: string | null;
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  target_muscle_groups: string[];
  available_days: string[];
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}

export interface WorkoutPlanRow {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  target_muscles: string[];
  body_side: 'front' | 'back';
  exercises: ExerciseInPlan[];
  mode: 'smart' | 'manual';
  scheduled_day: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}

export interface ExerciseInPlan {
  exercise_id: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  order: number;
}

export interface ExerciseSessionRow {
  id: string;
  user_id: string;
  workout_plan_id: string;
  started_at: string;
  completed_at: string | null;
  exercises_completed: CompletedExercise[];
  total_duration_seconds: number;
  calories_burned: number | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}

export interface CompletedExercise {
  exercise_id: string;
  sets_completed: SetResult[];
}

export interface SetResult {
  reps: number;
  weight_kg: number | null;
  duration_seconds: number | null;
  form_score: number | null; // 0-100 from pose analysis
}

export interface PoseAnalysisRow {
  id: string;
  user_id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  landmark_data: PoseLandmark[];
  form_score: number;              // 0-100
  feedback: FormFeedback[];
  rep_count: number;
  created_at: string;
  updated_at: string;
  deleted: boolean;
}

// ─── Pose & Analysis Types ──────────────────────────────

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface FormFeedback {
  type: 'warning' | 'error' | 'success';
  joint: string;
  message: string;
  angle?: number;
  target_angle?: number;
}
