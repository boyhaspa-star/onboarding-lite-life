/**
 * App Store — Legend-State Observable
 *
 * Ephemeral UI state that doesn't persist or sync.
 * e.g., current camera mode, active workout timer, loading states.
 *
 * Usage:
 *   import { app$ } from '@/store/app$';
 *   app$.isOnline.set(true);
 */

import { observable } from '@legendapp/state';

export interface AppState {
  /** Network connectivity status */
  isOnline: boolean;
  /** Whether a workout is currently in progress */
  isWorkoutActive: boolean;
  /** Active session ID (if workout in progress) */
  activeSessionId: string | null;
  /** Camera / pose analysis state */
  poseAnalysis: {
    isActive: boolean;
    currentExerciseId: string | null;
    repCount: number;
    formScore: number;
    feedback: string[];
  };
  /** Loading states for async operations */
  loading: {
    auth: boolean;
    sync: boolean;
    workout: boolean;
  };
}

export const app$ = observable<AppState>({
  isOnline: true,
  isWorkoutActive: false,
  activeSessionId: null,
  poseAnalysis: {
    isActive: false,
    currentExerciseId: null,
    repCount: 0,
    formScore: 0,
    feedback: [],
  },
  loading: {
    auth: false,
    sync: false,
    workout: false,
  },
});
