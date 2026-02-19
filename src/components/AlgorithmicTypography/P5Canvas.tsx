import { useEffect, useRef } from 'react'
import { TypographySketch } from '../../utils/typography-sketch'
import type { SketchParams } from '../../utils/typography-sketch'

interface P5CanvasProps {
  params: SketchParams
  onSketchReady?: (sketch: TypographySketch) => void
}

export function P5Canvas({ params, onSketchReady }: P5CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<TypographySketch | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Remove old sketch if exists
    if (sketchRef.current) {
      sketchRef.current.remove()
    }

    // Create new sketch
    sketchRef.current = new TypographySketch(containerRef.current, params)
    onSketchReady?.(sketchRef.current)

    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove()
        sketchRef.current = null
      }
    }
  }, []) // Only initialize once

  // Update params without recreating sketch
  useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.updateParams(params)
    }
  }, [params])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    />
  )
}
