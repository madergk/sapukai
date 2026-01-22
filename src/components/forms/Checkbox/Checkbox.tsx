import * as React from 'react'
import { Checkbox as HeadlessCheckbox } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof HeadlessCheckbox>,
  'children'
> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<HTMLSpanElement, CheckboxProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const fallbackId = React.useId()
    const checkboxId = id ?? fallbackId

    const checkbox = (
      <HeadlessCheckbox
        ref={ref}
        id={checkboxId}
        className={({ checked }) =>
          cn(
            'group relative flex size-4 shrink-0 items-center justify-center rounded',
            'border border-zinc-300 bg-white text-white shadow-sm transition-colors',
            checked && 'border-indigo-500 bg-indigo-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
            'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-zinc-700 dark:bg-zinc-950',
            checked && 'dark:border-indigo-400 dark:bg-indigo-400',
            className
          )
        }
        {...props}
      >
        {({ checked }) => (
          <CheckIcon
            className={cn('size-3 transition-opacity', checked ? 'opacity-100' : 'opacity-0')}
          />
        )}
      </HeadlessCheckbox>
    )

    if (!label && !description) {
      return checkbox
    }

    return (
      <label className="flex items-start gap-3">
        {checkbox}
        <span className="flex flex-col">
          {label && (
            <span className="cursor-pointer text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {label}
            </span>
          )}
          {description && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{description}</span>
          )}
        </span>
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
