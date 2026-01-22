import * as React from 'react'
import { Home } from '@/pages/Home'
import { MotionTuner } from '@/pages/MotionTuner'

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

  if (path === '/') {
    return <Home onNavigate={navigate} />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-zinc-900">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <button
        className="rounded-lg border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
        onClick={() => navigate('/')}
      >
        Go home
      </button>
    </div>
  )
}

export default App
