import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta = {
  title: 'Primitives/Heading',
  component: Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['heading', 'subheading'],
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    },
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Page Heading',
    type: 'heading',
    as: 'h1',
  },
}

export const Subheading: Story = {
  args: {
    children: 'Section Subheading',
    type: 'subheading',
    as: 'h2',
  },
}

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading type="heading" as="h1">
        Main Heading
      </Heading>
      <Heading type="subheading" as="h2">
        Section Subheading
      </Heading>
    </div>
  ),
}

export const WithContent: Story = {
  render: () => (
    <div className="max-w-lg space-y-4">
      <Heading type="heading">Team Members</Heading>
      <Heading type="subheading" as="h2">
        Manage your team and their account permissions here.
      </Heading>
      <p className="text-zinc-600 dark:text-zinc-400">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  ),
}
