import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const dividerVariants = cva('border-0', {
  variants: {
    type: {
      default: 'border-t border-zinc-200 dark:border-zinc-700',
      soft: 'border-t border-zinc-100 dark:border-zinc-800',
    },
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full border-t-0 border-l',
    },
  },
  defaultVariants: {
    type: 'default',
    orientation: 'horizontal',
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>, VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, type, orientation, ...props }, ref) => {
    return (
      <hr className={cn(dividerVariants({ type, orientation }), className)} ref={ref} {...props} />
    )
  }
)
Divider.displayName = 'Divider'

export { Divider, dividerVariants }
