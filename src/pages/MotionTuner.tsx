import { MotionTunerLayout } from '@/layouts/MotionTunerLayout'
import { ControlPanel } from '@/components/MotionTuner/ControlPanel'
import { PreviewPanel } from '@/components/MotionTuner/PreviewPanel'

interface MotionTunerProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export function MotionTuner({ currentPath, onNavigate }: MotionTunerProps) {
  return (
    <MotionTunerLayout currentPath={currentPath} onNavigate={onNavigate} previewPanel={<PreviewPanel />}>
      <ControlPanel />
    </MotionTunerLayout>
  )
}
import * as React from 'react'
import { MotionProvider } from '@/context/MotionContext'
import { MotionTunerLayout } from '@/layouts/MotionTunerLayout'
import { ControlPanel } from '@/components/MotionTuner/ControlPanel'
import { PreviewPanel } from '@/components/MotionTuner/PreviewPanel'

export function MotionTunerPage() {
  return (
    <MotionProvider>
      <MotionTunerLayout previewPanel={<PreviewPanel />}>
        <ControlPanel />
      </MotionTunerLayout>
    </MotionProvider>
  )
}

export default MotionTunerPage
