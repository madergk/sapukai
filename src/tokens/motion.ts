/**
 * Motion Tokens - Material Design 3 Motion System
 *
 * These tokens define easing curves and durations following M3 principles:
 * - Emphasized: Expressive, personality-driven motion
 * - Standard: Common, balanced motion
 * - Legacy: Traditional web timing functions
 * - Utility: Functional, mechanical motion
 */

export const easingTokens = {
  // Emphasized - Expressive motion for attention-grabbing interactions
  emphasized: {
    name: 'Emphasized',
    value: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    description: 'Expressive easing for important transitions',
    category: 'emphasized',
  },
  emphasizedDecelerate: {
    name: 'Emphasized Decelerate',
    value: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
    description: 'Elements entering the screen',
    category: 'emphasized',
  },
  emphasizedAccelerate: {
    name: 'Emphasized Accelerate',
    value: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
    description: 'Elements leaving the screen',
    category: 'emphasized',
  },

  // Standard - Most common motion pattern
  standard: {
    name: 'Standard',
    value: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    description: 'Standard motion for common transitions',
    category: 'standard',
  },
  standardDecelerate: {
    name: 'Standard Decelerate',
    value: 'cubic-bezier(0.0, 0.0, 0, 1.0)',
    description: 'Elements entering view',
    category: 'standard',
  },
  standardAccelerate: {
    name: 'Standard Accelerate',
    value: 'cubic-bezier(0.3, 0.0, 1, 1)',
    description: 'Elements exiting view',
    category: 'standard',
  },

  // Legacy - Traditional CSS easing functions
  linear: {
    name: 'Linear',
    value: 'cubic-bezier(0.0, 0.0, 1.0, 1.0)',
    description: 'Constant speed, no acceleration',
    category: 'legacy',
  },
  ease: {
    name: 'Ease',
    value: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    description: 'CSS default ease',
    category: 'legacy',
  },
  easeIn: {
    name: 'Ease In',
    value: 'cubic-bezier(0.42, 0.0, 1.0, 1.0)',
    description: 'Slow start, fast end',
    category: 'legacy',
  },
  easeOut: {
    name: 'Ease Out',
    value: 'cubic-bezier(0.0, 0.0, 0.58, 1.0)',
    description: 'Fast start, slow end',
    category: 'legacy',
  },
  easeInOut: {
    name: 'Ease In Out',
    value: 'cubic-bezier(0.42, 0.0, 0.58, 1.0)',
    description: 'Slow start and end',
    category: 'legacy',
  },

  // Utility - Functional motion patterns
  exponentialIn: {
    name: 'Exponential In',
    value: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    description: 'Strong acceleration',
    category: 'utility',
  },
  exponentialOut: {
    name: 'Exponential Out',
    value: 'cubic-bezier(0.19, 1.0, 0.22, 1.0)',
    description: 'Strong deceleration',
    category: 'utility',
  },
} as const

export const durationTokens = {
  // Short durations - Quick micro-interactions
  short1: { name: 'Short 1', value: 50, description: 'Fastest transitions' },
  short2: { name: 'Short 2', value: 100, description: 'Very quick feedback' },
  short3: { name: 'Short 3', value: 150, description: 'Quick state changes' },
  short4: { name: 'Short 4', value: 200, description: 'Brief animations' },

  // Medium durations - Most common transitions
  medium1: { name: 'Medium 1', value: 250, description: 'Standard transitions' },
  medium2: { name: 'Medium 2', value: 300, description: 'Default duration' },
  medium3: { name: 'Medium 3', value: 350, description: 'Moderate animations' },
  medium4: { name: 'Medium 4', value: 400, description: 'Balanced timing' },

  // Long durations - Complex animations
  long1: { name: 'Long 1', value: 450, description: 'Extended transitions' },
  long2: { name: 'Long 2', value: 500, description: 'Long animations' },
  long3: { name: 'Long 3', value: 550, description: 'Detailed sequences' },
  long4: { name: 'Long 4', value: 600, description: 'Complex movements' },

  // Extra long durations - Cinematic effects
  extraLong1: { name: 'Extra Long 1', value: 700, description: 'Dramatic entry' },
  extraLong2: { name: 'Extra Long 2', value: 800, description: 'Hero animations' },
  extraLong3: { name: 'Extra Long 3', value: 900, description: 'Cinematic timing' },
  extraLong4: { name: 'Extra Long 4', value: 1000, description: 'Maximum duration' },
} as const

// Helper to parse cubic-bezier string to array
export function parseCubicBezier(value: string): [number, number, number, number] | null {
  const match = value.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/)
  if (!match) return null
  return [
    parseFloat(match[1]),
    parseFloat(match[2]),
    parseFloat(match[3]),
    parseFloat(match[4]),
  ]
}

// Helper to format array to cubic-bezier string
export function formatCubicBezier(points: [number, number, number, number]): string {
  return `cubic-bezier(${points[0]}, ${points[1]}, ${points[2]}, ${points[3]})`
}

// Type exports
export type EasingToken = keyof typeof easingTokens
export type DurationToken = keyof typeof durationTokens
