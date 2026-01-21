import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta = {
  title: 'Primitives/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'code'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg'],
    },
    underline: {
      control: 'boolean',
    },
    strong: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Regular text content',
  },
}

export const Code: Story = {
  args: {
    children: 'npm install',
    variant: 'code',
  },
}

export const Strong: Story = {
  args: {
    children: 'Important text',
    strong: true,
  },
}

export const Underlined: Story = {
  args: {
    children: 'Underlined text',
    underline: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-2">
      <div><Text size="xs">Extra small text (12px)</Text></div>
      <div><Text size="sm">Small text (14px)</Text></div>
      <div><Text size="base">Base text (16px)</Text></div>
      <div><Text size="lg">Large text (18px)</Text></div>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <p>
        <Text>Normal text</Text>
        {' '}
        <Text strong>strong text</Text>
        {' '}
        <Text underline>underlined text</Text>
        {' '}
        <Text variant="code">inline code</Text>
      </p>
      <p>
        <Text strong underline>Strong and underlined</Text>
      </p>
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-zinc-600 dark:text-zinc-400">
        Run <Text variant="code">npm install catalyst-ui</Text> to install the package.
        For more information, see the <Text underline strong>documentation</Text>.
      </p>
    </div>
  ),
}
