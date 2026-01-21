/**
 * Color tokens extracted from Catalyst UI Figma design
 * Based on Tailwind CSS color palette with semantic naming
 */

// Core primitive colors
export const primitiveColors = {
  white: '#ffffff',
  
  // Zinc scale (neutral)
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Brand color - Indigo
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Semantic colors for badges and states
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    500: '#f97316',
    700: '#c2410c',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    700: '#b45309',
  },
  yellow: {
    50: '#fefce8',
    100: '#fef9c3',
    500: '#eab308',
    700: '#a16207',
  },
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    500: '#84cc16',
    700: '#4d7c0f',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    700: '#15803d',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    700: '#047857',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',
    700: '#0f766e',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    500: '#06b6d4',
    700: '#0e7490',
  },
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    700: '#0369a1',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    700: '#1d4ed8',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    500: '#8b5cf6',
    700: '#6d28d9',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
  },
  fuchsia: {
    50: '#fdf4ff',
    100: '#fae8ff',
    500: '#d946ef',
    700: '#a21caf',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    500: '#ec4899',
    700: '#be185d',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    500: '#f43f5e',
    700: '#be123c',
  },
  gray: {
    400: '#9ca3af',
  },
} as const

// Semantic color tokens - Light theme
export const lightColors = {
  content: {
    primary: primitiveColors.zinc[950],
    secondary: primitiveColors.zinc[500],
    tertiary: primitiveColors.zinc[400],
    disabled: primitiveColors.gray[400],
  },
  background: {
    primary: primitiveColors.white,
    secondary: primitiveColors.zinc[50],
    tertiary: primitiveColors.zinc[100],
    hover: primitiveColors.blue[500],
    hoverOverlay: 'rgba(0, 0, 0, 0.024)',
  },
  border: {
    primary: primitiveColors.zinc[200],
    secondary: primitiveColors.zinc[100],
    hoverOverlay: 'rgba(0, 0, 0, 0.2)',
    error: primitiveColors.red[500],
    info: primitiveColors.blue[500],
  },
} as const

// Semantic color tokens - Dark theme
export const darkColors = {
  content: {
    primary: primitiveColors.white,
    secondary: primitiveColors.zinc[400],
    tertiary: primitiveColors.zinc[500],
    disabled: primitiveColors.gray[400],
  },
  background: {
    primary: primitiveColors.zinc[950],
    secondary: primitiveColors.zinc[900],
    tertiary: primitiveColors.zinc[800],
    hover: primitiveColors.blue[500],
    hoverOverlay: 'rgba(255, 255, 255, 0.05)',
  },
  border: {
    primary: primitiveColors.zinc[700],
    secondary: primitiveColors.zinc[800],
    tertiary: primitiveColors.zinc[950],
    hoverOverlay: 'rgba(255, 255, 255, 0.1)',
    error: primitiveColors.red[500],
    info: primitiveColors.blue[500],
  },
} as const

// Badge color variants
export const badgeColors = [
  'zinc',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const

export type BadgeColor = (typeof badgeColors)[number]
