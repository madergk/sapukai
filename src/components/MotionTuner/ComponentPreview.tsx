import * as React from 'react'
import { useMotion, type PreviewComponent } from '@/context/MotionContext'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/feedback/Dialog'
import { Button } from '@/components/primitives/Button'
import { cn } from '@/utils'

interface ComponentPreviewProps {
  component: PreviewComponent
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component) {
    case 'modal-dialog':
      return <ModalDialogPreview />
    case 'button-states':
      return <ButtonStatesPreview />
    case 'accordion':
      return <AccordionPreview />
    case 'notifications':
      return <NotificationsPreview />
    case 'loading-states':
      return <LoadingStatesPreview />
    case 'page-transition':
      return <PageTransitionPreview />
    default:
      return <div className="text-zinc-500">Preview not available</div>
  }
}

function ModalDialogPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Modal Dialog Animation</h4>
        <p className="text-base text-zinc-400">
          Click to open/close modal with custom easing
        </p>
      </div>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Open Modal
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="fixed left-1/2 top-1/2 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl"
          style={{
            transition: `transform ${currentDurationMS}ms ${currentEasingCSS}, opacity ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          <DialogTitle className="mb-4 text-xl font-semibold">
            Modal Dialog
          </DialogTitle>
          <DialogDescription className="mb-6 text-zinc-600">
            This modal animates with your custom cubic-bezier curve. Notice how the entrance and
            exit animations follow the easing you've defined.
          </DialogDescription>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
              onClick={() => setIsOpen(false)}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ButtonStatesPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Button States</h4>
        <p className="text-base text-zinc-400">
          Hover over buttons to see the transition
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-[var(--motion-brand-primary)] px-6 py-2 text-white hover:bg-[var(--motion-brand-primary-hover)] hover:scale-[1.05]"
          style={{
            transition: `background-color ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          Primary Button
        </button>

        <button
          className="rounded-full border-2 border-zinc-200 bg-white px-6 py-2 text-zinc-950 hover:border-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-soft)]"
          style={{
            transition: `all ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          Secondary Button
        </button>

        <button
          className="rounded-full bg-zinc-100 px-6 py-2 text-zinc-950 hover:bg-zinc-200"
          style={{
            transition: `background-color ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          Tertiary Button
        </button>
      </div>
    </div>
  )
}

function AccordionPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [openIndex, setOpenIndex] = React.useState<number | null>(0)

  const items = [
    {
      title: 'What is a cubic-bezier curve?',
      content:
        'A cubic-bezier curve is a mathematical function that defines the acceleration pattern of an animation over time. It uses four control points to create smooth, natural-looking transitions.',
    },
    {
      title: 'How do I use custom easing?',
      content:
        'You can drag the control points in the canvas to create your own custom easing curve, or select from preset options that follow Material Design 3 guidelines.',
    },
    {
      title: 'What is the best duration?',
      content:
        'The ideal duration depends on the element size and complexity. Short durations (100-200ms) work well for small elements, while larger components benefit from longer durations (300-500ms).',
    },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Accordion</h4>
        <p className="text-base text-zinc-400">
          Click to expand/collapse sections
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            title={item.title}
            content={item.content}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            duration={currentDurationMS}
            easing={currentEasingCSS}
          />
        ))}
      </div>
    </div>
  )
}

interface AccordionItemProps {
  title: string
  content: string
  isOpen: boolean
  onToggle: () => void
  duration: number
  easing: string
}

function AccordionItem({ title, content, isOpen, onToggle, duration, easing }: AccordionItemProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)

  React.useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-zinc-50 px-4 py-3 text-left hover:bg-zinc-100"
        style={{
          transition: `background-color ${duration}ms ${easing}`,
        }}
      >
        <span className="font-medium text-zinc-950">{title}</span>
        <svg
          className="h-5 w-5 text-zinc-500"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${duration}ms ${easing}`,
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        style={{
          height: `${height}px`,
          transition: `height ${duration}ms ${easing}`,
          overflow: 'hidden',
        }}
      >
        <div ref={contentRef} className="px-4 py-3 text-sm text-zinc-600">
          {content}
        </div>
      </div>
    </div>
  )
}

function NotificationsPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [notifications, setNotifications] = React.useState<Array<{ id: number; text: string }>>([])
  const nextId = React.useRef(0)

  const addNotification = () => {
    const id = nextId.current++
    setNotifications((prev) => [...prev, { id, text: `Notification ${id + 1}` }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3000)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Notifications</h4>
        <p className="text-base text-zinc-400">
          Click to trigger notification animations
        </p>
      </div>

      <Button
        onClick={addNotification}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Show Notification
      </Button>

      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-lg bg-[var(--motion-brand-primary)] px-4 py-3 text-white shadow-lg"
            style={{
              animation: `slideInUp ${currentDurationMS}ms ${currentEasingCSS}, fadeOut 300ms ease-out 2700ms forwards`,
            }}
          >
            {notification.text}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

function LoadingStatesPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [isLoading, setIsLoading] = React.useState(false)

  const startLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Loading States</h4>
        <p className="text-base text-zinc-400">
          Click to see loading animation
        </p>
      </div>

      <Button
        onClick={startLoading}
        disabled={isLoading}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        {isLoading ? 'Loading...' : 'Start Loading'}
      </Button>

      {isLoading && (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[var(--motion-brand-primary)]"
            style={{
              animation: `spin ${currentDurationMS * 3}ms linear infinite`,
            }}
          />
          <span className="text-sm text-zinc-600">Processing...</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

function PageTransitionPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [currentPage, setCurrentPage] = React.useState<'home' | 'about' | 'contact'>('home')
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const changePage = (page: 'home' | 'about' | 'contact') => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsTransitioning(false)
    }, currentDurationMS)
  }

  const pages = {
    home: { title: 'Home', content: 'Welcome to the home page' },
    about: { title: 'About', content: 'Learn more about us' },
    contact: { title: 'Contact', content: 'Get in touch' },
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-zinc-950">Page Transition</h4>
        <p className="text-base text-zinc-400">
          Click tabs to see page transitions
        </p>
      </div>

      <div className="flex gap-2">
        {(['home', 'about', 'contact'] as const).map((page) => (
          <button
            key={page}
            onClick={() => changePage(page)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-[var(--motion-brand-primary)] text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            )}
          >
            {pages[page].title}
          </button>
        ))}
      </div>

      <div
        className="min-h-[120px] rounded-lg bg-zinc-50 p-6"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
        }}
      >
        <h5 className="mb-2 text-lg font-semibold text-zinc-950">{pages[currentPage].title}</h5>
        <p className="text-zinc-600">{pages[currentPage].content}</p>
      </div>
    </div>
  )
}
