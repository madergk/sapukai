import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const textAreaVariants = cva(
  [
    'flex w-full rounded-lg border bg-white px-3 py-2',
    'text-sm text-zinc-900 placeholder:text-zinc-400',
    'transition-colors duration-150',
    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50',
    'dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-500',
    'resize-y min-h-[80px]',
  ],
  {
    variants: {
      error: {
        true: [
          'border-red-500',
          'focus:ring-red-500',
          'dark:border-red-500',
        ],
        false: [
          'border-zinc-200',
          'hover:border-zinc-300',
          'dark:border-zinc-700',
          'dark:hover:border-zinc-600',
        ],
      },
    },
    defaultVariants: {
      error: false,
    },
  }
)

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textAreaVariants> {
  label?: string
  description?: string
  helperText?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, error, label, description, helperText, id, ...props },
    ref
  ) => {
    const textAreaId = id || React.useId()
    const descriptionId = `${textAreaId}-description`
    const helperId = `${textAreaId}-helper`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textAreaId}
            className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        {description && (
          <p
            id={descriptionId}
            className="mb-2 text-sm text-zinc-500 dark:text-zinc-400"
          >
            {description}
          </p>
        )}
        <textarea
          id={textAreaId}
          className={cn(textAreaVariants({ error }), className)}
          ref={ref}
          aria-describedby={
            [description && descriptionId, helperText && helperId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={error || undefined}
          {...props}
        />
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
TextArea.displayName = 'TextArea'

export { TextArea, textAreaVariants }
