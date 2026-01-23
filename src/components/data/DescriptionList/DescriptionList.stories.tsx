import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DescriptionList,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListDetails,
} from './DescriptionList'

const meta = {
  title: 'Data/DescriptionList',
  component: DescriptionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof DescriptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <DescriptionList layout="horizontal" className="w-[600px]">
      <DescriptionListItem>
        <DescriptionListTerm>Full name</DescriptionListTerm>
        <DescriptionListDetails>Margot Foster</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Email address</DescriptionListTerm>
        <DescriptionListDetails>margotfoster@example.com</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Role</DescriptionListTerm>
        <DescriptionListDetails>Product Designer</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Department</DescriptionListTerm>
        <DescriptionListDetails>Design</DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>
  ),
}

export const Vertical: Story = {
  render: () => (
    <DescriptionList layout="vertical" className="w-80">
      <DescriptionListItem>
        <DescriptionListTerm>Full name</DescriptionListTerm>
        <DescriptionListDetails>Margot Foster</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Application for</DescriptionListTerm>
        <DescriptionListDetails>Backend Developer</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Email address</DescriptionListTerm>
        <DescriptionListDetails>margotfoster@example.com</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Salary expectation</DescriptionListTerm>
        <DescriptionListDetails>$120,000</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>About</DescriptionListTerm>
        <DescriptionListDetails>
          Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa
          consequat. Excepteur qui ipsum aliquip consequat sint.
        </DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>
  ),
}

export const ProfileCard: Story = {
  render: () => (
    <div className="w-96 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
        Application Information
      </h3>
      <DescriptionList layout="vertical">
        <DescriptionListItem>
          <DescriptionListTerm>Full name</DescriptionListTerm>
          <DescriptionListDetails>Margot Foster</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListTerm>Email address</DescriptionListTerm>
          <DescriptionListDetails>margotfoster@example.com</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListTerm>Phone</DescriptionListTerm>
          <DescriptionListDetails>+1 (555) 123-4567</DescriptionListDetails>
        </DescriptionListItem>
        <DescriptionListItem>
          <DescriptionListTerm>Location</DescriptionListTerm>
          <DescriptionListDetails>San Francisco, CA</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>
    </div>
  ),
}
