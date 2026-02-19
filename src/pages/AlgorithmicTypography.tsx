import { useState, useCallback } from 'react'
import type { SketchParams } from '../utils/typography-sketch'
import { P5Canvas } from '../components/AlgorithmicTypography/P5Canvas'
import { ControlPanel } from '../components/AlgorithmicTypography/ControlPanel'

const DEFAULT_PARAMS: SketchParams = {
  seed: 42,
  text: 'KINETIC',
  fontSize: 80,
  letterSpacing: 10,
  flowIntensity: 2,
  particleCount: 300,
  waveAmplitude: 20,
  waveFrequency: 1.5,
  rotationSpeed: 1.5,
  colorMode: 'gradient',
  animationMode: 'flow',
  speed: 1,
}

const PRESETS = [
  {
    name: 'Flowing Water',
    params: {
      animationMode: 'flow' as const,
      flowIntensity: 2.5,
      particleCount: 400,
      speed: 0.8,
      colorMode: 'gradient' as const,
    },
  },
  {
    name: 'Wave Pulse',
    params: {
      animationMode: 'wave' as const,
      waveAmplitude: 30,
      waveFrequency: 2,
      particleCount: 250,
      speed: 1.2,
      colorMode: 'mono' as const,
    },
  },
  {
    name: 'Chaotic Dance',
    params: {
      animationMode: 'scatter' as const,
      flowIntensity: 3,
      particleCount: 500,
      rotationSpeed: 3,
      speed: 1.5,
      colorMode: 'random' as const,
    },
  },
  {
    name: 'Spiral Vortex',
    params: {
      animationMode: 'spiral' as const,
      flowIntensity: 2,
      particleCount: 350,
      rotationSpeed: 2,
      speed: 1,
      colorMode: 'gradient' as const,
    },
  },
  {
    name: 'Harmonic Oscillation',
    params: {
      animationMode: 'harmonics' as const,
      waveAmplitude: 25,
      waveFrequency: 1,
      particleCount: 200,
      speed: 0.7,
      colorMode: 'gradient' as const,
    },
  },
]

export function AlgorithmicTypography() {
  const [params, setParams] = useState<SketchParams>(DEFAULT_PARAMS)

  const handleParamChange = useCallback((newParams: Partial<SketchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const handleRandomSeed = useCallback(() => {
    setParams(prev => ({
      ...prev,
      seed: Math.floor(Math.random() * 10000),
    }))
  }, [])

  const applyPreset = useCallback((presetParams: Partial<SketchParams>) => {
    setParams(prev => ({ ...prev, ...presetParams }))
  }, [])

  const handleResetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS)
  }, [])

  return (
    <div className="h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900 p-4">
        <h1 className="text-3xl font-bold">Algorithmic Typography</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Create kinetic text animations with seeded randomness and interactive parameter
          exploration
        </p>
      </header>

      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700">
          <P5Canvas params={params} />
        </div>

        {/* Control Panel */}
        <div className="w-80 overflow-y-auto">
          <ControlPanel
            params={params}
            onChange={handleParamChange}
            onRandomSeed={handleRandomSeed}
          />

          {/* Presets Section */}
          <div className="mt-6 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-50 mb-3">Animation Presets</h3>
            <div className="space-y-2">
              {PRESETS.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.params)}
                  className="w-full px-3 py-2 text-left text-sm bg-zinc-800 hover:bg-teal-600 text-zinc-200 hover:text-white rounded transition-colors"
                >
                  {preset.name}
                </button>
              ))}
              <button
                onClick={handleResetToDefaults}
                className="w-full px-3 py-2 text-left text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded transition-colors border border-zinc-600"
              >
                Reset to Defaults
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-6 p-6 bg-zinc-900 rounded-lg border border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-50 mb-3">About</h3>
            <div className="text-xs text-zinc-400 space-y-2">
              <p>
                <strong>Seed:</strong> Use seeds to create reproducible animations
              </p>
              <p>
                <strong>Animation Modes:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong>Flow Field:</strong> Perlin noise-based particle flow
                </li>
                <li>
                  <strong>Wave:</strong> Sinusoidal wave motion
                </li>
                <li>
                  <strong>Scatter:</strong> Particles disperse then return
                </li>
                <li>
                  <strong>Spiral:</strong> Orbital spiral motion
                </li>
                <li>
                  <strong>Harmonics:</strong> Mathematical harmonic oscillation
                </li>
              </ul>
              <p className="mt-2">
                All randomness is deterministic based on the seed, enabling reproducible generative
                art.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
