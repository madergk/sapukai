import { MotionTunerApp } from '@/apps/MotionTunerApp'

interface MotionTunerProps {
  onNavigate: (path: string) => void
}

export function MotionTuner({ onNavigate }: MotionTunerProps) {
  return <MotionTunerApp onNavigateHome={() => onNavigate('/')} />
}
