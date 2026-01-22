import * as React from 'react'
import { useMotion } from '@/context/MotionContext'
import { easingTokens, durationTokens } from '@/tokens/motion'
import { BezierCanvas } from './BezierCanvas'
import { ExportManager } from './ExportManager'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/forms/Select'
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
          : 'border-transparent text-zinc-500 hover:text-zinc-700'
      )}
    >
      {children}
    </button>
  )
}

export function ControlPanel() {
  const { state, setActiveTab, applyEasingPreset, setDuration, currentEasingCSS } = useMotion()

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 px-8 pt-6 pb-4">
        <h2 className="text-[34px] font-semibold leading-[42px] text-zinc-950">
          Customize
        </h2>
        <p className="text-base text-zinc-400">
          Customize your swag curve
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 px-8">
        <TabButton
          active={state.activeTab === 'easing'}
          onClick={() => setActiveTab('easing')}
        >
          Easing Curve
        </TabButton>
        <TabButton
          active={state.activeTab === 'duration'}
          onClick={() => setActiveTab('duration')}
        >
          Duration
        </TabButton>
        <TabButton
          active={state.activeTab === 'transition'}
          onClick={() => setActiveTab('transition')}
        >
          Transition
        </TabButton>
        <TabButton
          active={state.activeTab === 'export'}
          onClick={() => setActiveTab('export')}
        >
          Export
        </TabButton>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex flex-col gap-6">
          {/* Code Display */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <code className="font-mono text-base text-zinc-950">
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

function EasingTab() {
  const { state, applyEasingPreset } = useMotion()

  const easingOptions = Object.entries(easingTokens).map(([key, value]) => ({
    value: key,
    label: value.name,
  }))

  return (
    <div className="flex flex-col gap-6">
      {/* Preset Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">
          Easing Preset
        </label>
        <Select
          value={state.selectedEasing === 'custom' ? undefined : state.selectedEasing}
          onValueChange={(value) => {
            if (value) {
              applyEasingPreset(value as keyof typeof easingTokens)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Custom" />
          </SelectTrigger>
          <SelectContent>
            {easingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Canvas */}
      <div className="flex items-center justify-center">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <BezierCanvas width={400} height={400} />
        </div>
      </div>
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
          <label className="text-sm font-medium text-zinc-700">
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
        <div className="flex justify-between text-xs text-zinc-400">
          <span>0ms</span>
          <span>2000ms</span>
        </div>
      </div>

      {/* Duration Presets */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-700">
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
                  ? 'border-[var(--motion-brand-primary)] bg-[var(--motion-brand-primary)] text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
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

function TransitionTab() {
  const { state, currentEasingCSS, currentDurationMS } = useMotion()

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-950">
          Complete Transition
        </h3>
        <div className="rounded-lg bg-white p-4">
          <code className="block font-mono text-sm text-zinc-950">
            transition: all {currentDurationMS}ms {currentEasingCSS};
          </code>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-medium text-zinc-700">Common Properties</h4>
        <div className="space-y-2">
          {['opacity', 'transform', 'background-color', 'color', 'border-color'].map((prop) => (
            <div key={prop} className="rounded-lg border border-zinc-200 bg-white p-3">
              <code className="font-mono text-xs text-zinc-700">
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
