import { Button } from '@/components/primitives/Button'
import { Badge } from '@/components/primitives/Badge'
import { Avatar } from '@/components/primitives/Avatar'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'
import { Switch } from '@/components/forms/Switch'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <Heading type="heading">Catalyst UI</Heading>
          <Heading type="subheading" as="h2">
            A React + Tailwind design system
          </Heading>
          <Text className="mt-4">
            Run <Text variant="code">npm run storybook</Text> to see all components.
          </Text>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Components Preview</h3>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="plain">Plain</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge color="zinc">Default</Badge>
            <Badge color="green">Success</Badge>
            <Badge color="yellow">Warning</Badge>
            <Badge color="red">Error</Badge>
            <Badge color="indigo">Info</Badge>
          </div>

          <div className="flex gap-4 items-center">
            <Avatar size={6} initials="JD" />
            <Avatar size={8} initials="AB" type="rounded" />
            <Avatar size={10} src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" />
          </div>

          <div className="flex gap-4">
            <Switch label="Dark mode" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
