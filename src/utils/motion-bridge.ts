import type { Transition } from 'motion/react'
import type { BezierPoint } from './bezier'

/**
 * Optional utility to convert cubic-bezier values to Motion transition.
 * Use this only for Motion Primitives previews or the Framer Motion export.
 */
export function bezierToMotionTransition(bezier: BezierPoint, durationMs: number): Transition {
  return {
    duration: durationMs / 1000,
    ease: bezier as [number, number, number, number],
  }
}

/**
 * Generate a Framer Motion code snippet for export.
 */
export function generateFramerMotionExport(bezier: BezierPoint, durationMs: number): string {
  return `// Framer Motion / Motion
import { motion } from 'motion/react'

const transition = {
  duration: ${(durationMs / 1000).toFixed(2)},
  ease: [${bezier.join(', ')}],
}

// Usage
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={transition}
>
  Content
</motion.div>`
}
