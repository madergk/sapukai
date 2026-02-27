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
          <Heading type="heading">Sapukai Systems</Heading>
          <Heading type="subheading" as="h2">
            Practical tools for the modern web
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

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <Heading type="subheading" as="h3">
            Explore design tokens
          </Heading>
          <Text className="text-zinc-500">
            Map token relationships, validate naming rules, and export updates. Supports importing
            Tokens Studio JSON to jumpstart analysis.
          </Text>
          <div>
            <Button
              onClick={() => onNavigate('/tokens-visualizer')}
              className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
            >
              Open Tokens Visualizer
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <Heading type="subheading" as="h3">
            Token Lab (Variable Collections)
          </Heading>
          <Text className="text-zinc-500">
            Connect to the Variable Collection module to explore token sets, review mappings, and
            sync updates directly from the Token Lab module.
          </Text>
          <div>
            <Button
              onClick={() => onNavigate('/token-lab')}
              className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
            >
              Open Token Lab
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <Heading type="subheading" as="h3">
            Informe de Migración Patagonia Azul 2026
          </Heading>
          <Text className="text-zinc-500">
            Informe técnico de migración del sitio Patagonia Azul: estado general, infraestructura,
            auditoría de redirecciones y SEO, y checklist de salud técnica.
          </Text>
          <div>
            <Button
              onClick={() => onNavigate('/patagonia-azul-informe')}
              className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
            >
              Ver Informe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
