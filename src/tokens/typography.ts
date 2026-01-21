/**
 * Typography tokens extracted from Catalyst UI Figma design
 * Uses Inter font family throughout
 */

export const fontFamily = {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
} as const

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '2.25rem', // 36px
  '8xl': '8rem',    // 128px (Display XL)
} as const

export const lineHeight = {
  none: '1',
  tight: '1.1',
  snug: '1.25',
  normal: '1.5',
  relaxed: '1.625',
  // Specific values from Figma
  '16': '1rem',     // 16px
  '20': '1.25rem',  // 20px
  '24': '1.5rem',   // 24px
  '28': '1.75rem',  // 28px
  '32': '2rem',     // 32px
  '40': '2.5rem',   // 40px
  '128': '8rem',    // 128px
} as const

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  // Specific values from Figma
  display: '-2.5px', // For display/heading text
} as const

// Typography scale presets
export const typography = {
  // Display
  displayXl: {
    fontSize: fontSize['8xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight['128'],
    letterSpacing: letterSpacing.display,
  },
  
  // Headings
  headingLg: {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight['40'],
    letterSpacing: letterSpacing.display,
  },
  headingSm: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight['32'],
    letterSpacing: letterSpacing.display,
  },
  
  // Paragraphs
  paragraphLg: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight['28'],
    letterSpacing: letterSpacing.normal,
  },
  paragraphBase: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight['24'],
    letterSpacing: letterSpacing.normal,
  },
  paragraphSm: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight['20'],
    letterSpacing: letterSpacing.normal,
  },
  paragraphXs: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight['16'],
    letterSpacing: letterSpacing.normal,
  },
  
  // Labels
  labelLg: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['28'],
    letterSpacing: letterSpacing.normal,
  },
  labelBase: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['24'],
    letterSpacing: letterSpacing.normal,
  },
  labelSm: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['20'],
    letterSpacing: letterSpacing.normal,
  },
  labelXs: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight['16'],
    letterSpacing: letterSpacing.normal,
  },
} as const
