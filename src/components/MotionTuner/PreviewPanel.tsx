import * as React from 'react'
import { useMotion, type PreviewComponent } from '@/context/MotionContext'
import { ComponentPreview } from './ComponentPreview'
import { MotionPrimitivesPreview } from './MotionPrimitivesPreview'
import { cn, generateFramerMotionExport } from '@/utils'

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
          ? 'border-[var(--motion-brand-primary)] text-[var(--motion-text-primary)]'
          : 'border-transparent text-[var(--motion-text-muted)] hover:text-[var(--motion-text-secondary)]'
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
          ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
          : 'border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] text-[var(--motion-text-primary)] hover:bg-[var(--motion-surface-tertiary)]'
      )}
    >
      {children}
    </button>
  )
}

export function PreviewPanel() {
  const { state, setPreviewMode, setPreviewComponent, currentEasingCSS, currentDurationMS } =
    useMotion()

  const currentOptions = React.useMemo(() => {
    const componentOptions: Array<{ value: PreviewComponent; label: string }> = [
      { value: 'button-states', label: 'Button States' },
      { value: 'modal-dialog', label: 'Modal Dialog' },
      { value: 'accordion', label: 'Accordion' },
      { value: 'notifications', label: 'Notifications' },
      { value: 'loading-states', label: 'Loading States' },
      { value: 'page-transition', label: 'Page Transition' },
    ]

    const navigationOptions: Array<{ value: PreviewComponent; label: string }> = [
      { value: 'drawer', label: 'Drawer' },
      { value: 'bottom-nav', label: 'Bottom Nav' },
      { value: 'tabs', label: 'Tabs' },
      { value: 'menu', label: 'Menu' },
    ]

    const transitionOptions: Array<{ value: PreviewComponent; label: string }> = [
      { value: 'fade-through', label: 'Fade Through' },
      { value: 'shared-axis', label: 'Shared Axis' },
      { value: 'scale-transform', label: 'Scale Transform' },
      { value: 'slide-transition', label: 'Slide Transition' },
    ]

    const motionPrimitiveOptions: Array<{ value: PreviewComponent; label: string }> = [
      { value: 'mp-accordion', label: 'MP Accordion' },
      { value: 'mp-dialog', label: 'MP Dialog' },
      { value: 'mp-morphing-dialog', label: 'Morphing Dialog' },
      { value: 'mp-text-effect', label: 'Text Effect' },
      { value: 'mp-animated-number', label: 'Animated Number' },
      { value: 'mp-sliding-number', label: 'Sliding Number' },
      { value: 'mp-transition-panel', label: 'Transition Panel' },
      { value: 'mp-carousel', label: 'Carousel' },
    ]

    switch (state.previewMode) {
      case 'components':
        return componentOptions
      case 'navigation':
        return navigationOptions
      case 'transitions':
        return transitionOptions
      case 'motion-primitives':
        return motionPrimitiveOptions
      default:
        return componentOptions
    }
  }, [state.previewMode])

  // Set default component when mode changes
  React.useEffect(() => {
    if (
      currentOptions.length > 0 &&
      !currentOptions.find(o => o.value === state.previewComponent)
    ) {
      setPreviewComponent(currentOptions[0].value)
    }
  }, [currentOptions, setPreviewComponent, state.previewComponent])

  return (
    <div className="flex h-full flex-col bg-[var(--motion-surface-secondary)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--motion-border-default)] px-6 py-4">
        <h2 className="text-2xl font-semibold text-[var(--motion-text-primary)]">Preview</h2>
        <div className="flex gap-2">
          <button
            className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] text-[var(--motion-text-secondary)] transition-colors hover:bg-[var(--motion-surface-tertiary)]"
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
            className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] text-[var(--motion-text-secondary)] transition-colors hover:bg-[var(--motion-surface-tertiary)]"
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
      <div className="border-b border-[var(--motion-border-default)] px-6 py-3">
        <p className="text-base text-[var(--motion-text-muted)]">
          Visualize how it is going to look like
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--motion-border-default)] px-6">
        <TabButton
          active={state.previewMode === 'components'}
          onClick={() => setPreviewMode('components')}
        >
          Components
        </TabButton>
        <TabButton
          active={state.previewMode === 'navigation'}
          onClick={() => setPreviewMode('navigation')}
        >
          Navigation
        </TabButton>
        <TabButton
          active={state.previewMode === 'transitions'}
          onClick={() => setPreviewMode('transitions')}
        >
          Transitions
        </TabButton>
        <TabButton
          active={state.previewMode === 'motion-primitives'}
          onClick={() => setPreviewMode('motion-primitives')}
        >
          Motion Primitives
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex flex-col gap-6">
          {/* Component Selector */}
          <div className="flex flex-wrap gap-2">
            {currentOptions.map(option => (
              <ComponentButton
                key={option.value}
                active={state.previewComponent === option.value}
                onClick={() => setPreviewComponent(option.value)}
              >
                {option.label}
              </ComponentButton>
            ))}
          </div>

          {/* Preview Area */}
          {state.previewMode === 'motion-primitives' ? (
            <MotionPrimitivesPreview component={state.previewComponent} />
          ) : (
            <ComponentPreview component={state.previewComponent} />
          )}

          {/* CSS Implementation */}
          <div className="flex flex-col gap-2 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4">
            <p className="text-base text-[var(--motion-text-muted)]">
              {state.previewMode === 'motion-primitives'
                ? 'Motion Implementation'
                : 'CSS Implementation'}
            </p>
            <div className="rounded-lg bg-[var(--motion-surface-primary)] p-3">
              <pre className="font-mono text-xs text-[var(--motion-text-primary)]">
                <code>
                  {state.previewMode === 'motion-primitives'
                    ? generateFramerMotionExport(state.easingCurve, currentDurationMS)
                    : `.element {\n  transition: all ${currentDurationMS}ms ${currentEasingCSS};\n}\n\n/* Or individual properties */\n.element {\n  transition: transform ${currentDurationMS}ms ${currentEasingCSS},\n              opacity ${currentDurationMS}ms ${currentEasingCSS};\n}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
