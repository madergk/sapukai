import * as React from 'react'
import { Sidebar, SidebarHeader, SidebarContent, SidebarNav, SidebarNavItem } from '@/components/navigation/Sidebar'
import {
  HomeIcon,
  Square2StackIcon,
  TicketIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid'

interface MotionTunerLayoutProps {
  children: React.ReactNode
  previewPanel?: React.ReactNode
  currentPath: string
  onNavigate: (path: string) => void
}

export function MotionTunerLayout({
  children,
  previewPanel,
  currentPath,
  onNavigate,
}: MotionTunerLayoutProps) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  return (
    <div className="flex h-screen w-full bg-zinc-50">
      {/* Left Sidebar */}
      <Sidebar className="w-64 shrink-0">
        <SidebarHeader>
          <div className="flex h-9 items-center gap-3">
            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-[9px] bg-[var(--motion-brand-primary)]">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="white">
                <path d="M7.5 0L0 7.5L7.5 15L15 7.5L7.5 0Z" />
              </svg>
            </div>
            <span className="text-base font-normal text-zinc-950">motionTuner</span>
          </div>
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
              >
                Home
              </SidebarNavItem>
              <SidebarNavItem
                href="/motion-tuner"
                icon={<Square2StackIcon className="h-5 w-5" />}
                active={currentPath === '/motion-tuner'}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/motion-tuner')
                }}
              >
                Create
              </SidebarNavItem>
              <SidebarNavItem
                href="/showcase"
                icon={<TicketIcon className="h-5 w-5" />}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/showcase')
                }}
              >
                Showcase
              </SidebarNavItem>
              <SidebarNavItem
                href="/broadcasts"
                icon={<MegaphoneIcon className="h-5 w-5" />}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/broadcasts')
                }}
              >
                Broadcasts
              </SidebarNavItem>
              <SidebarNavItem
                href="/settings"
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/settings')
                }}
              >
                Settings
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
              >
                Support
              </SidebarNavItem>
              <SidebarNavItem
                href="/changelog"
                icon={<SparklesIcon className="h-5 w-5" />}
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate('/changelog')
                }}
              >
                Changelog
              </SidebarNavItem>
            </SidebarNav>

            {/* User Menu */}
            <div className="border-t border-zinc-200 pt-4">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-zinc-100"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-[var(--motion-brand-primary)] to-[var(--motion-brand-primary-accent)]" />
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium text-zinc-950">Erica</span>
                    <span className="text-xs text-zinc-500">erica@example.com</span>
                  </div>
                </div>
                <ChevronUpIcon
                  className={`h-5 w-5 text-zinc-500 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Central Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Right Preview Panel (if provided) */}
        {previewPanel && (
          <div className="w-[420px] shrink-0 overflow-y-auto">{previewPanel}</div>
        )}
      </div>
    </div>
  )
}
