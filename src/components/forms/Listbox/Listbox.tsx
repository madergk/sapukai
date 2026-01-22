import * as React from 'react'
import {
  Listbox as HeadlessListbox,
  ListboxButton,
  ListboxLabel as HeadlessListboxLabel,
  ListboxOption,
  ListboxOptions,
  ListboxSelectedOption,
} from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'
import { Avatar } from '@/components/primitives/Avatar'

const Listbox = HeadlessListbox

const ListboxGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('py-1', className)} {...props} />
)
ListboxGroup.displayName = 'ListboxGroup'

const ListboxValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof ListboxSelectedOption>
>(({ className, placeholder, options = null, ...props }, ref) => (
  <ListboxSelectedOption
    ref={ref}
    className={cn('truncate text-left', className)}
    placeholder={placeholder}
    options={options}
    {...props}
  />
))
ListboxValue.displayName = 'ListboxValue'

const ListboxTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ListboxButton> & {
    error?: boolean
  }
>(({ className, children, error, ...props }, ref) => (
  <ListboxButton
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-lg border bg-white px-3 py-2',
      'text-sm text-zinc-900 placeholder:text-zinc-400',
      'transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'dark:bg-zinc-950 dark:text-zinc-100',
      error
        ? 'border-red-500 dark:border-red-500'
        : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600',
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon className="size-4 text-zinc-400" />
  </ListboxButton>
))
ListboxTrigger.displayName = 'ListboxTrigger'

const ListboxContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ListboxOptions>
>(({ className, children, ...props }, ref) => (
  <ListboxOptions
    ref={ref}
    className={cn(
      'z-50 max-h-96 min-w-[8rem] overflow-auto rounded-lg border border-zinc-200 bg-white p-1 shadow-lg',
      'transition data-[closed]:opacity-0 data-[closed]:scale-95',
      'dark:border-zinc-700 dark:bg-zinc-900',
      className
    )}
    anchor="bottom"
    portal
    {...props}
  >
    {children}
  </ListboxOptions>
))
ListboxContent.displayName = 'ListboxContent'

export interface ListboxItemProps extends React.ComponentPropsWithoutRef<typeof ListboxOption> {
  avatar?: string
  icon?: React.ReactNode
  description?: string
}

const ListboxItem = React.forwardRef<HTMLDivElement, ListboxItemProps>(
  ({ className, children, avatar, icon, description, ...props }, ref) => (
    <ListboxOption
      ref={ref}
      className={({ focus, selected, disabled }) =>
        cn(
          'relative flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-2 pl-2 pr-8 text-sm',
          focus && 'bg-zinc-100 dark:bg-zinc-800',
          selected && 'text-zinc-900 dark:text-white',
          !selected && 'text-zinc-700 dark:text-zinc-200',
          disabled && 'pointer-events-none opacity-50',
          className
        )
      }
      {...props}
    >
      {({ selected }) => (
        <>
          {avatar && <Avatar size={6} src={avatar} />}
          {icon && <span className="text-zinc-500">{icon}</span>}
          <div className="flex flex-col">
            <span className="truncate">{children}</span>
            {description && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{description}</span>
            )}
          </div>
          {selected && (
            <span className="absolute right-2 flex size-4 items-center justify-center">
              <CheckIcon className="size-4" />
            </span>
          )}
        </>
      )}
    </ListboxOption>
  )
)
ListboxItem.displayName = 'ListboxItem'

const ListboxLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof HeadlessListboxLabel>
>(({ className, ...props }, ref) => (
  <HeadlessListboxLabel
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
