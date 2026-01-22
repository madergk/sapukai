import * as React from 'react'
import { useMotion, type ExportFormat } from '@/context/MotionContext'
import { Button } from '@/components/Primitives/Button'
import { copyToClipboard } from '@/utils/clipboard'
import { cn } from '@/utils'

const EXPORT_FORMATS: Array<{ value: ExportFormat; label: string; description: string }> = [
  { value: 'css', label: 'CSS', description: 'Standard CSS custom properties and transitions' },
  { value: 'json', label: 'JSON', description: 'Structured data format for token storage' },
  { value: 'gsap', label: 'GSAP', description: 'GreenSock Animation Platform code snippets' },
  {
    value: 'design-tokens',
    label: 'Design Tokens',
    description: 'Style Dictionary compatible format',
  },
  {
    value: 'm3-tokens',
    label: 'M3 Tokens',
    description: 'Material Design 3 motion token format',
  },
]

export function ExportManager() {
  const { state, setExportFormat, currentEasingCSS, currentDurationMS } = useMotion()
  const [copied, setCopied] = React.useState(false)

  const generateExportCode = (format: ExportFormat): string => {
    const [x1, y1, x2, y2] = state.easingCurve

    switch (format) {
      case 'css':
        return `/* CSS Custom Properties */
:root {
  --motion-easing: ${currentEasingCSS};
  --motion-duration: ${currentDurationMS}ms;
}

/* Usage Examples */
.element {
  transition: all var(--motion-duration) var(--motion-easing);
}

.fade {
  transition: opacity var(--motion-duration) var(--motion-easing);
}

.slide {
  transition: transform var(--motion-duration) var(--motion-easing);
}`

      case 'json':
        return JSON.stringify(
          {
            motion: {
              easing: {
                name: state.selectedEasing === 'custom' ? 'Custom' : state.selectedEasing,
                value: currentEasingCSS,
                controlPoints: {
                  x1,
                  y1,
                  x2,
                  y2,
                },
              },
              duration: {
                name: state.selectedDuration === 'custom' ? 'Custom' : state.selectedDuration,
                value: currentDurationMS,
                unit: 'ms',
              },
            },
          },
          null,
          2
        )

      case 'gsap':
        return `// GSAP Animation with Custom Easing
gsap.to(".element", {
  opacity: 1,
  y: 0,
  duration: ${currentDurationMS / 1000}, // Convert to seconds
  ease: "cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})"
});

// Register Custom Ease
gsap.registerEase("customEase", "${currentEasingCSS}");

// Use Registered Ease
gsap.to(".element", {
  scale: 1.2,
  duration: ${currentDurationMS / 1000},
  ease: "customEase"
});`

      case 'design-tokens':
        return JSON.stringify(
          {
            motion: {
              easing: {
                custom: {
                  value: currentEasingCSS,
                  type: 'cubicBezier',
                  description: 'Custom easing curve for smooth transitions',
                },
              },
              duration: {
                custom: {
                  value: `${currentDurationMS}ms`,
                  type: 'time',
                  description: 'Custom animation duration',
                },
              },
            },
          },
          null,
          2
        )

      case 'm3-tokens':
        return `// Material Design 3 Motion Tokens
{
  "md.sys.motion.easing.custom": {
    "value": "${currentEasingCSS}",
    "type": "cubicBezier",
    "category": "motion",
    "description": "Custom easing curve following M3 principles"
  },
  "md.sys.motion.duration.custom": {
    "value": "${currentDurationMS}",
    "type": "duration",
    "unit": "ms",
    "category": "motion",
    "description": "Custom duration for motion"
  },
  "md.sys.motion.transition.custom": {
    "value": "all ${currentDurationMS}ms ${currentEasingCSS}",
    "type": "transition",
    "category": "motion",
    "description": "Complete transition definition"
  }
}`

      default:
        return ''
    }
  }

  const handleCopy = async () => {
    const code = generateExportCode(state.exportFormat)
    const success = await copyToClipboard(code)

    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const exportCode = generateExportCode(state.exportFormat)

  return (
    <div className="flex flex-col gap-6">
      {/* Format Selector */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-zinc-700">Export Format</label>
        <div className="grid grid-cols-1 gap-2">
          {EXPORT_FORMATS.map((format) => (
            <button
              key={format.value}
              onClick={() => setExportFormat(format.value)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-colors',
                state.exportFormat === format.value
                  ? 'border-[var(--motion-brand-primary)] bg-[var(--motion-brand-primary-soft)]'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
              )}
            >
              <span
                className={cn(
                  'font-medium',
                  state.exportFormat === format.value
                    ? 'text-[var(--motion-brand-primary)]'
                    : 'text-zinc-950'
                )}
              >
                {format.label}
              </span>
              <span className="text-xs text-zinc-500">{format.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700">Code Output</label>
          <Button
            size="sm"
            onClick={handleCopy}
            className={cn(
              'transition-colors',
              copied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]'
            )}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div className="relative max-h-[400px] overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-950">
          <pre className="p-4">
            <code className="font-mono text-sm text-zinc-100">{exportCode}</code>
          </pre>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <h4 className="mb-2 text-sm font-semibold text-zinc-950">Usage Tips</h4>
        <ul className="list-inside list-disc space-y-1 text-xs text-zinc-600">
          {state.exportFormat === 'css' && (
            <>
              <li>Add custom properties to your :root selector</li>
              <li>Reference variables using var(--motion-easing) syntax</li>
              <li>Works with all CSS transition and animation properties</li>
            </>
          )}
          {state.exportFormat === 'json' && (
            <>
              <li>Import JSON into your design system configuration</li>
              <li>Use with build tools like Style Dictionary or Theo</li>
              <li>Easy to version control and share across teams</li>
            </>
          )}
          {state.exportFormat === 'gsap' && (
            <>
              <li>Requires GSAP library (npm install gsap)</li>
              <li>Duration in GSAP uses seconds, not milliseconds</li>
              <li>Register custom eases for reusability</li>
            </>
          )}
          {state.exportFormat === 'design-tokens' && (
            <>
              <li>Compatible with Style Dictionary transformation</li>
              <li>Follows W3C Design Tokens Community Group format</li>
              <li>Can be compiled to multiple platform outputs</li>
            </>
          )}
          {state.exportFormat === 'm3-tokens' && (
            <>
              <li>Follows Material Design 3 naming conventions</li>
              <li>Use md.sys.motion prefix for system motion tokens</li>
              <li>Compatible with Material Theme Builder</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
