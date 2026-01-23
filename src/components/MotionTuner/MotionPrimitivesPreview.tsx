'use client'
import * as React from 'react'
import type { Transition, Variants } from 'motion/react'
import { useMotion, type PreviewComponent } from '@/context/MotionContext'
import { bezierToMotionTransition } from '@/utils'
import { Button } from '@/components/primitives/Button'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/motion-primitives/accordion'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/motion-primitives/dialog'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogClose,
} from '@/components/motion-primitives/morphing-dialog'
import { TextEffect } from '@/components/motion-primitives/text-effect'
import { AnimatedNumber } from '@/components/motion-primitives/animated-number'
import { SlidingNumber } from '@/components/motion-primitives/sliding-number'
import { TransitionPanel } from '@/components/motion-primitives/transition-panel'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselIndicator,
} from '@/components/motion-primitives/carousel'

interface MotionPrimitivesPreviewProps {
  component: PreviewComponent
}

export function MotionPrimitivesPreview({ component }: MotionPrimitivesPreviewProps) {
  const { state, currentDurationMS } = useMotion()
  const transition = React.useMemo(
    () => bezierToMotionTransition(state.easingCurve, currentDurationMS),
    [state.easingCurve, currentDurationMS]
  )

  switch (component) {
    case 'mp-accordion':
      return <MPAccordionPreview transition={transition} />
    case 'mp-dialog':
      return <MPDialogPreview transition={transition} />
    case 'mp-morphing-dialog':
      return <MPMorphingDialogPreview transition={transition} />
    case 'mp-text-effect':
      return <MPTextEffectPreview transition={transition} />
    case 'mp-animated-number':
      return <MPAnimatedNumberPreview />
    case 'mp-sliding-number':
      return <MPSlidingNumberPreview />
    case 'mp-transition-panel':
      return <MPTransitionPanelPreview transition={transition} />
    case 'mp-carousel':
      return <MPCarouselPreview transition={transition} />
    default:
      return <div className="text-[var(--motion-text-muted)]">Preview not available</div>
  }
}

function PreviewCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">{title}</h4>
        <p className="text-base text-[var(--motion-text-muted)]">{description}</p>
      </div>
      {children}
    </div>
  )
}

function MPAccordionPreview({ transition }: { transition: Transition }) {
  return (
    <PreviewCard
      title="Motion Primitives Accordion"
      description="Accordion powered by Motion, using your easing curve."
    >
      <Accordion transition={transition} className="flex flex-col gap-2">
        {[
          {
            title: 'Why Motion Primitives?',
            content: 'Prebuilt animations that you can customize with your own easing.',
          },
          {
            title: 'Custom Easing',
            content: 'Every expand/collapse uses your custom cubic-bezier curve.',
          },
          {
            title: 'Reusable',
            content: 'Swap the transition object to match any product context.',
          },
        ].map((item, index) => (
          <AccordionItem
            key={item.title}
            value={index}
            className="rounded-lg border border-[var(--motion-border-default)]"
          >
            <AccordionTrigger className="flex w-full items-center justify-between bg-[var(--motion-surface-tertiary)] px-4 py-3 text-left text-sm text-[var(--motion-text-primary)]">
              {item.title}
              <span className="text-xs text-[var(--motion-text-muted)]">↕</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 py-3 text-sm text-[var(--motion-text-secondary)]">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PreviewCard>
  )
}

function MPDialogPreview({ transition }: { transition: Transition }) {
  return (
    <PreviewCard
      title="Motion Primitives Dialog"
      description="A modal dialog that respects your custom easing."
    >
      <Dialog transition={transition}>
        <DialogTrigger className="rounded-lg bg-[var(--motion-brand-primary)] px-4 py-2 text-sm text-[var(--motion-text-inverse)]">
          Open Dialog
        </DialogTrigger>
        <DialogContent className="rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
          <DialogClose />
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[var(--motion-text-primary)]">
              Motion Dialog
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--motion-text-secondary)]">
              This dialog animates with your current cubic-bezier curve.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]">
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PreviewCard>
  )
}

