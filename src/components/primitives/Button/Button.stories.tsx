import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/16/solid'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'plain'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'base',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

export const Plain: Story = {
  args: {
    children: 'Plain',
    variant: 'plain',
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="base">Base</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button>
        <PlusIcon className="size-4" />
        Add Item
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon className="size-4" />
      </Button>
    </div>
  ),
}

export const IconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button iconOnly size="xs" aria-label="Add">
        <PlusIcon className="size-3" />
      </Button>
      <Button iconOnly size="sm" aria-label="Add">
        <PlusIcon className="size-4" />
      </Button>
      <Button iconOnly size="base" aria-label="Add">
        <PlusIcon className="size-4" />
      </Button>
      <Button iconOnly size="lg" aria-label="Add">
        <PlusIcon className="size-5" />
      </Button>
      <Button iconOnly size="xl" aria-label="Add">
        <PlusIcon className="size-5" />
      </Button>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {(['default', 'outline', 'plain'] as const).map((variant) => (
        <div key={variant} className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 capitalize">{variant}</p>
          <div className="flex items-center gap-4">
            <Button variant={variant} size="xs">Extra Small</Button>
            <Button variant={variant} size="sm">Small</Button>
            <Button variant={variant} size="base">Base</Button>
            <Button variant={variant} size="lg">Large</Button>
            <Button variant={variant} size="xl">Extra Large</Button>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled>Default</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="plain" disabled>Plain</Button>
    </div>
  ),
}
