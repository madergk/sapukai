import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'
import { Avatar } from '@/components/primitives/Avatar'

const Listbox = SelectPrimitive.Root

const ListboxGroup = SelectPrimitive.Group

const ListboxValue = SelectPrimitive.Value

const ListboxTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean
  }
>(({ className, children, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 py-2',
      'text-sm text-zinc-900',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:bg-zinc-950 dark:text-white',
      error
        ? 'border-red-500 dark:border-red-500'
        : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 text-zinc-400" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
ListboxTrigger.displayName = 'ListboxTrigger'

const ListboxContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'dark:border-zinc-700 dark:bg-zinc-900',
        position === 'popper' && 'data-[side=bottom]:translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
ListboxContent.displayName = 'ListboxContent'

export interface ListboxItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  avatar?: string
  icon?: React.ReactNode
  description?: string
}

const ListboxItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  ListboxItemProps
>(({ className, children, avatar, icon, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-2 pl-2 pr-8 text-sm',
      'outline-none',
      'focus:bg-zinc-100 dark:focus:bg-zinc-800',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'text-zinc-900 dark:text-white',
      className
    )}
    {...props}
  >
    {avatar && <Avatar size={6} src={avatar} />}
    {icon && <span className="text-zinc-500">{icon}</span>}
    <div className="flex flex-col">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {description && (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{description}</span>
      )}
    </div>
    <span className="absolute right-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
ListboxItem.displayName = 'ListboxItem'

const ListboxLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
))
ListboxLabel.displayName = 'ListboxLabel'

export {
  Listbox,
  ListboxGroup,
  ListboxValue,
  ListboxTrigger,
  ListboxContent,
  ListboxItem,
  ListboxLabel,
}
