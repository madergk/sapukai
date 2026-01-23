import * as React from 'react'
import {
  Listbox as HeadlessListbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  ListboxSelectedOption,
} from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'

const Select = HeadlessListbox

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('py-1', className)} {...props} />
)
SelectGroup.displayName = 'SelectGroup'

interface SelectValueProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ListboxSelectedOption>,
  'options'
> {
  options?: React.ReactNode
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, options = null, ...props }, ref) => (
    <ListboxSelectedOption
      as="span"
      ref={ref}
      className={cn(
        'truncate text-left text-[var(--color-blue-100)] bg-[var(--background-inverseprimary)]',
        className
      )}
      placeholder={placeholder}
      options={options}
      {...props}
    />
  )
)
SelectValue.displayName = 'SelectValue'

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ListboxButton> & {
    error?: boolean
  }
>(({ className, children, error, ...props }, ref) => (
  <ListboxButton
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-lg border bg-[var(--background-inverseprimary)] px-3 py-2',
      'text-sm text-[var(--motion-text-inverse)] placeholder:text-zinc-400',
      'transition-colors duration-150',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
      'focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950',
      'disabled:cursor-not-allowed disabled:opacity-50',
      error
        ? 'border-red-500 dark:border-red-500'
        : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600',
      className
    )}
    {...props}
  >
    {children as React.ReactNode}
    <ChevronDownIcon className="size-4 text-zinc-400" />
  </ListboxButton>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectContent = React.forwardRef<
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
SelectContent.displayName = 'SelectContent'

const SelectLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof ListboxLabel>
>(({ className, ...props }, ref) => (
  <ListboxLabel
    ref={ref}
    className={cn('px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ListboxOption>
>(({ className, children, ...props }, ref) => (
  <ListboxOption
    ref={ref}
    className={({
      focus,
      selected,
      disabled,
    }: {
      focus: boolean
      selected: boolean
      disabled: boolean
    }) =>
      cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-2 pr-8 text-sm',
        focus && 'bg-zinc-100 dark:bg-zinc-800',
        selected && 'text-zinc-900 dark:text-white',
        !selected && 'text-zinc-700 dark:text-zinc-200',
        disabled && 'pointer-events-none opacity-50',
        className
      )
    }
    {...props}
  >
    {({ selected }: { selected: boolean }) => (
      <>
        <span className="truncate">{children as React.ReactNode}</span>
        {selected && (
          <span className="absolute right-2 flex size-4 items-center justify-center">
            <CheckIcon className="size-4" />
          </span>
        )}
      </>
    )}
  </ListboxOption>
))
SelectItem.displayName = 'SelectItem'

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-700', className)}
      {...props}
    />
  )
)
SelectSeparator.displayName = 'SelectSeparator'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
