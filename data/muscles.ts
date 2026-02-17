/**
 * Muscle Groups — Single Source of Truth
 *
 * Used by:
 *   - Onboarding body parts selection
 *   - Workout program card highlights
 *   - Exercise detail body maps
 *   - OnboardingContext helpers
 */

import type { ExtendedBodyPart, Slug } from 'react-native-body-highlighter';

// ─── Types ──────────────────────────────────────────────

export type MuscleSide = 'front' | 'back' | 'both';
export type MuscleCategory = 'upper' | 'core' | 'lower';

export interface BodyPart extends ExtendedBodyPart {
  slug: Slug;
  intensity: number;
  side?: 'left' | 'right';
}

export interface MuscleGroupDef {
  id: string;
  name: string;
  category: MuscleCategory;
  side: MuscleSide;
  bodyParts: BodyPart[];
}

// ─── Data ───────────────────────────────────────────────

export const muscleGroups: MuscleGroupDef[] = [
  // Upper body
  { id: 'chest',      name: 'Chest',      category: 'upper', side: 'front', bodyParts: [{ slug: 'chest', intensity: 2 }] },
  { id: 'shoulders',  name: 'Shoulders',  category: 'upper', side: 'front', bodyParts: [{ slug: 'deltoids', intensity: 2 }] },
  { id: 'biceps',     name: 'Biceps',     category: 'upper', side: 'front', bodyParts: [{ slug: 'biceps', intensity: 2 }] },
  { id: 'forearms',   name: 'Forearms',   category: 'upper', side: 'front', bodyParts: [{ slug: 'forearm', intensity: 2 }] },
  { id: 'trapezius',  name: 'Traps',      category: 'upper', side: 'both',  bodyParts: [{ slug: 'trapezius', intensity: 2 }] },
  { id: 'triceps',    name: 'Triceps',    category: 'upper', side: 'back',  bodyParts: [{ slug: 'triceps', intensity: 2 }] },
  { id: 'upper-back', name: 'Upper Back', category: 'upper', side: 'back',  bodyParts: [{ slug: 'upper-back', intensity: 2 }] },
  { id: 'lower-back', name: 'Lower Back', category: 'upper', side: 'back',  bodyParts: [{ slug: 'lower-back', intensity: 2 }] },
  // Core
  { id: 'abs',        name: 'Abs',        category: 'core',  side: 'front', bodyParts: [{ slug: 'abs', intensity: 2 }] },
  { id: 'obliques',   name: 'Obliques',   category: 'core',  side: 'front', bodyParts: [{ slug: 'obliques', intensity: 2 }] },
  // Lower body
  { id: 'quadriceps', name: 'Quads',      category: 'lower', side: 'front', bodyParts: [{ slug: 'quadriceps', intensity: 2 }] },
  { id: 'adductors',  name: 'Adductors',  category: 'lower', side: 'front', bodyParts: [{ slug: 'adductors', intensity: 2 }] },
  { id: 'hamstrings', name: 'Hamstrings', category: 'lower', side: 'back',  bodyParts: [{ slug: 'hamstring', intensity: 2 }] },
  { id: 'glutes',     name: 'Glutes',     category: 'lower', side: 'back',  bodyParts: [{ slug: 'gluteal', intensity: 2 }] },
  { id: 'calves',     name: 'Calves',     category: 'lower', side: 'both',  bodyParts: [{ slug: 'calves', intensity: 2 }] },
];

// ─── Category Labels ────────────────────────────────────

export const muscleCategoryLabels: Record<MuscleCategory, string> = {
  upper: 'UPPER BODY',
  core: 'CORE',
  lower: 'LOWER BODY',
};

// ─── Helpers ────────────────────────────────────────────

/** Get body highlighter parts from a set of selected muscle group IDs */
export function getHighlightedPartsFromSelection(
  selectedMuscles: Set<string>
): ExtendedBodyPart[] {
  const parts: BodyPart[] = [];
  muscleGroups.forEach((group) => {
    if (selectedMuscles.has(group.id)) {
      parts.push(...group.bodyParts);
    }
  });
  return parts;
}

/** Get human-readable names from a set of selected muscle group IDs */
export function getSelectedMuscleNames(
  selectedMuscles: Set<string>
): string[] {
  return muscleGroups
    .filter((g) => selectedMuscles.has(g.id))
    .map((g) => g.name);
}

/** Get muscles filtered by category */
export function getMusclesByCategory(
  category: MuscleCategory
): MuscleGroupDef[] {
  return muscleGroups.filter((g) => g.category === category);
}

/** Get muscles that are visible on a given body side */
export function getMusclesForSide(
  side: 'front' | 'back'
): MuscleGroupDef[] {
  return muscleGroups.filter((g) => g.side === side || g.side === 'both');
}
