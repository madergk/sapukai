/**
 * Bezier Curve Utilities
 *
 * Mathematical functions for working with cubic bezier curves
 */

export type BezierPoint = [number, number, number, number]

/**
 * Evaluate a cubic bezier curve at parameter t (0-1)
 * Using the formula: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
 */
export function evaluateBezier(
  points: BezierPoint,
  t: number
): { x: number; y: number } {
  const [x1, y1, x2, y2] = points
  const t1 = 1 - t

  // P0 = (0,0), P3 = (1,1) for cubic-bezier timing functions
  const x =
    3 * t1 * t1 * t * x1 + 3 * t1 * t * t * x2 + t * t * t

  const y =
    3 * t1 * t1 * t * y1 + 3 * t1 * t * t * y2 + t * t * t

  return { x, y }
}

/**
 * Generate an array of points along the bezier curve
 * @param points - Control points [x1, y1, x2, y2]
 * @param steps - Number of segments to generate (default: 100)
 */
export function generateBezierPath(
  points: BezierPoint,
  steps: number = 100
): Array<{ x: number; y: number }> {
  const path: Array<{ x: number; y: number }> = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    path.push(evaluateBezier(points, t))
  }

  return path
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Constrain control point to valid bezier bounds
 * X must be between 0-1, Y can be any value
 */
export function constrainControlPoint(
  x: number,
  y: number
): { x: number; y: number } {
  return {
    x: clamp(x, 0, 1),
    y: y, // Y can be negative or > 1 for cubic-bezier
  }
}

/**
 * Format bezier points to CSS cubic-bezier string
 */
export function formatCubicBezierCSS(points: BezierPoint): string {
  return `cubic-bezier(${points[0].toFixed(2)}, ${points[1].toFixed(2)}, ${points[2].toFixed(2)}, ${points[3].toFixed(2)})`
}

/**
 * Parse CSS cubic-bezier string to points array
 */
export function parseCubicBezierCSS(css: string): BezierPoint | null {
  const match = css.match(
    /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/
  )

  if (!match) return null

  return [
    parseFloat(match[1]),
    parseFloat(match[2]),
    parseFloat(match[3]),
    parseFloat(match[4]),
  ]
}

/**
 * Convert canvas coordinates to bezier coordinates (0-1 range)
 * @param canvasX - X coordinate in canvas space
 * @param canvasY - Y coordinate in canvas space
 * @param canvasSize - Size of the canvas (assumes square)
 * @param padding - Padding around the canvas edges
 */
export function canvasToBezier(
  canvasX: number,
  canvasY: number,
  canvasSize: number,
  padding: number = 40
): { x: number; y: number } {
  const plotSize = canvasSize - 2 * padding

  return {
    x: (canvasX - padding) / plotSize,
    y: 1 - (canvasY - padding) / plotSize, // Invert Y axis
  }
}

/**
 * Convert bezier coordinates to canvas coordinates
 * @param bezierX - X coordinate in bezier space (0-1)
 * @param bezierY - Y coordinate in bezier space (0-1)
 * @param canvasSize - Size of the canvas (assumes square)
 * @param padding - Padding around the canvas edges
 */
export function bezierToCanvas(
  bezierX: number,
  bezierY: number,
  canvasSize: number,
  padding: number = 40
): { x: number; y: number } {
  const plotSize = canvasSize - 2 * padding

  return {
    x: padding + bezierX * plotSize,
    y: padding + (1 - bezierY) * plotSize, // Invert Y axis
  }
}

/**
 * Calculate distance between two points
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}

/**
 * Check if a point is near a control point (for hover/drag detection)
 */
export function isNearPoint(
  pointX: number,
  pointY: number,
  targetX: number,
  targetY: number,
  threshold: number = 10
): boolean {
  return distance(pointX, pointY, targetX, targetY) < threshold
}
