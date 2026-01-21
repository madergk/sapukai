import type { Meta, StoryObj } from '@storybook/react-vite'
import { UserIcon, BuildingOfficeIcon, GlobeAltIcon } from '@heroicons/react/16/solid'
import {
  Listbox,
  ListboxContent,
  ListboxGroup,
  ListboxItem,
  ListboxLabel,
  ListboxTrigger,
  ListboxValue,
} from './Listbox'

const meta = {
  title: 'Forms/Listbox',
  component: Listbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Listbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Listbox>
      <ListboxTrigger className="w-56">
        <ListboxValue placeholder="Select a person" />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxItem value="wade">Wade Cooper</ListboxItem>
        <ListboxItem value="arlene">Arlene Mccoy</ListboxItem>
        <ListboxItem value="devon">Devon Webb</ListboxItem>
        <ListboxItem value="tom">Tom Cook</ListboxItem>
      </ListboxContent>
    </Listbox>
  ),
}

export const WithAvatars: Story = {
  render: () => (
    <Listbox>
      <ListboxTrigger className="w-72">
        <ListboxValue placeholder="Assign to..." />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxItem
          value="wade"
          avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
        >
          Wade Cooper
        </ListboxItem>
        <ListboxItem
          value="arlene"
          avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
        >
          Arlene Mccoy
        </ListboxItem>
        <ListboxItem
          value="devon"
          avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
        >
          Devon Webb
        </ListboxItem>
      </ListboxContent>
    </Listbox>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Listbox>
      <ListboxTrigger className="w-56">
        <ListboxValue placeholder="Select type" />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxItem value="personal" icon={<UserIcon className="size-4" />}>
          Personal
        </ListboxItem>
        <ListboxItem value="business" icon={<BuildingOfficeIcon className="size-4" />}>
          Business
        </ListboxItem>
        <ListboxItem value="global" icon={<GlobeAltIcon className="size-4" />}>
          Global
        </ListboxItem>
      </ListboxContent>
    </Listbox>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <Listbox>
      <ListboxTrigger className="w-72">
        <ListboxValue placeholder="Select a plan" />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxItem value="starter" description="5 projects, 1 team member">
          Starter
        </ListboxItem>
        <ListboxItem value="pro" description="Unlimited projects, 10 team members">
          Pro
        </ListboxItem>
        <ListboxItem value="enterprise" description="Custom limits, unlimited team">
          Enterprise
        </ListboxItem>
      </ListboxContent>
    </Listbox>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Listbox>
      <ListboxTrigger className="w-64">
        <ListboxValue placeholder="Select a team member" />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxGroup>
          <ListboxLabel>Engineering</ListboxLabel>
          <ListboxItem
            value="wade"
            avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
            description="Lead Engineer"
          >
            Wade Cooper
          </ListboxItem>
          <ListboxItem
            value="devon"
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces"
            description="Senior Developer"
          >
            Devon Webb
          </ListboxItem>
        </ListboxGroup>
        <ListboxGroup>
          <ListboxLabel>Design</ListboxLabel>
          <ListboxItem
            value="arlene"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
            description="Design Lead"
          >
            Arlene Mccoy
          </ListboxItem>
        </ListboxGroup>
      </ListboxContent>
    </Listbox>
  ),
}
