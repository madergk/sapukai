import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './Radio'

const meta = {
  title: 'Forms/Radio',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <RadioGroupItem value="option-1" label="Option 1" />
      <RadioGroupItem value="option-2" label="Option 2" />
      <RadioGroupItem value="option-3" label="Option 3" />
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="startup">
      <RadioGroupItem
        value="startup"
        label="Startup"
        description="Perfect for small teams and projects"
      />
      <RadioGroupItem
        value="business"
        label="Business"
        description="Advanced features for growing teams"
      />
      <RadioGroupItem
        value="enterprise"
        label="Enterprise"
        description="Custom solutions for large organizations"
      />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <RadioGroupItem value="option-1" label="Option 1 (selected)" />
      <RadioGroupItem value="option-2" label="Option 2" />
      <RadioGroupItem value="option-3" label="Option 3" />
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="monthly" className="flex gap-6">
      <RadioGroupItem value="monthly" label="Monthly" />
      <RadioGroupItem value="yearly" label="Yearly" />
    </RadioGroup>
  ),
}
