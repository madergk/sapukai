import type { Meta, StoryObj } from '@storybook/react-vite'
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/16/solid'
import { Button } from '@/components/primitives/Button'
import { Avatar } from '@/components/primitives/Avatar'
import {
  Navbar,
  NavbarBrand,
  NavbarNav,
  NavbarItem,
  NavbarActions,
} from './Navbar'

const meta = {
  title: 'Navigation/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <div className="size-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-semibold text-zinc-900 dark:text-white">
          Catalyst
        </span>
      </NavbarBrand>
      <NavbarNav>
        <NavbarItem href="#" active>Home</NavbarItem>
        <NavbarItem href="#">Events</NavbarItem>
        <NavbarItem href="#">Orders</NavbarItem>
        <NavbarItem href="#">Settings</NavbarItem>
      </NavbarNav>
      <NavbarActions>
        <Button variant="plain" iconOnly size="base">
          <MagnifyingGlassIcon className="size-5" />
        </Button>
        <Button variant="plain" iconOnly size="base">
          <BellIcon className="size-5" />
        </Button>
        <Avatar
          size={8}
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
        />
      </NavbarActions>
    </Navbar>
  ),
}

export const WithSearch: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <div className="size-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-semibold text-zinc-900 dark:text-white">
          Catalyst
        </span>
      </NavbarBrand>
      <div className="hidden md:flex flex-1 items-center justify-center px-6">
        <div className="relative w-full max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full h-9 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
      </div>
      <NavbarActions>
        <Button variant="outline" size="sm">Sign in</Button>
        <Button size="sm">Sign up</Button>
      </NavbarActions>
    </Navbar>
  ),
}

export const Minimal: Story = {
  render: () => (
    <Navbar>
      <NavbarBrand>
        <span className="font-semibold text-zinc-900 dark:text-white">
          Catalyst
        </span>
      </NavbarBrand>
      <NavbarActions>
        <Button variant="outline" size="sm">Log in</Button>
        <Button size="sm">Get started</Button>
      </NavbarActions>
    </Navbar>
  ),
}
