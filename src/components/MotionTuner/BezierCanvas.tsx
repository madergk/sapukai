import * as React from 'react'
import { useMotion } from '@/context/MotionContext'
import {
  generateBezierPath,
  bezierToCanvas,
  canvasToBezier,
  constrainControlPoint,
  isNearPoint,
  type BezierPoint,
} from '@/utils/bezier'

interface BezierCanvasProps {
  width?: number
  height?: number
  className?: string
}

export function BezierCanvas({ width = 400, height = 400, className }: BezierCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { state, setEasingCurve } = useMotion()

  const [hoveredPoint, setHoveredPoint] = React.useState<1 | 2 | null>(null)
  const [draggedPoint, setDraggedPoint] = React.useState<1 | 2 | null>(null)

  const padding = 40
  const plotSize = width - 2 * padding

  // Draw the canvas
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const rootStyles = getComputedStyle(document.documentElement)
    const brandPrimary = rootStyles.getPropertyValue('--motion-brand-primary').trim() || '#00686f'
    const brandHover =
      rootStyles.getPropertyValue('--motion-brand-primary-hover').trim() || '#0d9488'
    const brandAccent =
      rootStyles.getPropertyValue('--motion-brand-primary-accent').trim() || '#14b8a6'
    const gridColor =
      rootStyles.getPropertyValue('--motion-canvas-grid').trim() || 'rgba(0, 0, 0, 0.08)'
    const axisLabelColor =
      rootStyles.getPropertyValue('--motion-canvas-axis-label').trim() || 'rgba(0, 0, 0, 0.38)'
    const controlLineColor =
      rootStyles.getPropertyValue('--motion-canvas-control-line').trim() || 'rgba(0, 0, 0, 0.2)'
    const labelColor =
      rootStyles.getPropertyValue('--motion-canvas-label').trim() || 'rgba(0, 0, 0, 0.6)'

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    for (let i = 0; i <= 4; i++) {
      const pos = padding + (plotSize / 4) * i

      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(pos, padding)
      ctx.lineTo(pos, height - padding)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(padding, pos)
      ctx.lineTo(width - padding, pos)
      ctx.stroke()
    }

    // Draw axes labels
    ctx.fillStyle = axisLabelColor
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'

    // X-axis labels
    for (let i = 0; i <= 4; i++) {
      const x = padding + (plotSize / 4) * i
      const label = (i / 4).toFixed(1)
      ctx.fillText(label, x, height - padding + 20)
    }

    // Y-axis labels
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const y = padding + (plotSize / 4) * i
      const label = (1 - i / 4).toFixed(1)
      ctx.fillText(label, padding - 10, y + 4)
    }

    // Draw bezier curve
    const path = generateBezierPath(state.easingCurve, 100)

    ctx.strokeStyle = brandPrimary
    ctx.lineWidth = 3
    ctx.beginPath()

    path.forEach((point, index) => {
      const canvasCoords = bezierToCanvas(point.x, point.y, width, padding)
      if (index === 0) {
        ctx.moveTo(canvasCoords.x, canvasCoords.y)
      } else {
        ctx.lineTo(canvasCoords.x, canvasCoords.y)
      }
    })

    ctx.stroke()

    // Draw control point lines
    const p0 = bezierToCanvas(0, 0, width, padding)
    const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
    const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)
    const p3 = bezierToCanvas(1, 1, width, padding)

    ctx.strokeStyle = controlLineColor
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    // Line from P0 to P1
    ctx.beginPath()
    ctx.moveTo(p0.x, p0.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()

    // Line from P2 to P3
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.stroke()

    ctx.setLineDash([])

    // Draw control points
    const drawControlPoint = (px: number, py: number, pointIndex: 1 | 2) => {
      const isHovered = hoveredPoint === pointIndex
      const isDragged = draggedPoint === pointIndex

      // Shadow/glow effect
      if (isHovered || isDragged) {
        ctx.shadowColor = brandPrimary
        ctx.shadowBlur = isDragged ? 20 : 12
      }

      // Point circle
      ctx.fillStyle = isDragged ? brandPrimary : isHovered ? brandHover : brandAccent
      ctx.beginPath()
      ctx.arc(px, py, isDragged ? 8 : isHovered ? 7 : 6, 0, Math.PI * 2)
      ctx.fill()

      // Reset shadow
      ctx.shadowBlur = 0

      // White border
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(px, py, isDragged ? 8 : isHovered ? 7 : 6, 0, Math.PI * 2)
      ctx.stroke()
    }

    drawControlPoint(p1.x, p1.y, 1)
    drawControlPoint(p2.x, p2.y, 2)

    // Draw coordinate labels
    ctx.font = '11px "Martian Mono", monospace'
    ctx.fillStyle = labelColor
    ctx.textAlign = 'left'

    // P1 label
    const p1Label = `(${state.easingCurve[0].toFixed(2)}, ${state.easingCurve[1].toFixed(2)})`
    ctx.fillText(p1Label, p1.x + 12, p1.y - 8)

    // P2 label
    const p2Label = `(${state.easingCurve[2].toFixed(2)}, ${state.easingCurve[3].toFixed(2)})`
    ctx.fillText(p2Label, p2.x + 12, p2.y - 8)
  }, [state.easingCurve, hoveredPoint, draggedPoint, width, height, padding, plotSize])

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
    const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)

    if (isNearPoint(mouseX, mouseY, p1.x, p1.y, 12)) {
      setDraggedPoint(1)
    } else if (isNearPoint(mouseX, mouseY, p2.x, p2.y, 12)) {
      setDraggedPoint(2)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    if (draggedPoint !== null) {
      // Update control point position
      const bezierCoords = canvasToBezier(mouseX, mouseY, width, padding)
      const constrained = constrainControlPoint(bezierCoords.x, bezierCoords.y)

      const newCurve: BezierPoint = [...state.easingCurve]
      if (draggedPoint === 1) {
        newCurve[0] = constrained.x
        newCurve[1] = constrained.y
      } else {
        newCurve[2] = constrained.x
        newCurve[3] = constrained.y
      }

      setEasingCurve(newCurve)
    } else {
      // Check for hover
      const p1 = bezierToCanvas(state.easingCurve[0], state.easingCurve[1], width, padding)
      const p2 = bezierToCanvas(state.easingCurve[2], state.easingCurve[3], width, padding)

      if (isNearPoint(mouseX, mouseY, p1.x, p1.y, 12)) {
        setHoveredPoint(1)
      } else if (isNearPoint(mouseX, mouseY, p2.x, p2.y, 12)) {
        setHoveredPoint(2)
      } else {
        setHoveredPoint(null)
      }
    }
  }

  const handleMouseUp = () => {
    setDraggedPoint(null)
  }

  const handleMouseLeave = () => {
    setDraggedPoint(null)
    setHoveredPoint(null)
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width,
        height,
        cursor: draggedPoint ? 'grabbing' : hoveredPoint ? 'grab' : 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  )
}
