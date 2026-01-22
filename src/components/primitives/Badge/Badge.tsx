import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center rounded-full px-2 py-0.5',
    'text-xs font-medium',
    'transition-colors duration-150',
  ],
  {
    variants: {
      color: {
        zinc: [
          'bg-zinc-100 text-zinc-700',
          'hover:bg-zinc-200',
          'dark:bg-zinc-900 dark:text-zinc-200',
          'dark:hover:bg-zinc-800',
        ],
        red: [
          'bg-red-100 text-red-700',
          'hover:bg-red-200',
          'dark:bg-red-900/30 dark:text-red-400',
          'dark:hover:bg-red-900/40',
        ],
        orange: [
          'bg-orange-100 text-orange-700',
          'hover:bg-orange-200',
          'dark:bg-orange-900/30 dark:text-orange-400',
          'dark:hover:bg-orange-900/40',
        ],
        amber: [
          'bg-amber-100 text-amber-700',
          'hover:bg-amber-200',
          'dark:bg-amber-900/30 dark:text-amber-400',
          'dark:hover:bg-amber-900/40',
        ],
        yellow: [
          'bg-yellow-100 text-yellow-700',
          'hover:bg-yellow-200',
          'dark:bg-yellow-900/30 dark:text-yellow-400',
          'dark:hover:bg-yellow-900/40',
        ],
        lime: [
          'bg-lime-100 text-lime-700',
          'hover:bg-lime-200',
          'dark:bg-lime-900/30 dark:text-lime-400',
          'dark:hover:bg-lime-900/40',
        ],
        green: [
          'bg-green-100 text-green-700',
          'hover:bg-green-200',
          'dark:bg-green-900/30 dark:text-green-400',
          'dark:hover:bg-green-900/40',
        ],
        emerald: [
          'bg-emerald-100 text-emerald-700',
          'hover:bg-emerald-200',
          'dark:bg-emerald-900/30 dark:text-emerald-400',
          'dark:hover:bg-emerald-900/40',
        ],
        teal: [
          'bg-teal-100 text-teal-700',
          'hover:bg-teal-200',
          'dark:bg-teal-900/30 dark:text-teal-400',
          'dark:hover:bg-teal-900/40',
        ],
        cyan: [
          'bg-cyan-100 text-cyan-700',
          'hover:bg-cyan-200',
          'dark:bg-cyan-900/30 dark:text-cyan-400',
          'dark:hover:bg-cyan-900/40',
        ],
        sky: [
          'bg-sky-100 text-sky-700',
          'hover:bg-sky-200',
          'dark:bg-sky-900/30 dark:text-sky-400',
          'dark:hover:bg-sky-900/40',
        ],
        blue: [
          'bg-blue-100 text-blue-700',
          'hover:bg-blue-200',
          'dark:bg-blue-900/30 dark:text-blue-400',
          'dark:hover:bg-blue-900/40',
        ],
        indigo: [
          'bg-indigo-100 text-indigo-700',
          'hover:bg-indigo-200',
          'dark:bg-indigo-900/30 dark:text-indigo-400',
          'dark:hover:bg-indigo-900/40',
        ],
        violet: [
          'bg-violet-100 text-violet-700',
          'hover:bg-violet-200',
          'dark:bg-violet-900/30 dark:text-violet-400',
          'dark:hover:bg-violet-900/40',
        ],
        purple: [
          'bg-purple-100 text-purple-700',
          'hover:bg-purple-200',
          'dark:bg-purple-900/30 dark:text-purple-400',
          'dark:hover:bg-purple-900/40',
        ],
        fuchsia: [
          'bg-fuchsia-100 text-fuchsia-700',
          'hover:bg-fuchsia-200',
          'dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
          'dark:hover:bg-fuchsia-900/40',
        ],
        pink: [
          'bg-pink-100 text-pink-700',
          'hover:bg-pink-200',
          'dark:bg-pink-900/30 dark:text-pink-400',
          'dark:hover:bg-pink-900/40',
        ],
        rose: [
          'bg-rose-100 text-rose-700',
          'hover:bg-rose-200',
          'dark:bg-rose-900/30 dark:text-rose-400',
          'dark:hover:bg-rose-900/40',
        ],
      },
    },
    defaultVariants: {
      color: 'zinc',
    },
  }
)

export interface BadgeProps
  extends
    Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, color, ...props }, ref) => {
    return <span className={cn(badgeVariants({ color }), className)} ref={ref} {...props} />
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
