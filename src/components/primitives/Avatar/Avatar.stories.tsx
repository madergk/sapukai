import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from './Avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['circular', 'rounded'],
    },
    size: {
      control: 'select',
      options: [4, 6, 8, 10],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

const sampleImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: 'User avatar',
    type: 'circular',
    size: 8,
  },
}

export const WithInitials: Story = {
  args: {
    initials: 'JD',
    type: 'circular',
    size: 8,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size={4} src={sampleImage} alt="Size 4" />
      <Avatar size={6} src={sampleImage} alt="Size 6" />
      <Avatar size={8} src={sampleImage} alt="Size 8" />
      <Avatar size={10} src={sampleImage} alt="Size 10" />
    </div>
  ),
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-500 mb-2">Circular</p>
        <div className="flex items-center gap-4">
          <Avatar type="circular" size={4} src={sampleImage} />
          <Avatar type="circular" size={6} src={sampleImage} />
          <Avatar type="circular" size={8} src={sampleImage} />
          <Avatar type="circular" size={10} src={sampleImage} />
        </div>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-2">Rounded</p>
        <div className="flex items-center gap-4">
          <Avatar type="rounded" size={4} src={sampleImage} />
          <Avatar type="rounded" size={6} src={sampleImage} />
          <Avatar type="rounded" size={8} src={sampleImage} />
          <Avatar type="rounded" size={10} src={sampleImage} />
        </div>
      </div>
    </div>
  ),
}

export const InitialsSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-500 mb-2">Circular with initials</p>
        <div className="flex items-center gap-4">
          <Avatar type="circular" size={4} initials="JD" />
          <Avatar type="circular" size={6} initials="AB" />
          <Avatar type="circular" size={8} initials="CD" />
          <Avatar type="circular" size={10} initials="EF" />
        </div>
      </div>
      <div>
        <p className="text-sm text-zinc-500 mb-2">Rounded with initials</p>
        <div className="flex items-center gap-4">
          <Avatar type="rounded" size={4} initials="GH" />
          <Avatar type="rounded" size={6} initials="IJ" />
          <Avatar type="rounded" size={8} initials="KL" />
          <Avatar type="rounded" size={10} initials="MN" />
        </div>
      </div>
    </div>
  ),
}

export const Fallback: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size={8} />
      <Avatar size={8} src="invalid-url.jpg" />
      <Avatar size={8} initials="JD" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar
        size={8}
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
        className="ring-2 ring-white dark:ring-zinc-950"
      />
      <Avatar
        size={8}
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
        className="ring-2 ring-white dark:ring-zinc-950"
      />
      <Avatar
        size={8}
        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
        className="ring-2 ring-white dark:ring-zinc-950"
      />
      <Avatar
        size={8}
        initials="+3"
        className="ring-2 ring-white dark:ring-zinc-950"
      />
    </AvatarGroup>
  ),
}
