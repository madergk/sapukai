import * as React from 'react'
import { Home } from '@/pages/Home'
import { MotionTuner } from '@/pages/MotionTuner'
import { TokensVisualizer } from '@/pages/TokensVisualizer'

function App() {
  const [path, setPath] = React.useState(() => window.location.pathname || '/')

  React.useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = React.useCallback(
    (nextPath: string) => {
      if (nextPath === path) return
      window.history.pushState({}, '', nextPath)
      setPath(nextPath)
    },
    [path]
  )

  if (path === '/motion-tuner') {
    return <MotionTuner currentPath={path} onNavigate={navigate} />
  }

  if (path === '/tokens-visualizer') {
    return <TokensVisualizer currentPath={path} onNavigate={navigate} />
  }

  if (path === '/') {
    return <Home onNavigate={navigate} />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--motion-surface-secondary)] text-[var(--motion-text-primary)]">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <button
        className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] px-4 py-2 text-sm hover:bg-[var(--motion-surface-tertiary)]"
        onClick={() => navigate('/')}
      >
        Go home
      </button>
    </div>
  )
}

export default App
