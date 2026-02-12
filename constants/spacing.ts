/**
 * Design Tokens — Spacing & Sizing
 * Consistent spacing scale and common component sizes.
 */

// ─── Spacing Scale (multiples of 4) ────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

// ─── Screen Padding ─────────────────────────────────────
export const screen = {
  paddingHorizontal: 20,       // Default screen horizontal padding
  paddingHorizontalLg: 24,     // Onboarding screens
  paddingTop: 8,
  paddingBottom: 16,
} as const;

// ─── Border Radius ──────────────────────────────────────
export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  full: 100,
} as const;

// ─── Common Component Sizes ─────────────────────────────
export const size = {
  // Icon buttons (back, close, etc.)
  iconButton: 44,
  iconButtonRadius: 22,

  // Icon containers
  iconContainer: 48,
  iconContainerLg: 60,
  iconContainerXl: 70,

  // Progress dots
  progressDotWidth: 32,
  progressDotHeight: 4,

  // Touch targets (minimum 44pt for accessibility)
  touchTarget: 44,
} as const;

// ─── Z-Index ────────────────────────────────────────────
export const zIndex = {
  base: 0,
  card: 1,
  overlay: 10,
  modal: 100,
  toast: 1000,
} as const;
