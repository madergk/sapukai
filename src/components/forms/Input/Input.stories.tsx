import type { Meta, StoryObj } from '@storybook/react-vite'
import { MagnifyingGlassIcon, EnvelopeIcon, ExclamationCircleIcon } from '@heroicons/react/16/solid'
import { Input } from './Input'

const meta = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    inputSize: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
    error: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter your name...',
  },
}

export const WithLabel: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email.",
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    error: true,
    helperText: 'Please enter a valid email address.',
    defaultValue: 'invalid-email',
  },
}

export const WithIcons: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Input
        label="Search"
        placeholder="Search..."
        iconLeading={<MagnifyingGlassIcon className="size-4" />}
      />
      <Input
        label="Email"
        placeholder="you@example.com"
        iconTrailing={<EnvelopeIcon className="size-4" />}
      />
      <Input
        label="Email (error)"
        placeholder="you@example.com"
        error
        iconTrailing={<ExclamationCircleIcon className="size-4 text-red-500" />}
        helperText="Invalid email address"
      />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Input inputSize="sm" placeholder="Small input" label="Small" />
      <Input inputSize="base" placeholder="Base input" label="Base" />
      <Input inputSize="lg" placeholder="Large input" label="Large" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="w-72 space-y-4">
      <Input label="Default" placeholder="Default state" />
      <Input label="Disabled" placeholder="Disabled state" disabled />
      <Input label="Error" placeholder="Error state" error helperText="Something went wrong" />
    </div>
  ),
}
