import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    labelPosition: {
      control: 'select',
      options: ['leading', 'trailing'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
    description: "",
    labelPosition: "trailing"
  },
}

export const WithDescription: Story = {
  args: {
    label: 'Dark mode',
    description: 'Use dark theme across the application',
  },
}

export const LabelLeading: Story = {
  args: {
    label: 'Airplane mode',
    description: 'Disable all wireless connections',
    labelPosition: 'leading',
  },
}

export const Checked: Story = {
  args: {
    label: 'Auto-save',
    defaultChecked: true,
  },
}

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Switch label="Disabled off" disabled />
      <Switch label="Disabled on" disabled defaultChecked />
    </div>
  ),
}

export const SwitchGroup: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Switch
        label="Push notifications"
        description="Receive push notifications on your device"
        defaultChecked
      />
      <Switch
        label="Email notifications"
        description="Get email updates about your account"
        defaultChecked
      />
      <Switch
        label="Marketing emails"
        description="Receive emails about new features and offers"
      />
    </div>
  ),
}
