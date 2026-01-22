import * as React from 'react'
import { useMotion } from '@/context/MotionContext'
import {
  easingTokens,
  durationTokens,
  m3MotionPresets,
  resolveM3Preset,
  type M3MotionPreset,
} from '@/tokens/motion'
import { BezierCanvas } from './BezierCanvas'
import { ExportManager } from './ExportManager'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/forms/Select'
import { Input } from '@/components/forms/Input'
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
        'relative px-4 py-2 text-sm font-semibold transition-colors',
        'border-b-2',
        active
          ? 'border-[var(--motion-brand-primary)] text-[var(--motion-brand-primary)]'
          : 'border-transparent text-[var(--motion-text-secondary)] hover:text-[var(--motion-text-primary)]'
      )}
    >
      {children}
    </button>
  )
}

export function ControlPanel() {
  const { state, setActiveTab, currentEasingCSS } = useMotion()

  return (
    <div className="flex h-full flex-col bg-[var(--motion-surface-primary)]">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[var(--motion-border-default)] px-8 pt-6 pb-4">
        <h2 className="text-[34px] font-semibold leading-[42px] text-[var(--motion-text-primary)]">
          Customize
        </h2>
        <p className="text-base text-[var(--motion-text-muted)]">Customize your swag curve</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--motion-border-default)] px-8">
        <TabButton active={state.activeTab === 'easing'} onClick={() => setActiveTab('easing')}>
          Easing Curve
        </TabButton>
        <TabButton active={state.activeTab === 'duration'} onClick={() => setActiveTab('duration')}>
          Duration
        </TabButton>
        <TabButton
          active={state.activeTab === 'transition'}
          onClick={() => setActiveTab('transition')}
        >
          Transition
        </TabButton>
        <TabButton active={state.activeTab === 'export'} onClick={() => setActiveTab('export')}>
          Export
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Code Display */}
          <div className="rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] px-4 py-3">
            <code className="font-mono text-base text-[var(--motion-text-primary)]">
              {currentEasingCSS}
            </code>
          </div>

          {state.activeTab === 'easing' && <EasingTab />}
          {state.activeTab === 'duration' && <DurationTab />}
          {state.activeTab === 'transition' && <TransitionTab />}
          {state.activeTab === 'export' && <ExportTab />}
        </div>
      </div>
    </div>
  )
}

const M3_PRESET_CATEGORIES = [
  { id: 'm3-container', label: 'Container Transform' },
  { id: 'm3-shared-axis', label: 'Shared Axis' },
  { id: 'm3-fade', label: 'Fade' },
  { id: 'm3-components', label: 'Components' },
  { id: 'm3-interaction', label: 'Interaction' },
] as const

