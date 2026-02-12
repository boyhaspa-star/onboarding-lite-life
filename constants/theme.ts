/**
 * Theme — Unified export of all design tokens.
 *
 * Two import styles supported:
 *
 * 1. Grouped (recommended):
 *    import { colors, typography, spacing } from '@/constants/theme';
 *    colors.brand.primary
 *
 * 2. Granular:
 *    import { brand, background, gray } from '@/constants/theme';
 *    brand.primary
 */

import * as colorsModule from './colors';
import * as typographyModule from './typography';
import * as spacingModule from './spacing';

// ─── Grouped exports (recommended) ─────────────────────

/** All color tokens grouped under one namespace */
export const colors = {
  brand: colorsModule.brand,
  background: colorsModule.background,
  gray: colorsModule.gray,
  text: colorsModule.text,
  border: colorsModule.border,
  overlay: colorsModule.overlay,
  tabBar: colorsModule.tabBar,
} as const;

/** All typography tokens grouped under one namespace */
export const typography = {
  fontFamily: typographyModule.fontFamily,
  fontSize: typographyModule.fontSize,
  lineHeight: typographyModule.lineHeight,
  fontWeight: typographyModule.fontWeight,
} as const;

/** All spacing/sizing tokens grouped under one namespace */
export const spacing = {
  ...spacingModule.spacing,
  screen: spacingModule.screen,
  radius: spacingModule.radius,
  ...spacingModule.size,
  zIndex: spacingModule.zIndex,
} as const;

// ─── Granular re-exports ────────────────────────────────
export * from './colors';
export * from './typography';
export * from './spacing';
