import * as React from 'react'
import { easingTokens, durationTokens, type EasingToken, type DurationToken } from '@/tokens/motion'
import { parseCubicBezier, formatCubicBezier } from '@/tokens/motion'
import type { BezierPoint } from '@/utils/bezier'

/**
 * Motion Context - Global state management for Motion Tuner application
 */

export type PreviewComponent =
  | 'button-states'
  | 'modal-dialog'
  | 'accordion'
  | 'notifications'
  | 'loading-states'
  | 'page-transition'

export type PreviewMode = 'components' | 'transitions'

export type ExportFormat = 'css' | 'json' | 'gsap' | 'design-tokens' | 'm3-tokens'

export interface MotionState {
  // Easing configuration
  easingCurve: BezierPoint
  selectedEasing: EasingToken | 'custom'

  // Duration configuration
  duration: number
  selectedDuration: DurationToken | 'custom'

  // Preview configuration
  previewMode: PreviewMode
  previewComponent: PreviewComponent

  // Export configuration
  exportFormat: ExportFormat

  // UI state
  activeTab: 'easing' | 'duration' | 'transition' | 'export'
}

type MotionAction =
  | { type: 'SET_EASING_CURVE'; payload: BezierPoint }
  | { type: 'SET_SELECTED_EASING'; payload: EasingToken | 'custom' }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_SELECTED_DURATION'; payload: DurationToken | 'custom' }
  | { type: 'SET_PREVIEW_MODE'; payload: PreviewMode }
  | { type: 'SET_PREVIEW_COMPONENT'; payload: PreviewComponent }
  | { type: 'SET_EXPORT_FORMAT'; payload: ExportFormat }
  | { type: 'SET_ACTIVE_TAB'; payload: MotionState['activeTab'] }
  | { type: 'APPLY_EASING_PRESET'; payload: EasingToken }
  | { type: 'APPLY_DURATION_PRESET'; payload: DurationToken }
  | { type: 'RESET_TO_DEFAULT' }

const initialState: MotionState = {
  easingCurve: [0.2, 0.0, 0, 1.0],
  selectedEasing: 'emphasized',
  duration: 300,
  selectedDuration: 'medium2',
  previewMode: 'components',
  previewComponent: 'modal-dialog',
  exportFormat: 'css',
  activeTab: 'easing',
}

function motionReducer(state: MotionState, action: MotionAction): MotionState {
  switch (action.type) {
    case 'SET_EASING_CURVE':
      return {
        ...state,
        easingCurve: action.payload,
        selectedEasing: 'custom',
      }

    case 'SET_SELECTED_EASING':
      return {
        ...state,
        selectedEasing: action.payload,
      }

    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
        selectedDuration: 'custom',
      }

    case 'SET_SELECTED_DURATION':
      return {
        ...state,
        selectedDuration: action.payload,
      }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        previewMode: action.payload,
      }

    case 'SET_PREVIEW_COMPONENT':
      return {
        ...state,
        previewComponent: action.payload,
      }

    case 'SET_EXPORT_FORMAT':
      return {
        ...state,
        exportFormat: action.payload,
      }

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      }

    case 'APPLY_EASING_PRESET': {
      const preset = easingTokens[action.payload]
      const points = parseCubicBezier(preset.value)
      return {
        ...state,
        easingCurve: points || state.easingCurve,
        selectedEasing: action.payload,
      }
    }

    case 'APPLY_DURATION_PRESET': {
      const preset = durationTokens[action.payload]
      return {
        ...state,
        duration: preset.value,
        selectedDuration: action.payload,
      }
    }

    case 'RESET_TO_DEFAULT':
      return initialState

    default:
      return state
  }
}

interface MotionContextValue {
  state: MotionState
  dispatch: React.Dispatch<MotionAction>
  // Helper methods
  setEasingCurve: (curve: BezierPoint) => void
  applyEasingPreset: (preset: EasingToken) => void
  setDuration: (duration: number) => void
  applyDurationPreset: (preset: DurationToken) => void
  setPreviewComponent: (component: PreviewComponent) => void
  setPreviewMode: (mode: PreviewMode) => void
  setExportFormat: (format: ExportFormat) => void
  setActiveTab: (tab: MotionState['activeTab']) => void
  resetToDefault: () => void
  // Computed values
  currentEasingCSS: string
  currentDurationMS: number
}

const MotionContext = React.createContext<MotionContextValue | undefined>(undefined)

interface MotionProviderProps {
  children: React.ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
  const [state, dispatch] = React.useReducer(motionReducer, initialState)

  // Load state from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('motion-tuner-state')
    if (saved) {
      try {
        const savedState = JSON.parse(saved) as Partial<MotionState>
        // Apply saved state
        if (savedState.easingCurve) {
          dispatch({ type: 'SET_EASING_CURVE', payload: savedState.easingCurve as BezierPoint })
        }
        if (savedState.duration) {
          dispatch({ type: 'SET_DURATION', payload: savedState.duration })
        }
        if (savedState.previewComponent) {
          dispatch({ type: 'SET_PREVIEW_COMPONENT', payload: savedState.previewComponent })
        }
        if (savedState.activeTab) {
          dispatch({ type: 'SET_ACTIVE_TAB', payload: savedState.activeTab })
        }
      } catch (err) {
        console.error('Failed to load saved state:', err)
      }
    }
  }, [])

  // Save state to localStorage on changes
  React.useEffect(() => {
    localStorage.setItem('motion-tuner-state', JSON.stringify(state))
  }, [state])

  // Helper methods
  const setEasingCurve = React.useCallback((curve: BezierPoint) => {
    dispatch({ type: 'SET_EASING_CURVE', payload: curve })
  }, [])

  const applyEasingPreset = React.useCallback((preset: EasingToken) => {
    dispatch({ type: 'APPLY_EASING_PRESET', payload: preset })
  }, [])

  const setDuration = React.useCallback((duration: number) => {
    dispatch({ type: 'SET_DURATION', payload: duration })
  }, [])

  const applyDurationPreset = React.useCallback((preset: DurationToken) => {
    dispatch({ type: 'APPLY_DURATION_PRESET', payload: preset })
  }, [])

  const setPreviewComponent = React.useCallback((component: PreviewComponent) => {
    dispatch({ type: 'SET_PREVIEW_COMPONENT', payload: component })
  }, [])

  const setPreviewMode = React.useCallback((mode: PreviewMode) => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: mode })
  }, [])

  const setExportFormat = React.useCallback((format: ExportFormat) => {
    dispatch({ type: 'SET_EXPORT_FORMAT', payload: format })
  }, [])

  const setActiveTab = React.useCallback((tab: MotionState['activeTab']) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
  }, [])

  const resetToDefault = React.useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULT' })
  }, [])

  // Computed values
  const currentEasingCSS = React.useMemo(
    () => formatCubicBezier(state.easingCurve),
    [state.easingCurve]
  )

  const currentDurationMS = React.useMemo(() => state.duration, [state.duration])

  const value: MotionContextValue = {
    state,
    dispatch,
    setEasingCurve,
    applyEasingPreset,
    setDuration,
    applyDurationPreset,
    setPreviewComponent,
    setPreviewMode,
    setExportFormat,
    setActiveTab,
    resetToDefault,
    currentEasingCSS,
    currentDurationMS,
  }

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

export function useMotion() {
  const context = React.useContext(MotionContext)
  if (context === undefined) {
    throw new Error('useMotion must be used within a MotionProvider')
  }
  return context
}