function EasingTab() {
  const { state, applyEasingPreset, setDuration } = useMotion()
  const [showM3Presets, setShowM3Presets] = React.useState(false)
  const [selectedM3Category, setSelectedM3Category] = React.useState<string>('m3-components')

  const easingOptions = Object.entries(easingTokens).map(([key, value]) => ({
    value: key,
    label: value.name,
  }))

  const applyM3Preset = (presetKey: M3MotionPreset) => {
    const resolved = resolveM3Preset(presetKey)
    applyEasingPreset(m3MotionPresets[presetKey].easing)
    setDuration(resolved.durationValue)
  }

  const filteredM3Presets = Object.entries(m3MotionPresets).filter(
    ([, preset]) => preset.category === selectedM3Category
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle between basic and M3 presets */}
      <div className="flex rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-1">
        <button
          onClick={() => setShowM3Presets(false)}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            !showM3Presets
              ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
              : 'text-[var(--motion-text-secondary)] hover:bg-[var(--motion-surface-primary)]'
          )}
        >
          Basic Easing
        </button>
        <button
          onClick={() => setShowM3Presets(true)}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
            showM3Presets
              ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
              : 'text-[var(--motion-text-secondary)] hover:bg-[var(--motion-surface-primary)]'
          )}
        >
          M3 Presets
        </button>
      </div>

      {!showM3Presets ? (
        <>
          {/* Basic Preset Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
              Easing Preset
            </label>
            <Select
              value={state.selectedEasing === 'custom' ? undefined : state.selectedEasing}
              onChange={(value: string | undefined) => {
                if (value) {
                  applyEasingPreset(value as keyof typeof easingTokens)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Custom" />
              </SelectTrigger>
              <SelectContent>
                {easingOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Canvas */}
          <div className="flex items-center justify-center">
            <div className="rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-4 shadow-sm">
              <BezierCanvas width={400} height={400} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* M3 Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {M3_PRESET_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedM3Category(cat.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  selectedM3Category === cat.id
                    ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
                    : 'bg-[var(--motion-surface-tertiary)] text-[var(--motion-text-secondary)] hover:bg-[var(--motion-border-default)]'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* M3 Preset Cards */}
          <div className="flex flex-col gap-2">
            {filteredM3Presets.map(([key, preset]) => {
              const resolved = resolveM3Preset(key as M3MotionPreset)
              return (
                <button
                  key={key}
                  onClick={() => applyM3Preset(key as M3MotionPreset)}
                  className="flex flex-col gap-1 rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-4 text-left transition-colors hover:border-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-soft)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--motion-text-primary)]">
                      {preset.name}
                    </span>
                    <span className="rounded bg-[var(--motion-surface-tertiary)] px-2 py-0.5 text-xs text-[var(--motion-text-secondary)]">
                      {resolved.durationValue}ms
                    </span>
                  </div>
                  <p className="text-xs text-[var(--motion-text-muted)]">{preset.description}</p>
                  <code className="mt-2 block rounded bg-[var(--motion-surface-tertiary)] p-2 font-mono text-xs text-[var(--motion-text-secondary)]">
                    {resolved.easingValue}
                  </code>
                </button>
              )
            })}
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4">
            <p className="text-xs text-[var(--motion-text-secondary)]">
              <strong>Material Design 3</strong> motion presets combine easing curves with
              recommended durations. Clicking a preset applies both the easing and duration.{' '}
              <a
                href="https://m3.material.io/styles/motion/overview/specs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--motion-brand-primary)] underline"
              >
                Learn more →
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  )
}

function DurationTab() {
  const { state, setDuration, applyDurationPreset } = useMotion()

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setDuration(value)
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= 2000) {
      setDuration(value)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Duration Slider */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
            Duration (ms)
          </label>
          <Input
            type="number"
            value={state.duration}
            onChange={handleNumberInputChange}
            min={0}
            max={2000}
            className="w-24 text-right"
            inputSize="sm"
          />
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={50}
          value={state.duration}
          onChange={handleDurationChange}
          className="w-full accent-[var(--motion-brand-primary)]"
        />
        <div className="flex justify-between text-xs text-[var(--motion-text-muted)]">
          <span>0ms</span>
          <span>2000ms</span>
        </div>
      </div>

      {/* Duration Presets */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
          Duration Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(durationTokens).map(([key, value]) => (
            <button
              key={key}
              onClick={() => applyDurationPreset(key as keyof typeof durationTokens)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm transition-colors',
                state.selectedDuration === key && state.duration === value.value
                  ? 'border-[var(--motion-brand-primary)] bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
                  : 'border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] text-[var(--motion-text-secondary)] hover:border-[var(--motion-border-default)] hover:bg-[var(--motion-surface-tertiary)]'
              )}
            >
              <div className="font-medium">{value.name}</div>
              <div className="text-xs opacity-70">{value.value}ms</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const TRANSITION_PRESETS = [
  {
    id: 'fade',
    name: 'Fade',
    description: 'Opacity transition for fade in/out effects',
    properties: ['opacity'],
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Transform scale for grow/shrink effects',
    properties: ['transform'],
    transform: 'scale',
  },
  {
    id: 'slide',
    name: 'Slide',
    description: 'Transform translate for sliding effects',
    properties: ['transform'],
    transform: 'translate',
  },
  {
    id: 'color',
    name: 'Color',
    description: 'Background and text color changes',
    properties: ['background-color', 'color'],
  },
  {
    id: 'border',
    name: 'Border',
    description: 'Border color and width transitions',
    properties: ['border-color', 'border-width'],
  },
  {
    id: 'size',
    name: 'Size',
    description: 'Width and height transitions',
    properties: ['width', 'height'],
  },
  {
    id: 'all',
    name: 'All Properties',
    description: 'Transition all animatable properties',
    properties: ['all'],
  },
] as const

function TransitionTab() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [selectedPreset, setSelectedPreset] = React.useState<string>('fade')

  const activePreset =
    TRANSITION_PRESETS.find(p => p.id === selectedPreset) || TRANSITION_PRESETS[0]

  const generateCode = (preset: (typeof TRANSITION_PRESETS)[number]) => {
    if (preset.properties.length === 1) {
      return `transition: ${preset.properties[0]} ${currentDurationMS}ms ${currentEasingCSS};`
    }
    return preset.properties
      .map(prop => `  ${prop} ${currentDurationMS}ms ${currentEasingCSS}`)
      .join(',\n')
  }

  const generateFullCode = (preset: (typeof TRANSITION_PRESETS)[number]) => {
    const transitionCode = generateCode(preset)

    if (preset.id === 'scale') {
      return `.element {
  ${preset.properties.length === 1 ? transitionCode : `transition:\n${transitionCode};`}
}

.element:hover {
  transform: scale(1.05);
}`
    }

    if (preset.id === 'slide') {
      return `.element {
  ${preset.properties.length === 1 ? transitionCode : `transition:\n${transitionCode};`}
}

.element.active {
  transform: translateX(0);
}

.element.hidden {
  transform: translateX(-100%);
}`
    }

    if (preset.id === 'fade') {
      return `.element {
  ${transitionCode}
}

.element.visible {
  opacity: 1;
}

.element.hidden {
  opacity: 0;
}`
    }

    if (preset.id === 'color') {
      return `.element {
  transition:
${transitionCode};
}

.element:hover {
  background-color: var(--hover-bg);
  color: var(--hover-text);
}`
    }

    return `.element {
  ${preset.properties.length === 1 ? transitionCode : `transition:\n${transitionCode};`}
}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Preset Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
          Transition Preset
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSITION_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={cn(
                'flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors',
                selectedPreset === preset.id
                  ? 'border-[var(--motion-brand-primary)] bg-[var(--motion-brand-primary-soft)]'
                  : 'border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] hover:border-[var(--motion-border-default)] hover:bg-[var(--motion-surface-tertiary)]'
              )}
            >
              <span
                className={cn(
                  'font-medium',
                  selectedPreset === preset.id
                    ? 'text-[var(--motion-brand-primary)]'
                    : 'text-[var(--motion-text-primary)]'
                )}
              >
                {preset.name}
              </span>
              <span className="text-xs text-[var(--motion-text-muted)]">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Code */}
      <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--motion-text-primary)]">
            {activePreset.name} Transition
          </h3>
          <span className="rounded-full bg-[var(--motion-border-default)] px-2 py-0.5 text-xs text-[var(--motion-text-secondary)]">
            {activePreset.properties.join(', ')}
          </span>
        </div>
        <div className="rounded-lg bg-zinc-900 p-4">
          <pre className="font-mono text-sm text-zinc-100 whitespace-pre-wrap">
            <code>{generateFullCode(activePreset)}</code>
          </pre>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium text-[var(--motion-text-secondary)]">Quick Reference</h4>
        <div className="space-y-2">
          {activePreset.properties.map(prop => (
            <div
              key={prop}
              className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-3"
            >
              <code className="font-mono text-xs text-[var(--motion-text-secondary)]">
                transition: {prop} {currentDurationMS}ms {currentEasingCSS};
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExportTab() {
  return <ExportManager />
}
