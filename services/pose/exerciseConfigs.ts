/**
 * Exercise Pose Configs
 *
 * Pre-defined pose analysis rules for each supported exercise.
 * These define:
 *   - Which landmarks to track
 *   - Joint angle ranges for proper form
 *   - How to detect a rep
 *   - What camera angle is optimal
 *
 * Adding a new exercise:
 *   1. Determine the primary movement joints
 *   2. Define angle ranges for each phase (concentric/eccentric)
 *   3. Set up rep detection on the primary joint
 *   4. Add feedback messages for common mistakes
 */

import type { ExercisePoseConfig } from '@/data/types';
import { LANDMARK } from './poseMath';

export const exercisePoseConfigs: Record<string, ExercisePoseConfig> = {
  // ─── SQUATS ─────────────────────────────────────
  squat: {
    relevantLandmarks: [
      LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP,
      LANDMARK.LEFT_KNEE, LANDMARK.RIGHT_KNEE,
      LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE,
      LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER,
    ],
    angleRules: [
      {
        name: 'Knee Angle',
        landmarks: [LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE, LANDMARK.LEFT_ANKLE],
        minAngle: 70,   // Don't go past 70° (too deep for most)
        maxAngle: 170,  // Full extension
        phase: 'both',
        feedback: 'Watch your knee bend depth',
      },
      {
        name: 'Back Angle',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE],
        minAngle: 50,
        maxAngle: 120,
        phase: 'eccentric',
        feedback: 'Keep your chest up — avoid leaning too far forward',
      },
      {
        name: 'Knee Cave',
        landmarks: [LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE, LANDMARK.LEFT_ANKLE],
        minAngle: 160,
        maxAngle: 180,
        phase: 'eccentric',
        feedback: 'Keep knees tracking over toes — avoid knee cave',
      },
    ],
    repDetection: {
      trackingJoint: [LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE, LANDMARK.LEFT_ANKLE],
      topAngle: 160,     // Standing
      bottomAngle: 90,   // Parallel squat
      threshold: 15,
    },
    cameraPosition: 'side',
  },

  // ─── PUSH UPS ───────────────────────────────────
  pushUp: {
    relevantLandmarks: [
      LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER,
      LANDMARK.LEFT_ELBOW, LANDMARK.RIGHT_ELBOW,
      LANDMARK.LEFT_WRIST, LANDMARK.RIGHT_WRIST,
      LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP,
    ],
    angleRules: [
      {
        name: 'Elbow Angle',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_ELBOW, LANDMARK.LEFT_WRIST],
        minAngle: 70,
        maxAngle: 170,
        phase: 'both',
        feedback: 'Control your elbow bend — don\'t flare out',
      },
      {
        name: 'Body Line',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP, LANDMARK.LEFT_ANKLE],
        minAngle: 160,
        maxAngle: 180,
        phase: 'both',
        feedback: 'Keep your body in a straight line — don\'t sag your hips',
      },
    ],
    repDetection: {
      trackingJoint: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_ELBOW, LANDMARK.LEFT_WRIST],
      topAngle: 160,     // Arms extended
      bottomAngle: 90,   // Chest near ground
      threshold: 15,
    },
    cameraPosition: 'side',
  },

  // ─── LUNGES ─────────────────────────────────────
  lunge: {
    relevantLandmarks: [
      LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP,
      LANDMARK.LEFT_KNEE, LANDMARK.RIGHT_KNEE,
      LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE,
      LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER,
    ],
    angleRules: [
      {
        name: 'Front Knee',
        landmarks: [LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE, LANDMARK.LEFT_ANKLE],
        minAngle: 80,
        maxAngle: 110,
        phase: 'eccentric',
        feedback: 'Front knee should be at 90° — don\'t let it go past your toes',
      },
      {
        name: 'Torso Upright',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE],
        minAngle: 70,
        maxAngle: 110,
        phase: 'both',
        feedback: 'Keep your torso upright',
      },
    ],
    repDetection: {
      trackingJoint: [LANDMARK.LEFT_HIP, LANDMARK.LEFT_KNEE, LANDMARK.LEFT_ANKLE],
      topAngle: 160,
      bottomAngle: 90,
      threshold: 15,
    },
    cameraPosition: 'side',
  },

  // ─── PLANK ──────────────────────────────────────
  plank: {
    relevantLandmarks: [
      LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER,
      LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP,
      LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE,
    ],
    angleRules: [
      {
        name: 'Body Line',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP, LANDMARK.LEFT_ANKLE],
        minAngle: 160,
        maxAngle: 180,
        phase: 'both',
        feedback: 'Keep your body straight — don\'t let your hips drop or pike up',
      },
    ],
    repDetection: {
      // Plank is isometric — track hold time, not reps
      trackingJoint: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP, LANDMARK.LEFT_ANKLE],
      topAngle: 180,
      bottomAngle: 160,
      threshold: 5,
    },
    cameraPosition: 'side',
  },

  // ─── BICEP CURLS ────────────────────────────────
  bicepCurl: {
    relevantLandmarks: [
      LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER,
      LANDMARK.LEFT_ELBOW, LANDMARK.RIGHT_ELBOW,
      LANDMARK.LEFT_WRIST, LANDMARK.RIGHT_WRIST,
    ],
    angleRules: [
      {
        name: 'Elbow Position',
        landmarks: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_ELBOW, LANDMARK.LEFT_WRIST],
        minAngle: 30,
        maxAngle: 170,
        phase: 'both',
        feedback: 'Keep your elbows pinned to your sides',
      },
      {
        name: 'Shoulder Stability',
        landmarks: [LANDMARK.LEFT_ELBOW, LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_HIP],
        minAngle: 5,
        maxAngle: 25,
        phase: 'both',
        feedback: 'Don\'t swing your shoulders — isolate the bicep',
      },
    ],
    repDetection: {
      trackingJoint: [LANDMARK.LEFT_SHOULDER, LANDMARK.LEFT_ELBOW, LANDMARK.LEFT_WRIST],
      topAngle: 160,     // Arm extended
      bottomAngle: 40,   // Fully curled
      threshold: 15,
    },
    cameraPosition: 'front',
  },
};

/** Get pose config for an exercise by name/slug. Returns undefined if not configured. */
export function getExercisePoseConfig(
  exerciseSlug: string
): ExercisePoseConfig | undefined {
  return exercisePoseConfigs[exerciseSlug];
}

/** List all exercises that have pose analysis support */
export function getSupportedExercises(): string[] {
  return Object.keys(exercisePoseConfigs);
}
