import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: [
        'zinc',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Badge',
    color: 'zinc',
  },
}

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge color="zinc">Zinc</Badge>
      <Badge color="red">Red</Badge>
      <Badge color="orange">Orange</Badge>
      <Badge color="amber">Amber</Badge>
      <Badge color="yellow">Yellow</Badge>
      <Badge color="lime">Lime</Badge>
      <Badge color="green">Green</Badge>
      <Badge color="emerald">Emerald</Badge>
      <Badge color="teal">Teal</Badge>
      <Badge color="cyan">Cyan</Badge>
      <Badge color="sky">Sky</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="indigo">Indigo</Badge>
      <Badge color="violet">Violet</Badge>
      <Badge color="purple">Purple</Badge>
      <Badge color="fuchsia">Fuchsia</Badge>
      <Badge color="pink">Pink</Badge>
      <Badge color="rose">Rose</Badge>
    </div>
  ),
}

export const StatusBadges: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge color="green">Active</Badge>
      <Badge color="yellow">Pending</Badge>
      <Badge color="red">Inactive</Badge>
      <Badge color="zinc">Draft</Badge>
    </div>
  ),
}
