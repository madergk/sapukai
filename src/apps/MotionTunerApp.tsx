import { MotionProvider } from '@/context/MotionContext'
import { MotionTunerLayout } from '@/layouts/MotionTunerLayout'
import { ControlPanel } from '@/components/MotionTuner/ControlPanel'
import { PreviewPanel } from '@/components/MotionTuner/PreviewPanel'

interface MotionTunerAppProps {
  onNavigateHome?: () => void
}

export function MotionTunerApp({ onNavigateHome }: MotionTunerAppProps) {
  return (
    <MotionProvider>
      <MotionTunerLayout
        onNavigateHome={onNavigateHome}
        previewPanel={<PreviewPanel />}
        controlPanel={<ControlPanel />}
      />
    </MotionProvider>
  )
}
