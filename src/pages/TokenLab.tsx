import { Button } from '@/components/primitives/Button'
import { Heading } from '@/components/primitives/Heading'
import { Text } from '@/components/primitives/Text'

interface TokenLabProps {
  onNavigate: (path: string) => void
}

export function TokenLab({ onNavigate }: TokenLabProps) {
  return (
    <div className="min-h-screen bg-white px-12 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Heading type="heading">Token Lab</Heading>
        <Text className="max-w-2xl text-zinc-500">
          Explore variable collections, audit token mappings, and review sync-ready updates in the
          Sapukai Token Lab module.
        </Text>
        <div>
          <Button
            onClick={() => onNavigate('/')}
            className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
