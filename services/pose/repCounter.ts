/**
 * Rep Counter — Temporal State Machine
 *
 * Detects repetitions by tracking a primary joint angle
 * through concentric/eccentric phases.
 *
 * States:
 *   IDLE → ECCENTRIC (lowering) → CONCENTRIC (lifting) → REP_COMPLETE → ECCENTRIC
 *
 * This is a pure state machine — no React, no side effects.
 * Feed it angles frame-by-frame and it returns the count.
 */

import type { RepDetectionConfig } from '@/data/types';

export type RepPhase = 'idle' | 'eccentric' | 'concentric';

export interface RepState {
  count: number;
  phase: RepPhase;
  lastAngle: number;
  minAngle: number;
  maxAngle: number;
  /** Timestamp of the last completed rep */
  lastRepTimestamp: number;
  /** Is the user currently in a valid range for the exercise? */
  inRange: boolean;
}

export function createRepState(): RepState {
  return {
    count: 0,
    phase: 'idle',
    lastAngle: 0,
    minAngle: Infinity,
    maxAngle: -Infinity,
    lastRepTimestamp: 0,
    inRange: false,
  };
}

/**
 * Process a single frame's angle and update the rep state.
 * Returns the updated state (immutable — creates a new object).
 *
 * @param state   Current rep state
 * @param angle   The measured joint angle this frame
 * @param config  Rep detection config for the current exercise
 * @param timestamp  Current time in seconds
 */
export function processFrame(
  state: RepState,
  angle: number,
  config: RepDetectionConfig,
  timestamp: number
): RepState {
  const next = { ...state, lastAngle: angle };

  // Track min/max angles within the current rep
  next.minAngle = Math.min(state.minAngle, angle);
  next.maxAngle = Math.max(state.maxAngle, angle);

  // Check if angle is in the exercise's ROM
  const nearTop = angle >= config.topAngle - config.threshold;
  const nearBottom = angle <= config.bottomAngle + config.threshold;

  switch (state.phase) {
    case 'idle':
      // Start tracking when user reaches the top position
      if (nearTop) {
        next.phase = 'eccentric';
        next.maxAngle = angle;
        next.minAngle = angle;
      }
      break;

    case 'eccentric':
      // User is lowering — going toward bottom angle
      if (nearBottom) {
        // Reached the bottom, transition to concentric
        next.phase = 'concentric';
      } else if (nearTop && angle > state.lastAngle) {
        // User went back up without completing — still eccentric but reset
        next.maxAngle = angle;
      }
      break;

    case 'concentric':
      // User is lifting — going toward top angle
      if (nearTop) {
        // Full rep completed!
        next.count = state.count + 1;
        next.phase = 'eccentric';
        next.lastRepTimestamp = timestamp;
        next.minAngle = Infinity;
        next.maxAngle = -Infinity;
      }
      break;
  }

  // Range check
  next.inRange =
    angle >= config.bottomAngle - config.threshold * 2 &&
    angle <= config.topAngle + config.threshold * 2;

  return next;
}

/**
 * Calculate tempo (seconds per rep) from the last two reps.
 * Returns null if not enough data.
 */
export function getRepTempo(
  currentTimestamp: number,
  lastRepTimestamp: number
): number | null {
  if (lastRepTimestamp === 0) return null;
  return currentTimestamp - lastRepTimestamp;
}
