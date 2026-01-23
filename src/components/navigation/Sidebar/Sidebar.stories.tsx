import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  HomeIcon,
  CalendarIcon,
  ShoppingCartIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/16/solid'
import { Avatar } from '@/components/primitives/Avatar'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarSection,
  SidebarSectionTitle,
  SidebarNav,
  SidebarNavItem,
  SidebarFooter,
} from './Sidebar'

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <Sidebar>
        <SidebarHeader>
          <div className="size-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">Catalyst</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav>
            <SidebarNavItem href="#" active icon={<HomeIcon />}>
              Home
            </SidebarNavItem>
            <SidebarNavItem href="#" icon={<CalendarIcon />}>
              Events
            </SidebarNavItem>
            <SidebarNavItem href="#" icon={<ShoppingCartIcon />}>
              Orders
            </SidebarNavItem>
            <SidebarNavItem href="#" icon={<ChartBarIcon />}>
              Reports
            </SidebarNavItem>
            <SidebarNavItem href="#" icon={<Cog6ToothIcon />}>
              Settings
            </SidebarNavItem>
          </SidebarNav>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar
              size={8}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Tom Cook</span>
              <span className="text-xs text-zinc-500">tom@example.com</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
}

export const WithSections: Story = {
  render: () => (
    <div className="h-screen">
      <Sidebar>
        <SidebarHeader>
          <div className="size-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-semibold text-zinc-900 dark:text-white">Catalyst</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarSection>
            <SidebarSectionTitle>Main</SidebarSectionTitle>
            <SidebarNav>
              <SidebarNavItem href="#" active icon={<HomeIcon />}>
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem href="#" icon={<CalendarIcon />}>
                Events
              </SidebarNavItem>
              <SidebarNavItem href="#" icon={<ShoppingCartIcon />}>
                Orders
              </SidebarNavItem>
            </SidebarNav>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>Management</SidebarSectionTitle>
            <SidebarNav>
              <SidebarNavItem href="#" icon={<UserGroupIcon />}>
                Team
              </SidebarNavItem>
              <SidebarNavItem href="#" icon={<DocumentTextIcon />}>
                Documents
              </SidebarNavItem>
              <SidebarNavItem href="#" icon={<ChartBarIcon />}>
                Reports
              </SidebarNavItem>
            </SidebarNav>
          </SidebarSection>
          <SidebarSection>
            <SidebarSectionTitle>Support</SidebarSectionTitle>
            <SidebarNav>
              <SidebarNavItem href="#" icon={<QuestionMarkCircleIcon />}>
                Help Center
              </SidebarNavItem>
              <SidebarNavItem href="#" icon={<Cog6ToothIcon />}>
                Settings
              </SidebarNavItem>
            </SidebarNav>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
            <Avatar
              size={8}
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Tom Cook</span>
              <span className="text-xs text-zinc-500">Admin</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  ),
}
