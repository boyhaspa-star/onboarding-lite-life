/**
 * Design Tokens — Colors
 * Single source of truth for every color in the app.
 * Never use a raw hex/rgba in a component file.
 */

// ─── Brand ──────────────────────────────────────────────
export const brand = {
  primary: '#CDFC00',       // Lime accent — buttons, highlights, active states
  primaryAlt: '#E6FE58',    // Yellow-green — landing page, birthday
  primaryDark: '#373E16',   // Dark lime — progress circle track
  cta: '#FF6B35',           // Orange — action buttons (Start workout)
  blue: '#307FF2',          // Blue — play button on landing
  green: '#22c55e',         // Green — success, birthday highlight
} as const;

// ─── Backgrounds ────────────────────────────────────────
export const background = {
  primary: '#0A0A0A',       // Main screen background
  pure: '#000000',          // Pure black — landing, modals
  surface: '#1A1A1A',       // Card / surface background
  surfaceAlt: '#141414',    // Slightly darker surface
  elevated: '#1F1F1F',      // Elevated cards
  muted: '#252525',         // Muted panels
} as const;

// ─── Gray Scale ─────────────────────────────────────────
export const gray = {
  50: '#F5F5F5',
  100: '#E5E5E5',
  200: '#CCCCCC',
  300: '#C3C3C3',
  400: '#AAAAAA',
  500: '#999999',
  600: '#888888',
  700: '#6D6D6D',
  800: '#666666',
  900: '#555555',
  1000: '#444444',
  1100: '#3A3A3A',
  1200: '#333333',
  1300: '#2A2A2A',
  1400: '#1A1A1A',
} as const;

// ─── Text ───────────────────────────────────────────────
export const text = {
  primary: '#FFFFFF',
  secondary: '#C3C3C3',
  muted: '#999999',
  subtle: '#888888',
  disabled: '#666666',
  inverse: '#000000',
  accent: brand.primary,
  cta: brand.cta,
} as const;

// ─── Borders ────────────────────────────────────────────
export const border = {
  default: '#333333',
  subtle: '#2A2A2A',
  accent: brand.primary,
  muted: '#3A3A3A',
} as const;

// ─── Overlays (semi-transparent) ────────────────────────
export const overlay = {
  // White overlays
  white3: 'rgba(255, 255, 255, 0.03)',
  white5: 'rgba(255, 255, 255, 0.05)',
  white8: 'rgba(255, 255, 255, 0.08)',
  white10: 'rgba(255, 255, 255, 0.1)',
  white12: 'rgba(255, 255, 255, 0.12)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white60: 'rgba(255, 255, 255, 0.6)',
  white70: 'rgba(255, 255, 255, 0.7)',

  // Dark overlays
  dark90: 'rgba(30, 30, 30, 0.9)',
  dark80: 'rgba(50, 50, 50, 0.8)',
  dark50: 'rgba(60, 60, 60, 0.5)',

  // Accent overlays
  accent5: 'rgba(205, 252, 0, 0.05)',
  accent8: 'rgba(205, 252, 0, 0.08)',
  accent10: 'rgba(205, 252, 0, 0.1)',
  accent15: 'rgba(205, 252, 0, 0.15)',
  accent20: 'rgba(205, 252, 0, 0.2)',
  accent25: 'rgba(205, 252, 0, 0.25)',

  // Green overlays
  green10: 'rgba(34, 197, 94, 0.1)',
  green15: 'rgba(34, 197, 94, 0.15)',
  green20: 'rgba(34, 197, 94, 0.2)',
} as const;

// ─── Tab Bar ────────────────────────────────────────────
export const tabBar = {
  background: '#1A1A1A',
  active: brand.primary,
  inactive: '#6D6D6D',
} as const;
