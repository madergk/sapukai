import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Marketing emails',
    description: 'Receive emails about new products, features, and more.',
  },
}

export const Checked: Story = {
  args: {
    label: 'Remember me',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
}

export const CheckboxGroup: Story = {
  render: () => (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
        Notifications
      </legend>
      <Checkbox label="Push notifications" description="Get notified on your device" />
      <Checkbox label="Email notifications" description="Receive email updates" defaultChecked />
      <Checkbox label="SMS notifications" description="Get text message alerts" />
    </fieldset>
  ),
}
