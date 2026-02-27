/**
 * Components — Barrel Export
 *
 * Import shared components from one place:
 *   import { ProgressDots, ContinueButton, EmptyState, AnimatedPressable } from '@/components';
 */

// Onboarding
export { ProgressDots } from './ProgressDots';
export { ContinueButton } from './ContinueButton';
export { BackButton } from './BackButton';
export { GlassCard } from './GlassCard';
export { default as AILoader } from './AILoader';

// Shared UI
export { ProgressRing } from './ProgressRing';
export { CategoryPills } from './CategoryPills';
export { ScreenHeader } from './ScreenHeader';
export { EmptyState } from './EmptyState';
export { SettingsRow, SettingsSection } from './SettingsRow';

// Skeletons
export { WorkoutCardSkeleton, ExerciseCardSkeleton } from './SkeletonCard';

// Animation
export { AnimatedPressable } from './AnimatedPressable';
export { FadeInView } from './FadeInView';
export { default as AnimatedBodyView } from './AnimatedBodyView';
