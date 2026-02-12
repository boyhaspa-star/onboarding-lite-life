/**
 * Workout Sessions Store — Legend-State Observable
 *
 * Tracks active + completed workout sessions.
 * Synced to `workout_sessions` table in Supabase.
 *
 * Usage:
 *   import { sessions$ } from '@/store/sessions$';
 *   const all = sessions$.get();                    // all sessions (Record<id, session>)
 *   sessions$[sessionId].completedAt.set(new Date().toISOString());
 */

import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';
import { mySynced, asyncStoragePersist } from '@/data/sync';

// ─── Shape ──────────────────────────────────────────────

export interface WorkoutSessionRow {
  id: string;
  userId: string;
  planId: string;
  startedAt: string;
  completedAt: string | null;
  exercises: SessionExerciseData[];
  totalDurationMin: number;
  caloriesBurned: number | null;
  avgFormScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionExerciseData {
  exerciseId: string;
  sets: SessionSetData[];
}

export interface SessionSetData {
  reps: number;
  weightKg?: number;
  durationSeconds?: number;
  formScore?: number;
  completed: boolean;
}

// ─── Observable ─────────────────────────────────────────

/**
 * All workout sessions as a Record<id, session>.
 * Legend-State's synced Supabase plugin stores list data
 * as a Record keyed by primary key.
 *
 * SQL:
 * ```sql
 * CREATE TABLE workout_sessions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES profiles(id),
 *   plan_id TEXT NOT NULL,
 *   started_at TIMESTAMPTZ NOT NULL,
 *   completed_at TIMESTAMPTZ,
 *   exercises JSONB DEFAULT '[]',
 *   total_duration_min INT DEFAULT 0,
 *   calories_burned INT,
 *   avg_form_score REAL,
 *   created_at TIMESTAMPTZ DEFAULT NOW(),
 *   updated_at TIMESTAMPTZ DEFAULT NOW(),
 *   deleted BOOLEAN DEFAULT FALSE
 * );
 * ```
 */
export const sessions$ = observable<Record<string, WorkoutSessionRow>>(
  mySynced
    ? (mySynced as any)({
        collection: 'workout_sessions',
        select: (from: any) =>
          from.select(
            'id, user_id, plan_id, started_at, completed_at, exercises, total_duration_min, calories_burned, avg_form_score, created_at, updated_at'
          ),
        fieldTransforms: {
          id: 'id',
          userId: 'user_id',
          planId: 'plan_id',
          startedAt: 'started_at',
          completedAt: 'completed_at',
          exercises: 'exercises',
          totalDurationMin: 'total_duration_min',
          caloriesBurned: 'calories_burned',
          avgFormScore: 'avg_form_score',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
        persist: { name: 'workout_sessions' },
        actions: {
          startSession: (planId: string, userId: string) => {
            const id = crypto.randomUUID?.() ?? `${Date.now()}`;
            const now = new Date().toISOString();
            sessions$[id].set({
              id,
              userId,
              planId,
              startedAt: now,
              completedAt: null,
              exercises: [],
              totalDurationMin: 0,
              caloriesBurned: null,
              avgFormScore: null,
              createdAt: now,
              updatedAt: now,
            });
            return id;
          },
        },
      })
    : {}
);

if (!mySynced) {
  syncObservable(sessions$, {
    persist: {
      name: 'workout_sessions',
      plugin: asyncStoragePersist,
    },
  });
}
