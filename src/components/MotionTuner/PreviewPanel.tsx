import * as React from 'react'
import { useMotion, type PreviewComponent } from '@/context/MotionContext'
import { ComponentPreview } from './ComponentPreview'
import { cn } from '@/utils'

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-base transition-colors',
        'border-b-2',
        active
          ? 'border-[var(--motion-brand-primary)] text-zinc-950'
          : 'border-transparent text-zinc-400 hover:text-zinc-600'
      )}
    >
      {children}
    </button>
  )
}

interface ComponentButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function ComponentButton({ active, onClick, children }: ComponentButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-4 py-2 text-base font-normal transition-colors',
        active
          ? 'bg-[var(--motion-brand-primary)] text-white'
          : 'border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50'
      )}
    >
      {children}
    </button>
  )
}

export function PreviewPanel() {
  const { state, setPreviewMode, setPreviewComponent, currentEasingCSS, currentDurationMS } =
    useMotion()

  const componentOptions: Array<{ value: PreviewComponent; label: string }> = [
    { value: 'button-states', label: 'Button States' },
    { value: 'modal-dialog', label: 'Modal Dialog' },
    { value: 'accordion', label: 'Accordion' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'loading-states', label: 'Loading States' },
    { value: 'page-transition', label: 'Page Transition' },
  ]

  return (
    <div className="flex h-full flex-col border-l border-zinc-200 bg-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <h2 className="text-2xl font-semibold text-zinc-950">Preview</h2>
        <div className="flex gap-2">
          <button
            className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            aria-label="Grid view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="5" height="5" fill="currentColor" />
              <rect x="9" y="2" width="5" height="5" fill="currentColor" />
              <rect x="2" y="9" width="5" height="5" fill="currentColor" />
              <rect x="9" y="9" width="5" height="5" fill="currentColor" />
            </svg>
          </button>
          <button
            className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-zinc-200 bg-white transition-colors hover:bg-zinc-50"
            aria-label="List view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="3" width="12" height="2" fill="currentColor" />
              <rect x="2" y="7" width="12" height="2" fill="currentColor" />
              <rect x="2" y="11" width="12" height="2" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="border-b border-zinc-200 px-6 py-3">
        <p className="text-base text-zinc-400">
          Visualize how it is going to look like
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 px-6">
        <TabButton
          active={state.previewMode === 'components'}
          onClick={() => setPreviewMode('components')}
        >
          Components
        </TabButton>
        <TabButton
          active={state.previewMode === 'transitions'}
          onClick={() => setPreviewMode('transitions')}
        >
          Transitions
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-6">
          {/* Component Selector */}
          {state.previewMode === 'components' && (
            <div className="flex flex-wrap gap-2">
              {componentOptions.map((option) => (
                <ComponentButton
                  key={option.value}
                  active={state.previewComponent === option.value}
                  onClick={() => setPreviewComponent(option.value)}
                >
                  {option.label}
                </ComponentButton>
              ))}
            </div>
          )}

          {/* Preview Area */}
          {state.previewMode === 'components' ? (
            <ComponentPreview component={state.previewComponent} />
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <p className="text-sm text-zinc-500">
                Transition previews coming soon...
              </p>
            </div>
          )}

          {/* CSS Implementation */}
          <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-base text-zinc-400">CSS Implementation</p>
            <div className="rounded-lg bg-white p-3">
              <pre className="font-mono text-xs text-zinc-950">
                <code>
                  {`.modal-overlay {\n  transition: opacity ${currentDurationMS}ms ${currentEasingCSS};\n}\n\n.modal-content {\n  transition: transform ${currentDurationMS}ms ${currentEasingCSS},\n              opacity ${currentDurationMS}ms ${currentEasingCSS};\n}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
