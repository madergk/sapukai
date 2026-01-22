import * as React from 'react'
import { Switch as HeadlessSwitch } from '@headlessui/react'
import { cn } from '@/utils'

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof HeadlessSwitch> {
  label?: string
  description?: string
  labelPosition?: 'leading' | 'trailing'
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, label, description, labelPosition = 'trailing', id, ...props }, ref) => {
    const fallbackId = React.useId()
    const switchId = id ?? fallbackId

    const switchElement = (
      <HeadlessSwitch
        ref={ref}
        id={switchId}
        className={({ checked }: { checked: boolean }) =>
          cn(
            'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full',
            'border border-transparent transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
            'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
            'disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-zinc-200 dark:bg-zinc-700',
            className
          )
        }
        {...props}
      >
        {({ checked }: { checked: boolean }) => (
          <span
            className={cn(
              'pointer-events-none inline-block size-4 rounded-full bg-white shadow ring-0',
              'transition-transform duration-150',
              checked ? 'translate-x-4 dark:bg-zinc-900' : 'translate-x-0'
            )}
          />
        )}
      </HeadlessSwitch>
    )

    if (!label && !description) {
      return switchElement
    }

    const labelContent = (
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={switchId}
            className="cursor-pointer text-sm font-medium text-zinc-900 dark:text-zinc-100"
          >
            {label}
          </label>
        )}
        {description && <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      </div>
    )

    return (
      <div className="flex items-start gap-3">
        {labelPosition === 'leading' && labelContent}
        {switchElement}
        {labelPosition === 'trailing' && labelContent}
      </div>
    )
  }
)
Switch.displayName = 'Switch'

export { Switch }
