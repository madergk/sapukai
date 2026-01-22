import * as React from 'react'
import {
  Menu,
  MenuButton,
  MenuHeading,
  MenuItem,
  MenuItems,
  MenuSection,
  MenuSeparator,
} from '@headlessui/react'
import { Slot } from '@radix-ui/react-slot'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'

type DropdownRadioGroupContextValue = {
  value?: string
  onValueChange?: (value: string) => void
}

const DropdownRadioGroupContext = React.createContext<DropdownRadioGroupContextValue | null>(null)

const DropdownMenu = Menu

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof MenuButton> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => (
  <MenuButton ref={ref} as={asChild ? Slot : 'button'} className={className} {...props} />
))
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuSection>
>(({ className, ...props }, ref) => (
  <MenuSection ref={ref} className={cn('space-y-1', className)} {...props} />
))
DropdownMenuGroup.displayName = 'DropdownMenuGroup'

const DropdownMenuPortal = React.Fragment

const DropdownMenuSub = Menu

const DropdownMenuRadioGroup = ({
  value,
  onValueChange,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  value?: string
  onValueChange?: (value: string) => void
}) => (
  <DropdownRadioGroupContext.Provider value={{ value, onValueChange }}>
    <div className={cn('space-y-1', className)} role="group" {...props} />
  </DropdownRadioGroupContext.Provider>
)

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof MenuButton> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenuButton
    ref={ref}
    className={cn(
      'flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none',
      'transition-colors',
      'hover:bg-zinc-100 dark:hover:bg-zinc-800',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children as React.ReactNode}
    <ChevronRightIcon className="ml-auto size-4" />
  </MenuButton>
))
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger'

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuItems>
>(({ className, ...props }, ref) => (
  <MenuItems
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg',
      'transition data-[closed]:opacity-0 data-[closed]:scale-95',
      'dark:border-zinc-700 dark:bg-zinc-900',
      className
    )}
    anchor="right"
    portal
    {...props}
  />
))
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent'

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuItems>
>(({ className, ...props }, ref) => (
  <MenuItems
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-200 bg-white p-1 shadow-lg',
      'transition data-[closed]:opacity-0 data-[closed]:scale-95',
      'dark:border-zinc-700 dark:bg-zinc-900',
      className
    )}
    anchor="bottom start"
    portal
    {...props}
  />
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof MenuItem> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuItem
    ref={ref}
    as="button"
    className={({ focus, disabled }: { focus: boolean; disabled: boolean }) =>
      cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
        'transition-colors',
        focus && 'bg-zinc-100 dark:bg-zinc-800',
        disabled && 'pointer-events-none opacity-50',
        'text-zinc-900 dark:text-zinc-100',
        inset && 'pl-8',
        className
      )
    }
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

type DropdownMenuCheckboxItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const DropdownMenuCheckboxItem = React.forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked = false, onCheckedChange, onClick, ...props }, ref) => (
    <MenuItem>
      {({ focus, disabled, close }) => (
        <button
          ref={ref}
          type="button"
          role="menuitemcheckbox"
          aria-checked={checked}
          className={cn(
            'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm',
            'transition-colors',
            focus && 'bg-zinc-100 dark:bg-zinc-800',
            disabled && 'pointer-events-none opacity-50',
            'text-zinc-900 dark:text-zinc-100',
            className
          )}
          {...props}
          onClick={event => {
            onClick?.(event)
            if (event.defaultPrevented || disabled) return
            onCheckedChange?.(!checked)
            close()
          }}
        >
          <span className="absolute left-2 flex size-4 items-center justify-center">
            {checked && <CheckIcon className="size-4" />}
          </span>
          {children}
        </button>
      )}
    </MenuItem>
  )
)
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

type DropdownMenuRadioItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string
}

const DropdownMenuRadioItem = React.forwardRef<HTMLButtonElement, DropdownMenuRadioItemProps>(
  ({ className, children, value, onClick, ...props }, ref) => {
    const context = React.useContext(DropdownRadioGroupContext)
    const checked = context?.value === value

    return (
      <MenuItem>
        {({ focus, disabled, close }) => (
          <button
            ref={ref}
            type="button"
            role="menuitemradio"
            aria-checked={checked}
            className={cn(
              'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm',
              'transition-colors',
              focus && 'bg-zinc-100 dark:bg-zinc-800',
              disabled && 'pointer-events-none opacity-50',
              'text-zinc-900 dark:text-zinc-100',
              className
            )}
            {...props}
            onClick={event => {
              onClick?.(event)
              if (event.defaultPrevented || disabled) return
              context?.onValueChange?.(value)
              close()
            }}
          >
            <span className="absolute left-2 flex size-4 items-center justify-center">
              {checked && <div className="size-2 rounded-full bg-zinc-900 dark:bg-white" />}
            </span>
            {children}
          </button>
        )}
      </MenuItem>
    )
  }
)
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuHeading> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenuHeading
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MenuSeparator>
>(({ className, ...props }, ref) => (
  <MenuSeparator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-700', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-zinc-400 dark:text-zinc-500', className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
