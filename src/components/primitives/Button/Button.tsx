import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-zinc-900 text-white',
          'hover:bg-zinc-800',
          'dark:bg-white dark:text-zinc-900',
          'dark:hover:bg-zinc-100',
        ],
        outline: [
          'border border-zinc-200 bg-white text-zinc-900',
          'hover:bg-zinc-50 hover:border-zinc-300',
          'dark:border-zinc-700 dark:bg-zinc-950 dark:text-white',
          'dark:hover:bg-zinc-900 dark:hover:border-zinc-600',
        ],
        plain: [
          'text-zinc-900',
          'hover:bg-zinc-100',
          'dark:text-white',
          'dark:hover:bg-zinc-800',
        ],
      },
      size: {
        xs: 'h-6 px-2 text-xs rounded-md',
        sm: 'h-7 px-2.5 text-sm rounded-md',
        base: 'h-8 px-3 text-sm rounded-lg',
        lg: 'h-9 px-3.5 text-base rounded-lg',
        xl: 'h-10 px-4 text-base rounded-lg',
      },
      iconOnly: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Icon-only button sizes (square)
      { iconOnly: true, size: 'xs', className: 'w-6 px-0' },
      { iconOnly: true, size: 'sm', className: 'w-7 px-0' },
      { iconOnly: true, size: 'base', className: 'w-8 px-0' },
      { iconOnly: true, size: 'lg', className: 'w-9 px-0' },
      { iconOnly: true, size: 'xl', className: 'w-10 px-0' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'base',
      iconOnly: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconOnly, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconOnly, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
