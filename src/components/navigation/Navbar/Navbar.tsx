import * as React from 'react'
import { cn } from '@/utils'

const Navbar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      'flex h-14 items-center justify-between px-4 lg:px-6',
      'border-b border-zinc-200 bg-white',
      'dark:border-zinc-700 dark:bg-zinc-950',
      className
    )}
    {...props}
  />
))
Navbar.displayName = 'Navbar'

const NavbarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3', className)}
    {...props}
  />
))
NavbarBrand.displayName = 'NavbarBrand'

const NavbarNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('hidden items-center gap-1 md:flex', className)}
    {...props}
  />
))
NavbarNav.displayName = 'NavbarNav'

const NavbarItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
  }
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
      active
        ? 'text-zinc-900 dark:text-white'
        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      className
    )}
    {...props}
  />
))
NavbarItem.displayName = 'NavbarItem'

const NavbarActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-2', className)}
    {...props}
  />
))
NavbarActions.displayName = 'NavbarActions'

export {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarActions,
}
