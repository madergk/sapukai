import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-3', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: string
  description?: string
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, label, description, id, ...props }, ref) => {
  const radioId = id || React.useId()

  const radio = (
    <RadioGroupPrimitive.Item
      ref={ref}
      id={radioId}
      className={cn(
        'aspect-square size-4 rounded-full border border-zinc-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-zinc-600',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className="size-2 rounded-full bg-zinc-900 dark:bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )

  if (!label && !description) {
    return radio
  }

  return (
    <div className="flex items-start gap-3">
      {radio}
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={radioId}
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
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
