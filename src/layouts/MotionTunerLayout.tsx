import * as React from 'react'

interface MotionTunerLayoutProps {
  previewPanel: React.ReactNode
  controlPanel?: React.ReactNode
  currentPath: string
  onNavigate: (path: string) => void
}

export function MotionTunerLayout({ previewPanel, controlPanel }: MotionTunerLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--motion-surface-secondary)] lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Control Panel — full-width on mobile, sidebar on desktop */}
      {controlPanel && (
        <div className="w-full flex-shrink-0 overflow-y-auto border-b border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] lg:w-fit lg:border-b-0 lg:border-r">
          {controlPanel}
        </div>
      )}
      {/* Preview Panel — fills remaining space */}
      <div className="flex min-w-0 w-full flex-1 flex-col">
        <div className="min-w-0 flex-1 overflow-y-auto w-full">{previewPanel}</div>
      </div>
    </div>
  )
}
