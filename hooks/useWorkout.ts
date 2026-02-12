/**
 * useWorkout Hook
 *
 * Bridges store + services → React components for workout flows.
 * Handles session lifecycle: start → exercise → complete.
 *
 * Usage:
 *   const {
 *     startWorkout,
 *     completeSet,
 *     finishWorkout,
 *     activeSession,
 *     progress,
 *   } = useWorkout();
 */

import { useCallback, useMemo } from 'react';
import { useSelector } from '@legendapp/state/react';
import { sessions$ } from '@/store/sessions$';
import { profile$ } from '@/store/profile$';
import { app$ } from '@/store/app$';
import {
  generateSmartPlan,
  getProgressionRecommendation,
} from '@/services/workoutService';
import type { SessionSetData } from '@/store/sessions$';

export function useWorkout() {
  const activeSessionId = useSelector(() => app$.activeSessionId.get());
  const isWorkoutActive = useSelector(() => app$.isWorkoutActive.get());

  // Active session data (reactive)
  const activeSession = useSelector(() => {
    const id = app$.activeSessionId.get();
    if (!id) return null;
    return sessions$[id].get();
  });

  // ─── Start Workout ─────────────────────────────────

  const startWorkout = useCallback((planId: string) => {
    const userId = profile$.id.peek();
    const fitnessLevel = profile$.fitnessLevel.peek() ?? 'beginner';
    const targetMuscles = profile$.targetMuscleGroups.peek() ?? [];

    // Generate smart plan
    const plan = generateSmartPlan({
      workoutId: planId,
      fitnessLevel: fitnessLevel as any,
      targetMuscles,
    });

    // Create session
    const id = `session_${Date.now()}`;
    const now = new Date().toISOString();

    sessions$[id].set({
      id,
      userId,
      planId,
      startedAt: now,
      completedAt: null,
      exercises: plan.exercises.map((e) => ({
        exerciseId: e.id,
        sets: [],
      })),
      totalDurationMin: 0,
      caloriesBurned: null,
      avgFormScore: null,
      createdAt: now,
      updatedAt: now,
    });

    app$.isWorkoutActive.set(true);
    app$.activeSessionId.set(id);

    return { sessionId: id, plan };
  }, []);

  // ─── Complete a Set ────────────────────────────────

  const completeSet = useCallback(
    (exerciseId: string, setData: SessionSetData) => {
      const id = app$.activeSessionId.peek();
      if (!id) return;

      const exercises = sessions$[id].exercises.peek();
      const exerciseIndex = exercises.findIndex(
        (e) => e.exerciseId === exerciseId
      );

      if (exerciseIndex === -1) return;

      // Append the set
      sessions$[id].exercises[exerciseIndex].sets.set([
        ...exercises[exerciseIndex].sets,
        setData,
      ]);

      sessions$[id].updatedAt.set(new Date().toISOString());
    },
    []
  );

  // ─── Finish Workout ────────────────────────────────

  const finishWorkout = useCallback(() => {
    const id = app$.activeSessionId.peek();
    if (!id) return;

    const session = sessions$[id].peek();
    const startTime = new Date(session.startedAt).getTime();
    const durationMin = Math.round((Date.now() - startTime) / 60000);

    // Calculate average form score across all sets
    let totalScore = 0;
    let scoreCount = 0;
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (set.formScore != null) {
          totalScore += set.formScore;
          scoreCount++;
        }
      }
    }

    const now = new Date().toISOString();
    sessions$[id].completedAt.set(now);
    sessions$[id].totalDurationMin.set(durationMin);
    sessions$[id].avgFormScore.set(
      scoreCount > 0 ? Math.round(totalScore / scoreCount) : null
    );
    sessions$[id].updatedAt.set(now);

    app$.isWorkoutActive.set(false);
    app$.activeSessionId.set(null);

    return {
      durationMin,
      avgFormScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : null,
    };
  }, []);

  // ─── Stats ─────────────────────────────────────────

  const stats = useMemo(() => {
    const allSessions = sessions$.peek();
    const completed = Object.values(allSessions ?? {}).filter(
      (s) => s.completedAt != null
    );

    const totalWorkouts = completed.length;
    const totalMinutes = completed.reduce(
      (sum, s) => sum + (s.totalDurationMin ?? 0),
      0
    );
    const avgFormScore =
      completed.length > 0
        ? Math.round(
            completed.reduce((sum, s) => sum + (s.avgFormScore ?? 0), 0) /
              completed.length
          )
        : 0;

    return { totalWorkouts, totalMinutes, avgFormScore };
  }, [activeSessionId]); // Re-compute when session changes

  return {
    startWorkout,
    completeSet,
    finishWorkout,
    activeSession,
    isWorkoutActive,
    stats,
  };
}
