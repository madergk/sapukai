import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/utils'

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string
  description?: string
  labelPosition?: 'leading' | 'trailing'
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, label, description, labelPosition = 'trailing', id, ...props }, ref) => {
  const switchId = id || React.useId()

  const switchElement = (
    <SwitchPrimitive.Root
      ref={ref}
      id={switchId}
      className={cn(
        'peer inline-flex h-5 w-8 shrink-0 cursor-pointer items-center rounded-full',
        'border-2 border-transparent shadow-sm transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:bg-zinc-200 dark:data-[state=unchecked]:bg-zinc-700',
        'data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-white',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
          'data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-3',
          'dark:data-[state=checked]:bg-zinc-900'
        )}
      />
    </SwitchPrimitive.Root>
  )

  if (!label && !description) {
    return switchElement
  }

  const labelContent = (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium text-zinc-900 dark:text-white cursor-pointer"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
    </div>
  )

  return (
    <div className="flex items-start gap-3">
      {labelPosition === 'leading' && labelContent}
      {switchElement}
      {labelPosition === 'trailing' && labelContent}
    </div>
  )
})
Switch.displayName = 'Switch'

export { Switch }
