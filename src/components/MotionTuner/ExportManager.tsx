import * as React from 'react'
import { useMotion, type ExportFormat } from '@/context/MotionContext'
import { Button } from '@/components/primitives/Button'
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
  {
    value: 'bootstrap',
    label: 'Bootstrap',
    description: 'CSS variables + utility class examples',
  },
  {
    value: 'angular',
    label: 'Angular',
    description: 'Component + template animation snippet',
  },
  {
    value: 'mui',
    label: 'MUI',
    description: 'Theme + component transition snippet',
  },
  {
    value: 'shadcn',
    label: 'shadcn/ui',
    description: 'Tailwind utilities in shadcn components',
  },
  {
    value: 'tailwind',
    label: 'Tailwind',
    description: 'Utility classes with custom easing/duration',
  },
  {
    value: 'vue',
    label: 'Vue',
    description: 'Transition component + CSS classes',
  },
  {
    value: 'framer',
    label: 'Framer Motion',
    description: 'Motion component with cubic-bezier easing',
  },
  {
    value: 'react-spring',
    label: 'React Spring',
    description: 'useSpring with easing + duration',
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

      case 'bootstrap':
        return `/* Bootstrap-friendly CSS variables */
:root {
  --motion-ease: ${currentEasingCSS};
  --motion-duration: ${currentDurationMS}ms;
}

/* Utility class */
.motion-transition {
  transition: all var(--motion-duration) var(--motion-ease);
}

/* Usage with Bootstrap components */
<button class="btn btn-primary motion-transition">Save</button>

/* Optional: override Bootstrap vars on a scope */
.modal {
  --motion-ease: ${currentEasingCSS};
  --motion-duration: ${currentDurationMS}ms;
}
`

      case 'angular':
        return `// Angular component
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-panel',
  template: \`
    <button (click)="open = !open">Toggle</button>
    <div [@panelMotion]="open ? 'open' : 'closed'" class="panel">
      Content
    </div>
  \`,
  animations: [
    trigger('panelMotion', [
      state('closed', style({ opacity: 0, transform: 'translateY(8px)' })),
      state('open', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('closed <=> open', animate('${currentDurationMS}ms ${currentEasingCSS}')),
    ]),
  ],
})
export class PanelComponent {
  open = false;
}
`

      case 'mui':
        return `// MUI theme + component example
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

const theme = createTheme({
  transitions: {
    duration: {
      standard: ${currentDurationMS},
    },
    easing: {
      easeInOut: '${currentEasingCSS}',
    },
  },
});

export function MotionBox() {
  return (
    <Box
      sx={{
        transition: (t) =>
          t.transitions.create(['opacity', 'transform'], {
            duration: t.transitions.duration.standard,
            easing: t.transitions.easing.easeInOut,
          }),
        '&:hover': { opacity: 0.8, transform: 'translateY(-4px)' },
      }}
    >
      Hover me
    </Box>
  );
}
`

      case 'shadcn':
        return `// shadcn/ui (Tailwind utilities)
// Example: Card with motion-friendly hover
<div
  className="rounded-lg border bg-white p-4
             transition-[transform,opacity]
             duration-[${currentDurationMS}ms]
             ease-[${currentEasingCSS}]
             hover:-translate-y-1 hover:opacity-90"
>
  Motion Card
</div>
`

      case 'tailwind':
        return `<!-- Tailwind (arbitrary values) -->
<div class="
  transition-[transform,opacity]
  duration-[${currentDurationMS}ms]
  ease-[${currentEasingCSS}]
  hover:-translate-y-1 hover:opacity-90
">
  Motion Preview
</div>

<!-- Tailwind config (optional) -->
// tailwind.config.ts
export default {
  theme: {
    extend: {
      transitionTimingFunction: {
        'motion': '${currentEasingCSS}',
      },
      transitionDuration: {
        'motion': '${currentDurationMS}',
      },
    },
  },
}
`

      case 'vue':
        return `<template>
  <button @click="open = !open">Toggle</button>
  <Transition name="panel">
    <div v-if="open" class="panel">Content</div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity ${currentDurationMS}ms ${currentEasingCSS},
              transform ${currentDurationMS}ms ${currentEasingCSS};
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
`

      case 'framer':
        return `// Framer Motion
import { motion } from 'framer-motion';

const transition = {
  duration: ${currentDurationMS / 1000},
  ease: [${x1}, ${y1}, ${x2}, ${y2}],
};

export function MotionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={transition}
      whileHover={{ scale: 1.02 }}
    >
      Motion Card
    </motion.div>
  );
}
`

      case 'react-spring':
        return `// React Spring
import { useSpring, animated } from '@react-spring/web';

export function MotionPanel({ open }: { open: boolean }) {
  const styles = useSpring({
    opacity: open ? 1 : 0,
    y: open ? 0 : 8,
    config: {
      duration: ${currentDurationMS},
      easing: (t) =>
        (window as any).bezierEasing
          ? (window as any).bezierEasing(t)
          : t,
    },
  });

  return (
    <animated.div style={{ opacity: styles.opacity, transform: styles.y.to((v) => \`translateY(\${v}px)\`) }}>
      Content
    </animated.div>
  );
}

// Optional: define cubic-bezier easing
// import bezier from 'bezier-easing';
// (window as any).bezierEasing = bezier(${x1}, ${y1}, ${x2}, ${y2});
`

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
        <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
          Export Format
        </label>
        <div className="grid grid-cols-1 gap-2">
          {EXPORT_FORMATS.map(format => (
            <button
              key={format.value}
              onClick={() => setExportFormat(format.value)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-colors',
                state.exportFormat === format.value
                  ? 'border-[var(--motion-brand-primary)] bg-[var(--motion-brand-primary-soft)]'
                  : 'border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] hover:border-[var(--motion-border-default)] hover:bg-[var(--motion-surface-tertiary)]'
              )}
            >
              <span
                className={cn(
                  'font-medium',
                  state.exportFormat === format.value
                    ? 'text-[var(--motion-brand-primary)]'
                    : 'text-[var(--motion-text-primary)]'
                )}
              >
                {format.label}
              </span>
              <span className="text-xs text-[var(--motion-text-muted)]">{format.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Display */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--motion-text-secondary)]">
            Code Output
          </label>
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

        <div className="relative max-h-[400px] overflow-y-auto rounded-xl border border-[var(--motion-border-default)] bg-zinc-950">
          <pre className="p-4">
            <code className="font-mono text-sm text-zinc-100">{exportCode}</code>
          </pre>
        </div>
      </div>

      {/* Usage Tips */}
      <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4">
        <h4 className="mb-2 text-sm font-semibold text-[var(--motion-text-primary)]">Usage Tips</h4>
        <ul className="list-inside list-disc space-y-1 text-xs text-[var(--motion-text-secondary)]">
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
          {state.exportFormat === 'bootstrap' && (
            <>
              <li>Add the CSS variables to :root or a scoped container</li>
              <li>Apply the motion utility class to Bootstrap components</li>
              <li>Works with any Bootstrap element that uses transition</li>
            </>
          )}
          {state.exportFormat === 'angular' && (
            <>
              <li>Uses Angular Animations API (requires BrowserAnimationsModule)</li>
              <li>Update styles/transform values to match your component</li>
              <li>Duration and easing are injected from Motion Tuner</li>
            </>
          )}
          {state.exportFormat === 'mui' && (
            <>
              <li>Set theme transitions to keep motion consistent</li>
              <li>Use transitions.create for multiple properties</li>
              <li>Works with sx prop or styled components</li>
            </>
          )}
          {state.exportFormat === 'shadcn' && (
            <>
              <li>Tailwind arbitrary values map directly to easing/duration</li>
              <li>Use transition-[...] for specific properties</li>
              <li>Combine with shadcn variants for consistent motion</li>
            </>
          )}
          {state.exportFormat === 'tailwind' && (
            <>
              <li>Arbitrary values work without config changes</li>
              <li>Optionally add theme extensions for reusability</li>
              <li>Pair with hover/active utilities for motion</li>
            </>
          )}
          {state.exportFormat === 'vue' && (
            <>
              <li>Use the built-in Transition component</li>
              <li>Match class names to the transition name</li>
              <li>Adjust translate/opacity for your component</li>
            </>
          )}
          {state.exportFormat === 'framer' && (
            <>
              <li>Framer easing uses [x1, y1, x2, y2] arrays</li>
              <li>Duration is in seconds</li>
              <li>Use initial/animate/exit for route transitions</li>
            </>
          )}
          {state.exportFormat === 'react-spring' && (
            <>
              <li>React Spring supports a custom easing function</li>
              <li>Duration is in milliseconds</li>
              <li>Use bezier-easing to generate the easing fn</li>
            </>
          )}
        </ul>
      </div>
    </div>
  )
}
