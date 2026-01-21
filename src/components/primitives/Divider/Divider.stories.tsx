import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'soft'],
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-64">
      <Divider />
    </div>
  ),
}

export const Soft: Story = {
  render: () => (
    <div className="w-64">
      <Divider type="soft" />
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Content above</p>
      <Divider />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Content below</p>
    </div>
  ),
}

export const Comparison: Story = {
  render: () => (
    <div className="w-64 space-y-6">
      <div>
        <p className="text-xs text-zinc-500 mb-2">Default</p>
        <Divider type="default" />
      </div>
      <div>
        <p className="text-xs text-zinc-500 mb-2">Soft</p>
        <Divider type="soft" />
      </div>
    </div>
  ),
}
