import * as React from 'react'
import { RadioGroup as HeadlessRadioGroup } from '@headlessui/react'
import { cn } from '@/utils'

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof HeadlessRadioGroup>
>(({ className, ...props }, ref) => {
  return <HeadlessRadioGroup ref={ref} className={cn('grid gap-3', className)} {...props} />
})
RadioGroup.displayName = 'RadioGroup'

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof HeadlessRadioGroup.Option
> {
  label?: string
  description?: string
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <HeadlessRadioGroup.Option
        ref={ref}
        className={({ disabled }: { disabled: boolean }) =>
          cn(
            'group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors',
            'hover:bg-zinc-50 dark:hover:bg-zinc-900',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )
        }
        {...props}
      >
        {({ checked }: { checked: boolean }) => (
          <>
            <span
              className={cn(
                'mt-0.5 flex size-4 items-center justify-center rounded-full border',
                'border-zinc-300 bg-white',
                'group-focus-visible:ring-2 group-focus-visible:ring-indigo-500 group-focus-visible:ring-offset-2',
                'group-focus-visible:ring-offset-white dark:group-focus-visible:ring-offset-zinc-950',
                'dark:border-zinc-700 dark:bg-zinc-950',
                checked &&
                  'border-indigo-500 bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-400'
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full bg-white',
                  checked ? 'opacity-100' : 'opacity-0'
                )}
              />
            </span>
            {(label || description) && (
              <div className="flex flex-col">
                {label && (
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {label}
                  </span>
                )}
                {description && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{description}</span>
                )}
              </div>
            )}
            {!label && !description && (
              <span className="sr-only">{props.value?.toString?.() ?? 'Option'}</span>
            )}
          </>
        )}
      </HeadlessRadioGroup.Option>
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }
