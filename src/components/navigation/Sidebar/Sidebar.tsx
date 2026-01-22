import * as React from 'react'
import { cn } from '@/utils'

const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <aside
      ref={ref}
      className={cn(
        'flex h-full w-64 flex-col',
        'border-r border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)]',
        className
      )}
      {...props}
    />
  )
)
Sidebar.displayName = 'Sidebar'

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-14 items-center gap-3 px-4 border-b border-[var(--motion-border-default)]',
        className
      )}
      {...props}
    />
  )
)
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto p-4', className)} {...props} />
  )
)
SidebarContent.displayName = 'SidebarContent'

const SidebarSection = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('mb-6', className)} {...props} />
)
SidebarSection.displayName = 'SidebarSection'

const SidebarSectionTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[var(--motion-text-muted)]',
        className
      )}
      {...props}
    />
  )
)
SidebarSectionTitle.displayName = 'SidebarSectionTitle'

const SidebarNav = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  )
)
SidebarNav.displayName = 'SidebarNav'

const SidebarNavItem = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    active?: boolean
    icon?: React.ReactNode
  }
>(({ className, active, icon, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-[var(--motion-surface-tertiary)] text-[var(--motion-text-primary)]'
        : 'text-[var(--motion-text-secondary)] hover:bg-[var(--motion-surface-tertiary)] hover:text-[var(--motion-text-primary)]',
      className
    )}
    {...props}
  >
    {icon && (
      <span
        className={cn(
          'size-5',
          active ? 'text-[var(--motion-text-primary)]' : 'text-[var(--motion-text-muted)]'
        )}
      >
        {icon}
      </span>
    )}
    {children}
  </a>
))
SidebarNavItem.displayName = 'SidebarNavItem'

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('border-t border-[var(--motion-border-default)] p-4', className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = 'SidebarFooter'

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSection,
  SidebarSectionTitle,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
}
