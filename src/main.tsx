import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MotionProvider } from '@/context/MotionContext'
import { ThemeProvider } from '@/context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <MotionProvider>
        <App />
      </MotionProvider>
    </ThemeProvider>
  </StrictMode>
)
