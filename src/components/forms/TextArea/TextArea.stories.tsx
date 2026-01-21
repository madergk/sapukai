import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from './TextArea'

const meta = {
  title: 'Forms/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Bio',
    description: 'Write a short bio about yourself. This will be displayed on your profile.',
    placeholder: 'Tell us about yourself...',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Comment',
    placeholder: 'Add a comment...',
    helperText: 'Maximum 500 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description...',
    error: true,
    helperText: 'Description is required',
    defaultValue: '',
  },
}

export const FullExample: Story = {
  args: {
    label: 'Project Description',
    description: 'Provide a detailed description of your project goals and requirements.',
    placeholder: 'Describe your project...',
    helperText: 'Be as specific as possible',
    rows: 5,
  },
}

export const States: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <TextArea label="Default" placeholder="Default state" />
      <TextArea label="Disabled" placeholder="Disabled state" disabled />
      <TextArea
        label="Error"
        placeholder="Error state"
        error
        helperText="This field is required"
      />
    </div>
  ),
}
