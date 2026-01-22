import * as React from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarNavItem,
} from '@/components/navigation/Sidebar'
import {
  HomeIcon,
  Square2StackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/20/solid'
import { useTheme } from '@/context/ThemeContext'

interface MotionTunerLayoutProps {
  previewPanel: React.ReactNode
  controlPanel?: React.ReactNode
  currentPath: string
  onNavigate: (path: string) => void
}

export function MotionTunerLayout({
  previewPanel,
  controlPanel,
  currentPath,
  onNavigate,
}: MotionTunerLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen w-full bg-[var(--motion-surface-secondary)]">
      {/* Left Sidebar */}
      <Sidebar className={`shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarHeader className="relative">
          <div className="flex h-9 items-center gap-3">
            <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--motion-brand-primary)]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="currentColor"
                className="text-[var(--motion-text-inverse)]"
              >
                <path d="M7.5 0L0 7.5L7.5 15L15 7.5L7.5 0Z" />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-base font-normal text-[var(--motion-text-primary)]">
                motionTuner
              </span>
            )}
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] shadow-sm hover:bg-[var(--motion-surface-tertiary)]"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-[var(--motion-text-secondary)]" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-[var(--motion-text-secondary)]" />
            )}
          </button>
        </SidebarHeader>

        <SidebarContent className="flex flex-col justify-between">
          {/* Main Navigation */}
          <div className="flex flex-col gap-2">
            <SidebarNav>
              <SidebarNavItem
                href="/"
                icon={<HomeIcon className="h-5 w-5" />}
                active={currentPath === '/'}
                onClick={event => {
                  event.preventDefault()
                  onNavigate('/')
                }}
                title={collapsed ? 'Home' : undefined}
              >
                {!collapsed && 'Home'}
              </SidebarNavItem>
              <SidebarNavItem
                href="/motion-tuner"
                icon={<Square2StackIcon className="h-5 w-5" />}
                active={currentPath === '/motion-tuner'}
                onClick={event => {
                  event.preventDefault()
                  onNavigate('/motion-tuner')
                }}
                title={collapsed ? 'Create' : undefined}
              >
                {!collapsed && 'Create'}
              </SidebarNavItem>
              <SidebarNavItem
                href="/settings"
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                onClick={event => {
                  event.preventDefault()
                  onNavigate('/settings')
                }}
                title={collapsed ? 'Settings' : undefined}
              >
                {!collapsed && 'Settings'}
              </SidebarNavItem>
            </SidebarNav>
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col gap-4 border-t border-[var(--motion-border-default)] pt-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--motion-text-secondary)] transition-colors hover:bg-[var(--motion-surface-tertiary)] hover:text-[var(--motion-text-primary)]"
              title={
                collapsed
                  ? resolvedTheme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                  : undefined
              }
            >
              {resolvedTheme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
              {!collapsed && (resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode')}
            </button>

            <SidebarNav>
              <SidebarNavItem
                href="/support"
                icon={<QuestionMarkCircleIcon className="h-5 w-5" />}
                onClick={event => {
                  event.preventDefault()
                  onNavigate('/support')
                }}
                title={collapsed ? 'Support' : undefined}
              >
                {!collapsed && 'Support'}
              </SidebarNavItem>
              <SidebarNavItem
                href="/changelog"
                icon={<SparklesIcon className="h-5 w-5" />}
                onClick={event => {
                  event.preventDefault()
                  onNavigate('/changelog')
                }}
                title={collapsed ? 'Changelog' : undefined}
              >
                {!collapsed && 'Changelog'}
              </SidebarNavItem>
            </SidebarNav>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1">
        {/* Center Preview Panel (expanded) */}
        <div className="min-w-0 flex-1 overflow-y-auto">{previewPanel}</div>

        {/* Right Control Panel (if provided) */}
        {controlPanel && (
          <div className="w-[480px] flex-shrink-0 overflow-y-auto border-l border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)]">
            {controlPanel}
          </div>
        )}
      </div>
    </div>
  )
}
