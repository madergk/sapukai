import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MotionProvider } from '@/context/MotionContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionProvider>
      <App />
    </MotionProvider>
  </StrictMode>
)
