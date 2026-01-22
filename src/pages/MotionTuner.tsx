import { MotionTunerLayout } from '@/layouts/MotionTunerLayout'
import { ControlPanel } from '@/components/MotionTuner/ControlPanel'
import { PreviewPanel } from '@/components/MotionTuner/PreviewPanel'

interface MotionTunerProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export function MotionTuner({ currentPath, onNavigate }: MotionTunerProps) {
  return (
    <MotionTunerLayout
      currentPath={currentPath}
      onNavigate={onNavigate}
      previewPanel={<PreviewPanel />}
      controlPanel={<ControlPanel />}
    />
  )
}
