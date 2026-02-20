import * as React from 'react'
import { useMotion } from '@/context/MotionContext'
import {
  generateBezierPath,
  bezierToCanvas,
  canvasToBezier,
  constrainControlPoint,
  isNearPoint,
  clamp,
  type BezierPoint,
} from '@/utils/bezier'

interface BezierCanvasProps {
  width?: number
  height?: number
  className?: string
}

const MOUSE_HIT_RADIUS = 14
const TOUCH_HIT_RADIUS = 40
const KEYBOARD_STEP = 0.1
const KEYBOARD_STEP_FINE = 0.01

export function BezierCanvas({ width = 400, height = 400, className }: BezierCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { state, setEasingCurve } = useMotion()

  const [hoveredPoint, setHoveredPoint] = React.useState<1 | 2 | null>(null)
  const [draggedPoint, setDraggedPoint] = React.useState<1 | 2 | null>(null)
  const [focusedPoint, setFocusedPoint] = React.useState<1 | 2 | null>(null)

  const padding = 40
  const plotSize = width - 2 * padding

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    const rootStyles = getComputedStyle(document.documentElement)
    const brandPrimary = rootStyles.getPropertyValue('--motion-brand-primary').trim() || '#00686f'
    const accentP1 = rootStyles.getPropertyValue('--motion-accent-p1').trim() || '#0d9488'
    const accentP2 = rootStyles.getPropertyValue('--motion-accent-p2').trim() || '#8b5cf6'
    const gridColor =
      rootStyles.getPropertyValue('--motion-canvas-grid').trim() || 'rgba(0,0,0,0.08)'
    const axisLabelColor =
      rootStyles.getPropertyValue('--motion-canvas-axis-label').trim() || 'rgba(0,0,0,0.38)'
    const labelColor =
      rootStyles.getPropertyValue('--motion-canvas-label').trim() || 'rgba(0,0,0,0.6)'

    // Grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const pos = padding + (plotSize / 4) * i

      ctx.beginPath()
      ctx.moveTo(pos, padding)
      ctx.lineTo(pos, height - padding)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(padding, pos)
      ctx.lineTo(width - padding, pos)
      ctx.stroke()
    }

    // Axis labels
    ctx.fillStyle = axisLabelColor
    ctx.font = '11px Inter, sans-serif'
    ctx.textAlign = 'center'
    for (let i = 0; i <= 4; i++) {
      const x = padding + (plotSize / 4) * i
      ctx.fillText((i / 4).toFixed(1), x, height - padding + 18)
    }
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const y = padding + (plotSize / 4) * i
      ctx.fillText((1 - i / 4).toFixed(1), padding - 8, y + 4)
    }

    // Bezier curve
    const path = generateBezierPath(state.easingCurve, 100)
    ctx.strokeStyle = brandPrimary
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.beginPath()
    path.forEach((point, index) => {
      const c = bezierToCanvas(point.x, point.y, width, padding)
      if (index === 0) ctx.moveTo(c.x, c.y)
      else ctx.lineTo(c.x, c.y)
    })
    ctx.stroke()

    // Control point coordinates
    const p0 = bezierToCanvas(0, 0, width, padding)
    const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
    const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)
    const p3 = bezierToCanvas(1, 1, width, padding)

    // Tether: P0 → P1
    ctx.globalAlpha = 0.45
    ctx.strokeStyle = accentP1
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()

    // Tether: P2 → P3
    ctx.strokeStyle = accentP2
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.stroke()

    ctx.globalAlpha = 1
    ctx.setLineDash([])

    // Anchor points P0 and P3
    const anchorColor =
      rootStyles.getPropertyValue('--motion-canvas-control-line').trim() || 'rgba(0,0,0,0.25)'
    ;[p0, p3].forEach(p => {
      ctx.fillStyle = anchorColor
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Control points
    const drawControlPoint = (px: number, py: number, pointIndex: 1 | 2) => {
      const isHovered = hoveredPoint === pointIndex
      const isDragged = draggedPoint === pointIndex
      const isFocused = focusedPoint === pointIndex
      const accent = pointIndex === 1 ? accentP1 : accentP2
      const radius = isDragged ? 8 : isHovered ? 7 : 6

      // Focus ring (keyboard selection indicator)
      if (isFocused) {
        ctx.globalAlpha = 0.25
        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(px, py, radius + 9, 0, Math.PI * 2)
        ctx.fill()

        ctx.globalAlpha = 0.6
        ctx.strokeStyle = accent
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(px, py, radius + 6, 0, Math.PI * 2)
        ctx.stroke()

        ctx.globalAlpha = 1
      }

      // Glow on hover / drag
      if (isHovered || isDragged) {
        ctx.shadowColor = accent
        ctx.shadowBlur = isDragged ? 18 : 10
      }

      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // White inner ring
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    drawControlPoint(p1.x, p1.y, 1)
    drawControlPoint(p2.x, p2.y, 2)

    // Coordinate labels
    ctx.font = '11px "Martian Mono", monospace'
    ctx.shadowBlur = 0
    ctx.textAlign = 'left'

    ctx.fillStyle = accentP1
    ctx.globalAlpha = 0.85
    ctx.fillText(
      `${state.easingCurve[0].toFixed(2)}, ${state.easingCurve[1].toFixed(2)}`,
      p1.x + 12,
      p1.y - 8
    )

    ctx.fillStyle = accentP2
    ctx.fillText(
      `${state.easingCurve[2].toFixed(2)}, ${state.easingCurve[3].toFixed(2)}`,
      p2.x + 12,
      p2.y - 8
    )

    ctx.globalAlpha = 1

    // Keyboard hint when a point is focused
    if (focusedPoint !== null) {
      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = labelColor
      ctx.globalAlpha = 0.6
      ctx.textAlign = 'center'
      ctx.fillText('↑ ↓ ← →  move  ·  shift = fine', width / 2, height - 6)
      ctx.globalAlpha = 1
    }
  }, [
    state.easingCurve,
    hoveredPoint,
    draggedPoint,
    focusedPoint,
    width,
    height,
    padding,
    plotSize,
  ])

  // ── Mouse ────────────────────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
    const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)

    if (isNearPoint(mx, my, p1.x, p1.y, MOUSE_HIT_RADIUS)) {
      setDraggedPoint(1)
      setFocusedPoint(1)
    } else if (isNearPoint(mx, my, p2.x, p2.y, MOUSE_HIT_RADIUS)) {
      setDraggedPoint(2)
      setFocusedPoint(2)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    if (draggedPoint !== null) {
      const b = canvasToBezier(mx, my, width, padding)
      const c = constrainControlPoint(b.x, b.y)
      const newCurve: BezierPoint = [...state.easingCurve]
      if (draggedPoint === 1) {
        newCurve[0] = c.x
        newCurve[1] = c.y
      } else {
        newCurve[2] = c.x
        newCurve[3] = c.y
      }
      setEasingCurve(newCurve)
    } else {
      const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
      const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)
      if (isNearPoint(mx, my, p1.x, p1.y, MOUSE_HIT_RADIUS)) setHoveredPoint(1)
      else if (isNearPoint(mx, my, p2.x, p2.y, MOUSE_HIT_RADIUS)) setHoveredPoint(2)
      else setHoveredPoint(null)
    }
  }

  const handleMouseUp = () => setDraggedPoint(null)

  const handleMouseLeave = () => {
    setDraggedPoint(null)
    setHoveredPoint(null)
  }

  // ── Touch ────────────────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    e.preventDefault()

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const tx = touch.clientX - rect.left
    const ty = touch.clientY - rect.top

    const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
    const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)

    if (isNearPoint(tx, ty, p1.x, p1.y, TOUCH_HIT_RADIUS)) {
      setDraggedPoint(1)
      setFocusedPoint(1)
    } else if (isNearPoint(tx, ty, p2.x, p2.y, TOUCH_HIT_RADIUS)) {
      setDraggedPoint(2)
      setFocusedPoint(2)
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || draggedPoint === null) return
    e.preventDefault()

    const touch = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    const tx = touch.clientX - rect.left
    const ty = touch.clientY - rect.top

    const b = canvasToBezier(tx, ty, width, padding)
    const c = constrainControlPoint(b.x, b.y)
    const newCurve: BezierPoint = [...state.easingCurve]
    if (draggedPoint === 1) {
      newCurve[0] = c.x
      newCurve[1] = c.y
    } else {
      newCurve[2] = c.x
      newCurve[3] = c.y
    }
    setEasingCurve(newCurve)
  }

  const handleTouchEnd = () => setDraggedPoint(null)

  // ── Keyboard ─────────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const step = e.shiftKey ? KEYBOARD_STEP_FINE : KEYBOARD_STEP

    if (e.key === 'Tab') {
      if (!e.shiftKey) {
        if (focusedPoint === null) {
          e.preventDefault()
          setFocusedPoint(1)
        } else if (focusedPoint === 1) {
          e.preventDefault()
          setFocusedPoint(2)
        } else {
          setFocusedPoint(null)
        }
      } else {
        if (focusedPoint === 2) {
          e.preventDefault()
          setFocusedPoint(1)
        } else if (focusedPoint === 1) {
          e.preventDefault()
          setFocusedPoint(null)
        }
      }
      return
    }

    if (focusedPoint === null) return

    const newCurve: BezierPoint = [...state.easingCurve]

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        if (focusedPoint === 1) newCurve[0] = clamp(newCurve[0] - step, 0, 1)
        else newCurve[2] = clamp(newCurve[2] - step, 0, 1)
        setEasingCurve(newCurve)
        break
      case 'ArrowRight':
        e.preventDefault()
        if (focusedPoint === 1) newCurve[0] = clamp(newCurve[0] + step, 0, 1)
        else newCurve[2] = clamp(newCurve[2] + step, 0, 1)
        setEasingCurve(newCurve)
        break
      case 'ArrowUp':
        e.preventDefault()
        if (focusedPoint === 1) newCurve[1] = newCurve[1] + step
        else newCurve[3] = newCurve[3] + step
        setEasingCurve(newCurve)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (focusedPoint === 1) newCurve[1] = newCurve[1] - step
        else newCurve[3] = newCurve[3] - step
        setEasingCurve(newCurve)
        break
      case 'Escape':
        setFocusedPoint(null)
        break
    }
  }

  const handleFocus = () => {
    if (focusedPoint === null) setFocusedPoint(1)
  }

  const handleBlur = () => setFocusedPoint(null)

  return (
    <div className="relative flex flex-col items-center gap-2">
      <canvas
        ref={canvasRef}
        className={className}
        tabIndex={0}
        role="application"
        aria-label={`Bezier curve editor. P1: ${state.easingCurve[0].toFixed(2)}, ${state.easingCurve[1].toFixed(2)}. P2: ${state.easingCurve[2].toFixed(2)}, ${state.easingCurve[3].toFixed(2)}. Tab to select control points, arrow keys to move, Shift for fine control.`}
        style={{
          width,
          height,
          cursor: draggedPoint ? 'grabbing' : hoveredPoint ? 'grab' : 'default',
          outline: 'none',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

      {/* Accessibility legend */}
      <div className="flex items-center gap-3 px-1 text-[11px] text-[var(--motion-text-muted)]">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: 'var(--motion-accent-p1)' }}
          />
          P1
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: 'var(--motion-accent-p2)' }}
          />
          P2
        </span>
        <span className="ml-auto opacity-60">Tab · ↑↓←→ · Shift</span>
      </div>
    </div>
  )
}
