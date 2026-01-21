import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, id, ...props }, ref) => {
  const checkboxId = id || React.useId()

  const checkbox = (
    <CheckboxPrimitive.Root
      ref={ref}
      id={checkboxId}
      className={cn(
        'peer size-4 shrink-0 rounded border border-zinc-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 data-[state=checked]:text-white',
        'dark:border-zinc-600',
        'dark:data-[state=checked]:bg-white dark:data-[state=checked]:border-white dark:data-[state=checked]:text-zinc-900',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label && !description) {
    return checkbox
  }

  return (
    <div className="flex items-start gap-3">
      {checkbox}
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-zinc-900 dark:text-white cursor-pointer"
          >
            {label}
          </label>
        )}
        {description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }
