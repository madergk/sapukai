/**
 * Spacing tokens extracted from Catalyst UI Figma design
 * Based on 4px base unit system
 */

// Raw spacing values (in pixels)
export const spacingPx = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const

// Spacing scale as rem values (for CSS)
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const

// Component-specific padding presets
export const componentPadding = {
  sm: spacing[1],      // 4px
  base: spacing[1.5],  // 6px
  lg: spacing[2],      // 8px
  xl: spacing[2.5],    // 10px
  '2xl': spacing[3],   // 12px
  '4xl': spacing[4],   // 16px
} as const

// Border radius values
export const borderRadius = {
  none: '0',
  sm: '0.25rem',      // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const

// Border width
export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
} as const