function MPMorphingDialogPreview({ transition }: { transition: Transition }) {
  return (
    <PreviewCard
      title="Morphing Dialog"
      description="Layout animation transitions a card into a dialog."
    >
      <MorphingDialog transition={transition}>
        <MorphingDialogTrigger className="w-full rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4 text-left">
          <div className="text-sm font-semibold text-[var(--motion-text-primary)]">
            Project Brief
          </div>
          <div className="text-xs text-[var(--motion-text-muted)]">Click to expand</div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer>
          <MorphingDialogContent className="relative w-[420px] max-w-[90vw] rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
            <MorphingDialogClose />
            <MorphingDialogTitle className="text-lg font-semibold text-[var(--motion-text-primary)]">
              Project Brief
            </MorphingDialogTitle>
            <MorphingDialogDescription className="mt-2 text-sm text-[var(--motion-text-secondary)]">
              This dialog morphs smoothly between layouts using your easing curve.
            </MorphingDialogDescription>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline">Close</Button>
              <Button className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]">
                Continue
              </Button>
            </div>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </PreviewCard>
  )
}

function MPTextEffectPreview({ transition }: { transition: Transition }) {
  return (
    <PreviewCard
      title="Text Effect"
      description="Animated text reveal driven by Motion Primitives."
    >
      <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4">
        <TextEffect
          preset="fade-in-blur"
          per="word"
          containerTransition={{ ...transition, delay: 0.1 }}
          segmentTransition={transition}
          className="text-lg font-semibold text-[var(--motion-text-primary)]"
        >
          Motion makes product experiences feel alive.
        </TextEffect>
      </div>
    </PreviewCard>
  )
}

function MPAnimatedNumberPreview() {
  const { currentDurationMS } = useMotion()

  return (
    <PreviewCard
      title="Animated Number"
      description="Smooth duration changes with spring animation."
    >
      <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-6 text-center">
        <AnimatedNumber
          value={currentDurationMS}
          className="text-3xl font-semibold text-[var(--motion-text-primary)]"
        />
        <p className="mt-2 text-sm text-[var(--motion-text-muted)]">ms</p>
      </div>
    </PreviewCard>
  )
}

function MPSlidingNumberPreview() {
  const { currentDurationMS } = useMotion()

  return (
    <PreviewCard
      title="Sliding Number"
      description="Digit-by-digit rolling animation for duration."
    >
      <div className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-6 text-center">
        <div className="text-3xl font-semibold text-[var(--motion-text-primary)]">
          <SlidingNumber value={currentDurationMS} />
        </div>
        <p className="mt-2 text-sm text-[var(--motion-text-muted)]">ms</p>
      </div>
    </PreviewCard>
  )
}

const TRANSITION_PANEL_VARIANTS: Variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

function MPTransitionPanelPreview({ transition }: { transition: Transition }) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const items = [
    { title: 'Discover', body: 'Explore motion presets and behaviors.' },
    { title: 'Refine', body: 'Tune easing curves and durations.' },
    { title: 'Export', body: 'Share motion across frameworks.' },
  ]

  return (
    <PreviewCard
      title="Transition Panel"
      description="Switch content with animated enter/exit transitions."
    >
      <div className="flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.title}
            onClick={() => setActiveIndex(index)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              activeIndex === index
                ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
                : 'bg-[var(--motion-surface-tertiary)] text-[var(--motion-text-secondary)]'
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>
      <TransitionPanel
        className="rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-4"
        activeIndex={activeIndex}
        transition={transition}
        variants={TRANSITION_PANEL_VARIANTS}
      >
        {items.map(item => (
          <div key={item.title}>
            <h5 className="text-base font-semibold text-[var(--motion-text-primary)]">
              {item.title}
            </h5>
            <p className="mt-1 text-sm text-[var(--motion-text-secondary)]">{item.body}</p>
          </div>
        ))}
      </TransitionPanel>
    </PreviewCard>
  )
}

function MPCarouselPreview({ transition }: { transition: Transition }) {
  const cards = [
    { title: 'Emphasized', detail: 'Expressive, personality-driven motion.' },
    { title: 'Standard', detail: 'Balanced motion for common interactions.' },
    { title: 'Legacy', detail: 'Classic CSS timing functions.' },
  ]

  return (
    <PreviewCard title="Carousel" description="Swipeable cards with Motion-powered transitions.">
      <Carousel className="relative">
        <CarouselContent
          className="gap-4"
          transition={{ ...transition, type: 'spring', damping: 18, stiffness: 90 }}
        >
          {cards.map(card => (
            <CarouselItem key={card.title} className="basis-full">
              <div className="rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)] p-6">
                <h5 className="text-base font-semibold text-[var(--motion-text-primary)]">
                  {card.title}
                </h5>
                <p className="mt-2 text-sm text-[var(--motion-text-secondary)]">{card.detail}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation />
        <CarouselIndicator />
      </Carousel>
    </PreviewCard>
  )
}
