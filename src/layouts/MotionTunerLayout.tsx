import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from '@/components/navigation/Sidebar'
import {
  HomeIcon,
  Square2StackIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'

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

  return (
    <div className="flex h-screen w-full bg-zinc-50">
      {/* Left Sidebar */}
      <Sidebar className={`shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <SidebarHeader className="relative">
          <div className="flex h-9 items-center gap-3">
            <div className="flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--motion-brand-primary)]">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
                <path d="M7.5 0L0 7.5L7.5 15L15 7.5L7.5 0Z" />
              </svg>
            </div>
            {!collapsed && <span className="text-base font-normal text-zinc-950">motionTuner</span>}
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-zinc-500" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-zinc-500" />
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
                onClick={(event) => {
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
                onClick={(event) => {
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
                onClick={(event) => {
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
          <div className="flex flex-col gap-4 border-t border-zinc-200 pt-4">
            <SidebarNav>
              <SidebarNavItem
                href="/support"
                icon={<QuestionMarkCircleIcon className="h-5 w-5" />}
                onClick={(event) => {
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
                onClick={(event) => {
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
          <div className="w-[480px] flex-shrink-0 overflow-y-auto border-l border-zinc-200 bg-white">{controlPanel}</div>
        )}
      </div>
    </div>
  )
}
