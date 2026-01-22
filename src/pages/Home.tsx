import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'

interface HomeProps {
  onNavigate: (path: string) => void
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen bg-white px-12 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Heading type="heading">Motion Tuner</Heading>
          <Heading type="subheading" as="h2">
            Build and export custom cubic-bezier curves
          </Heading>
          <Text className="max-w-2xl text-zinc-500">
            Create motion tokens, preview real UI interactions, and export easing curves in a
            developer-friendly format. Use the Motion Tuner to stay aligned with Material Design 3
            motion guidance.
          </Text>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <Heading type="subheading" as="h3">
            Start tuning your motion
          </Heading>
          <Text className="text-zinc-500">
            Jump into the tuner to edit curves, adjust duration, and preview animations across
            common UI components.
          </Text>
          <div>
            <Button
              onClick={() => onNavigate('/motion-tuner')}
              className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
            >
              Open Motion Tuner
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
