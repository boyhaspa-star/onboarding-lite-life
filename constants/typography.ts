/**
 * Design Tokens — Typography
 * Font families, sizes, and pre-composed text styles.
 */

// ─── Font Families ──────────────────────────────────────
export const fontFamily = {
  heading: 'Audiowide',
  body: 'Averta',
  bodyBold: 'Averta-Bold',
} as const;

// ─── Font Sizes ─────────────────────────────────────────
export const fontSize = {
  xs: 10,
  sm: 11,
  md: 12,
  base: 13,
  lg: 14,
  xl: 16,
  '2xl': 18,
  '3xl': 20,
  '4xl': 24,
  '5xl': 28,
  '6xl': 32,
  '7xl': 40,
  '8xl': 48,
} as const;

// ─── Line Heights ───────────────────────────────────────
export const lineHeight = {
  tight: 16,
  normal: 18,
  relaxed: 20,
  loose: 24,
  heading: 28,
} as const;

// ─── Font Weights ───────────────────────────────────────
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};
