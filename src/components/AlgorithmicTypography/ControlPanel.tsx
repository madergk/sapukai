import type { SketchParams } from '../../utils/typography-sketch'
import { Input } from '../forms/Input'

interface ControlPanelProps {
  params: SketchParams
  onChange: (params: Partial<SketchParams>) => void
  onRandomSeed: () => void
}

export function ControlPanel({ params, onChange, onRandomSeed }: ControlPanelProps) {
  const animationModes = [
    { value: 'flow', label: 'Flow Field' },
    { value: 'wave', label: 'Wave' },
    { value: 'scatter', label: 'Scatter' },
    { value: 'spiral', label: 'Spiral' },
    { value: 'harmonics', label: 'Harmonics' },
  ]

  const colorModes = [
    { value: 'mono', label: 'Monochrome' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'random', label: 'Random' },
  ]

  return (
    <div className="space-y-6 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
      <h2 className="text-xl font-semibold text-zinc-50">Parameters</h2>

      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Text</label>
        <Input
          type="text"
          value={params.text}
          onChange={e => onChange({ text: e.target.value })}
          placeholder="Enter text..."
          className="w-full"
        />
      </div>

      {/* Seed */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-zinc-300">Seed: {params.seed}</label>
          <button
            onClick={onRandomSeed}
            className="px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded"
          >
            Random
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="9999"
          value={params.seed}
          onChange={e => onChange({ seed: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Animation Mode */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Animation Mode</label>
        <select
          value={params.animationMode}
          onChange={e =>
            onChange({
              animationMode: e.target.value as SketchParams['animationMode'],
            })
          }
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          {animationModes.map(mode => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Color Mode */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Color Mode</label>
        <select
          value={params.colorMode}
          onChange={e => onChange({ colorMode: e.target.value as SketchParams['colorMode'] })}
          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-100"
        >
          {colorModes.map(mode => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Font Size: {params.fontSize}px
        </label>
        <input
          type="range"
          min="20"
          max="120"
          step="5"
          value={params.fontSize}
          onChange={e => onChange({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Letter Spacing: {params.letterSpacing}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="2"
          value={params.letterSpacing}
          onChange={e => onChange({ letterSpacing: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Particle Count */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Particle Count: {params.particleCount}
        </label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={params.particleCount}
          onChange={e => onChange({ particleCount: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Flow Intensity */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Flow Intensity: {params.flowIntensity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={params.flowIntensity}
          onChange={e => onChange({ flowIntensity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Wave Amplitude */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Wave Amplitude: {params.waveAmplitude.toFixed(1)}
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={params.waveAmplitude}
          onChange={e => onChange({ waveAmplitude: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Wave Frequency */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Wave Frequency: {params.waveFrequency.toFixed(2)}
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={params.waveFrequency}
          onChange={e => onChange({ waveFrequency: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Rotation Speed */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Rotation Speed: {params.rotationSpeed.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={params.rotationSpeed}
          onChange={e => onChange({ rotationSpeed: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Animation Speed */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Animation Speed: {params.speed.toFixed(2)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={params.speed}
          onChange={e => onChange({ speed: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>
    </div>
  )
}
