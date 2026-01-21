/**
 * Shadow and effect tokens extracted from Catalyst UI Figma design
 */

// Box shadows
export const shadows = {
  none: 'none',
  
  // shadow-sm: subtle shadow for cards
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Default shadow
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  
  // Medium shadow
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  
  // Large shadow (from Figma shadow-lg)
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  
  // Extra large shadow
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  
  // 2XL shadow
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Inner shadow (from Figma shadow-inner)
  inner: 'inset 0 2px 0 0 rgba(255, 255, 255, 0.15)',
} as const

// Focus ring styles
export const focusRing = {
  // Primary focus ring using Indigo (from Figma Focus State)
  primary: '0 0 0 4px #6366f1, 0 0 0 2px #ffffff, 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Error focus ring
  error: '0 0 0 4px #ef4444, 0 0 0 2px #ffffff, 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  // Dark mode focus ring
  primaryDark: '0 0 0 4px #6366f1, 0 0 0 2px #09090b, 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  errorDark: '0 0 0 4px #ef4444, 0 0 0 2px #09090b, 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
} as const

// Backdrop blur
export const backdropBlur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const

// Transition durations
export const duration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms',
} as const

// Transition easing
export const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const
