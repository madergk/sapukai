import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-white px-3 py-2',
    'text-sm text-zinc-900 placeholder:text-zinc-400',
    'transition-colors duration-150',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
    'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50',
    'dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500',
  ],
  {
    variants: {
      error: {
        true: ['border-red-500', 'focus-visible:ring-red-500', 'dark:border-red-500'],
        false: [
          'border-zinc-300',
          'hover:border-zinc-400',
          'dark:border-zinc-700',
          'dark:hover:border-zinc-600',
        ],
      },
      inputSize: {
        sm: 'h-8 text-sm',
        base: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      error: false,
      inputSize: 'base',
    },
  }
)

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  helperText?: string
  iconLeading?: React.ReactNode
  iconTrailing?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      error,
      inputSize,
      label,
      helperText,
      iconLeading,
      iconTrailing,
      id,
      ...props
    },
    ref
  ) => {
    const fallbackId = React.useId()
    const inputId = id ?? fallbackId
    const helperId = `${inputId}-helper`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconLeading && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-zinc-400 dark:text-zinc-500">{iconLeading}</span>
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              inputVariants({ error, inputSize }),
              iconLeading && 'pl-10',
              iconTrailing && 'pr-10',
              className
            )}
            ref={ref}
            aria-describedby={helperText ? helperId : undefined}
            aria-invalid={error || undefined}
            {...props}
          />
          {iconTrailing && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-zinc-400 dark:text-zinc-500">{iconTrailing}</span>
            </div>
          )}
        </div>
        {helperText && (
          <p
            id={helperId}
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-red-600 dark:text-red-400' : 'text-zinc-500 dark:text-zinc-400'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
