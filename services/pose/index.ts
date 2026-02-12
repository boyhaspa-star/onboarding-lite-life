/**
 * Pose Analysis Service — Barrel Export
 *
 * This is the public API for the pose estimation feature.
 * Import from '@/services/pose' in your hooks/screens.
 */

export { LANDMARK, calculateAngle, calculateAngle3D, validateForm, areLandmarksVisible, isFacingCamera, isSideView } from './poseMath';
export { getLeftElbowAngle, getRightElbowAngle, getLeftKneeAngle, getRightKneeAngle, getLeftHipAngle, getRightHipAngle, getLeftShoulderAngle, getRightShoulderAngle } from './poseMath';
export { distance2D, distance3D } from './poseMath';

export { OneEuroFilter, LandmarkFilter, createPoseFilterBank } from '../filters/oneEuroFilter';

export { createRepState, processFrame, getRepTempo } from './repCounter';
export type { RepState, RepPhase } from './repCounter';

export { exercisePoseConfigs, getExercisePoseConfig, getSupportedExercises } from './exerciseConfigs';
