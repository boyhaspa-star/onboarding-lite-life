/**
 * Pose Math Utilities
 *
 * Pure functions for calculating joint angles, distances, and form metrics
 * from MediaPipe 33-landmark pose data.
 *
 * MediaPipe landmark indices:
 *   11/12 = shoulders, 13/14 = elbows, 15/16 = wrists
 *   23/24 = hips, 25/26 = knees, 27/28 = ankles
 *
 * All functions are pure — no side effects, no state, no React.
 */

import type { PoseLandmark, AngleRule, FormFeedback } from '@/data/types';

// ─── Landmark Indices ───────────────────────────────────

export const LANDMARK = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

// ─── Angle Calculation ──────────────────────────────────

/**
 * Calculate the angle (in degrees) at the vertex point B,
 * formed by the vector BA and BC.
 *
 *     A
 *      \
 *       B ← angle is measured here
 *      /
 *     C
 */
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) -
                  Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/**
 * Calculate angle using 3D world coordinates for better accuracy.
 */
export function calculateAngle3D(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark
): number {
  const ba = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  const bc = { x: c.x - b.x, y: c.y - b.y, z: c.z - b.z };

  const dot = ba.x * bc.x + ba.y * bc.y + ba.z * bc.z;
  const magBA = Math.sqrt(ba.x ** 2 + ba.y ** 2 + ba.z ** 2);
  const magBC = Math.sqrt(bc.x ** 2 + bc.y ** 2 + bc.z ** 2);

  if (magBA === 0 || magBC === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (magBA * magBC)));
  return Math.acos(cosAngle) * (180 / Math.PI);
}

// ─── Distance ───────────────────────────────────────────

/** Euclidean distance between two landmarks (2D) */
export function distance2D(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Euclidean distance between two landmarks (3D) */
export function distance3D(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

// ─── Common Joint Angles ────────────────────────────────

/** Get the left elbow angle (shoulder → elbow → wrist) */
export function getLeftElbowAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.LEFT_SHOULDER],
    landmarks[LANDMARK.LEFT_ELBOW],
    landmarks[LANDMARK.LEFT_WRIST]
  );
}

/** Get the right elbow angle */
export function getRightElbowAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.RIGHT_SHOULDER],
    landmarks[LANDMARK.RIGHT_ELBOW],
    landmarks[LANDMARK.RIGHT_WRIST]
  );
}

/** Get the left knee angle (hip → knee → ankle) */
export function getLeftKneeAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.LEFT_HIP],
    landmarks[LANDMARK.LEFT_KNEE],
    landmarks[LANDMARK.LEFT_ANKLE]
  );
}

/** Get the right knee angle */
export function getRightKneeAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.RIGHT_HIP],
    landmarks[LANDMARK.RIGHT_KNEE],
    landmarks[LANDMARK.RIGHT_ANKLE]
  );
}

/** Get the left hip angle (shoulder → hip → knee) */
export function getLeftHipAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.LEFT_SHOULDER],
    landmarks[LANDMARK.LEFT_HIP],
    landmarks[LANDMARK.LEFT_KNEE]
  );
}

/** Get the right hip angle */
export function getRightHipAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.RIGHT_SHOULDER],
    landmarks[LANDMARK.RIGHT_HIP],
    landmarks[LANDMARK.RIGHT_KNEE]
  );
}

/** Get the left shoulder angle (elbow → shoulder → hip) */
export function getLeftShoulderAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.LEFT_ELBOW],
    landmarks[LANDMARK.LEFT_SHOULDER],
    landmarks[LANDMARK.LEFT_HIP]
  );
}

/** Get the right shoulder angle */
export function getRightShoulderAngle(landmarks: PoseLandmark[]): number {
  return calculateAngle(
    landmarks[LANDMARK.RIGHT_ELBOW],
    landmarks[LANDMARK.RIGHT_SHOULDER],
    landmarks[LANDMARK.RIGHT_HIP]
  );
}

// ─── Form Validation ────────────────────────────────────

/**
 * Check a set of angle rules against current landmarks.
 * Returns feedback for any violations.
 */
export function validateForm(
  landmarks: PoseLandmark[],
  rules: AngleRule[],
  currentPhase: 'concentric' | 'eccentric'
): FormFeedback[] {
  const feedback: FormFeedback[] = [];

  for (const rule of rules) {
    if (rule.phase !== 'both' && rule.phase !== currentPhase) continue;

    const [a, b, c] = rule.landmarks;
    const angle = calculateAngle3D(landmarks[a], landmarks[b], landmarks[c]);

    if (angle < rule.minAngle) {
      feedback.push({
        type: 'warning',
        joint: rule.name,
        message: rule.feedback,
        angle,
        target_angle: rule.minAngle,
      });
    } else if (angle > rule.maxAngle) {
      feedback.push({
        type: 'warning',
        joint: rule.name,
        message: rule.feedback,
        angle,
        target_angle: rule.maxAngle,
      });
    }
  }

  return feedback;
}

// ─── Visibility Check ───────────────────────────────────

/** Check if key landmarks are visible enough for analysis */
export function areLandmarksVisible(
  landmarks: PoseLandmark[],
  requiredIndices: number[],
  threshold: number = 0.5
): boolean {
  return requiredIndices.every(
    (i) => landmarks[i] && landmarks[i].visibility >= threshold
  );
}

// ─── Body Alignment ─────────────────────────────────────

/** Check if the user is roughly facing the camera (front view) */
export function isFacingCamera(landmarks: PoseLandmark[]): boolean {
  const leftShoulder = landmarks[LANDMARK.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARK.RIGHT_SHOULDER];
  // If shoulders are roughly at same Z depth, user is facing camera
  return Math.abs(leftShoulder.z - rightShoulder.z) < 0.15;
}

/** Check if the user is in side view */
export function isSideView(landmarks: PoseLandmark[]): boolean {
  const leftShoulder = landmarks[LANDMARK.LEFT_SHOULDER];
  const rightShoulder = landmarks[LANDMARK.RIGHT_SHOULDER];
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  // In side view, shoulder width appears very narrow
  return shoulderWidth < 0.08;
}
