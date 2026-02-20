import * as React from 'react'
import { useMotion, type PreviewComponent } from '@/context/MotionContext'
import { Button } from '@/components/primitives/Button'
import { cn } from '@/utils'

interface ComponentPreviewProps {
  component: PreviewComponent
}

export function ComponentPreview({ component }: ComponentPreviewProps) {
  switch (component) {
    // Components
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
    // Navigation
    case 'drawer':
      return <DrawerPreview />
    case 'bottom-nav':
      return <BottomNavPreview />
    case 'tabs':
      return <TabsPreview />
    case 'menu':
      return <MenuPreview />
    // Transitions
    case 'fade-through':
      return <FadeThroughPreview />
    case 'shared-axis':
      return <SharedAxisPreview />
    case 'scale-transform':
      return <ScaleTransformPreview />
    case 'slide-transition':
      return <SlideTransitionPreview />
    default:
      return <div className="text-[var(--motion-text-muted)]">Preview not available</div>
  }
}

function ModalDialogPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  const openModal = () => {
    setIsOpen(true)
    // Small delay to trigger animation after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })
  }

  const closeModal = () => {
    setIsAnimating(false)
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setIsOpen(false)
    }, currentDurationMS)
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">
          Modal Dialog Animation
        </h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click to open/close modal with custom easing
        </p>
        <div className="rounded-lg bg-[var(--motion-surface-tertiary)] p-3">
          <p className="text-xs text-[var(--motion-text-secondary)]">
            <strong>Current:</strong> {currentDurationMS}ms {currentEasingCSS}
          </p>
        </div>
      </div>

      <Button
        onClick={openModal}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Open Modal
      </Button>

      {/* Custom Modal without Radix animations */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[var(--motion-surface-overlay)]"
            style={{
              opacity: isAnimating ? 1 : 0,
              transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}`,
            }}
            onClick={closeModal}
          />
          {/* Content */}
          <div
            className="absolute left-1/2 top-1/2 w-full max-w-md rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6 shadow-xl"
            style={{
              transform: isAnimating
                ? 'translate(-50%, -50%) scale(1)'
                : 'translate(-50%, -50%) scale(0.95)',
              opacity: isAnimating ? 1 : 0,
              transition: `transform ${currentDurationMS}ms ${currentEasingCSS}, opacity ${currentDurationMS}ms ${currentEasingCSS}`,
            }}
          >
            <h2 className="mb-4 text-xl font-semibold text-[var(--motion-text-primary)]">
              Modal Dialog
            </h2>
            <p className="mb-6 text-[var(--motion-text-secondary)]">
              This modal animates with your custom cubic-bezier curve. Notice how the entrance and
              exit animations follow the easing you've defined.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
                onClick={closeModal}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ButtonStatesPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Button States</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Hover over buttons to see the transition
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full bg-[var(--motion-brand-primary)] px-6 py-2 text-[var(--motion-text-inverse)] hover:bg-[var(--motion-brand-primary-hover)] hover:scale-[1.05]"
          style={{
            transition: `background-color ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          Primary Button
        </button>

        <button
          className="rounded-full border-2 border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] px-6 py-2 text-[var(--motion-text-primary)] hover:border-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-soft)]"
          style={{
            transition: `all ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          Secondary Button
        </button>

        <button
          className="rounded-full bg-[var(--motion-surface-tertiary)] px-6 py-2 text-[var(--motion-text-primary)] hover:bg-[var(--motion-border-default)]"
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
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Accordion</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
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
    <div className="rounded-lg border border-[var(--motion-border-default)] overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-[var(--motion-surface-tertiary)] px-4 py-3 text-left hover:bg-[var(--motion-border-default)]"
        style={{
          transition: `background-color ${duration}ms ${easing}`,
        }}
      >
        <span className="font-medium text-[var(--motion-text-primary)]">{title}</span>
        <svg
          className="h-5 w-5 text-[var(--motion-text-muted)]"
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
        <div ref={contentRef} className="px-4 py-3 text-sm text-[var(--motion-text-secondary)]">
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
    setNotifications(prev => [...prev, { id, text: `Notification ${id + 1}` }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Notifications</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
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
        {notifications.map(notification => (
          <div
            key={notification.id}
            className="rounded-lg bg-[var(--motion-brand-primary)] px-4 py-3 text-[var(--motion-text-inverse)] shadow-lg"
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
  const { currentDurationMS } = useMotion()
  const [isLoading, setIsLoading] = React.useState(false)

  const startLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Loading States</h4>
        <p className="text-base text-[var(--motion-text-muted)]">Click to see loading animation</p>
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
            className="h-8 w-8 rounded-full border-4 border-[var(--motion-border-default)] border-t-[var(--motion-brand-primary)]"
            style={{
              animation: `spin ${currentDurationMS * 3}ms linear infinite`,
            }}
          />
          <span className="text-sm text-[var(--motion-text-secondary)]">Processing...</span>
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
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Page Transition</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click tabs to see page transitions
        </p>
      </div>

      <div className="flex gap-2">
        {(['home', 'about', 'contact'] as const).map(page => (
          <button
            key={page}
            onClick={() => changePage(page)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              currentPage === page
                ? 'bg-[var(--motion-brand-primary)] text-[var(--motion-text-inverse)]'
                : 'bg-[var(--motion-surface-tertiary)] text-[var(--motion-text-secondary)] hover:bg-[var(--motion-border-default)]'
            )}
          >
            {pages[page].title}
          </button>
        ))}
      </div>

      <div
        className="min-h-[120px] rounded-lg bg-[var(--motion-surface-tertiary)] p-6"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
          transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
        }}
      >
        <h5 className="mb-2 text-lg font-semibold text-[var(--motion-text-primary)]">
          {pages[currentPage].title}
        </h5>
        <p className="text-[var(--motion-text-secondary)]">{pages[currentPage].content}</p>
      </div>
    </div>
  )
}

// ============ NAVIGATION PREVIEWS ============

function DrawerPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex w-full flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">
          Navigation Drawer
        </h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click to open/close navigation drawer
        </p>
      </div>

      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Open Drawer
      </Button>

      {/* Drawer Container */}
      <div className="relative h-[300px] overflow-hidden rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-tertiary)]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[var(--motion-surface-overlay)]"
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className="absolute left-0 top-0 h-full w-64 bg-[var(--motion-surface-primary)] shadow-xl"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: `transform ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          <div className="flex h-14 items-center border-b border-[var(--motion-border-default)] px-4">
            <span className="font-semibold text-[var(--motion-text-primary)]">Menu</span>
          </div>
          <nav className="flex flex-col py-2">
            {['Dashboard', 'Projects', 'Tasks', 'Reports', 'Settings'].map(item => (
              <button
                key={item}
                className="px-4 py-3 text-left text-sm text-[var(--motion-text-secondary)] hover:bg-[var(--motion-surface-tertiary)]"
                style={{
                  transition: `background-color ${currentDurationMS / 2}ms ${currentEasingCSS}`,
                }}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex h-full items-center justify-center pl-0">
          <p className="text-sm text-[var(--motion-text-muted)]">Main Content Area</p>
        </div>
      </div>
    </div>
  )
}

function BottomNavPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [activeTab, setActiveTab] = React.useState(0)

  const tabs = [
    { icon: '🏠', label: 'Home' },
    { icon: '🔍', label: 'Search' },
    { icon: '➕', label: 'Create' },
    { icon: '💬', label: 'Messages' },
    { icon: '👤', label: 'Profile' },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">
          Bottom Navigation
        </h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Tap icons to see navigation transitions
        </p>
      </div>

      {/* Phone Frame */}
      <div className="mx-auto w-[320px] overflow-hidden rounded-[24px] border-4 border-[var(--motion-text-primary)] bg-[var(--motion-surface-tertiary)]">
        {/* Screen */}
        <div className="relative h-[400px]">
          {/* Content */}
          <div className="flex h-[340px] items-center justify-center">
            <div
              className="text-center"
              style={{
                opacity: 1,
                transform: 'scale(1)',
                transition: `all ${currentDurationMS}ms ${currentEasingCSS}`,
              }}
              key={activeTab}
            >
              <span className="text-4xl">{tabs[activeTab].icon}</span>
              <p className="mt-2 font-medium text-[var(--motion-text-primary)]">
                {tabs[activeTab].label}
              </p>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 flex h-[60px] items-center justify-around border-t border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)]">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(index)}
                className="relative flex flex-col items-center gap-1 px-3 py-2"
              >
                <span
                  className="text-xl"
                  style={{
                    transform: activeTab === index ? 'scale(1.2)' : 'scale(1)',
                    transition: `transform ${currentDurationMS}ms ${currentEasingCSS}`,
                  }}
                >
                  {tab.icon}
                </span>
                <span
                  className={cn(
                    'text-[10px]',
                    activeTab === index
                      ? 'text-[var(--motion-brand-primary)]'
                      : 'text-[var(--motion-text-muted)]'
                  )}
                  style={{
                    transition: `color ${currentDurationMS}ms ${currentEasingCSS}`,
                  }}
                >
                  {tab.label}
                </span>
                {/* Indicator */}
                <div
                  className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--motion-brand-primary)]"
                  style={{
                    transform: `translateX(-50%) scaleX(${activeTab === index ? 1 : 0})`,
                    transition: `transform ${currentDurationMS}ms ${currentEasingCSS}`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabsPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [activeTab, setActiveTab] = React.useState(0)
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })

  const tabs = ['Overview', 'Analytics', 'Reports', 'Notifications']

  React.useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab]
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      })
    }
  }, [activeTab])

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Animated Tabs</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click tabs to see sliding indicator animation
        </p>
      </div>

      {/* Tabs Container */}
      <div className="relative">
        <div className="flex border-b border-[var(--motion-border-default)]">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              ref={el => {
                tabRefs.current[index] = el
              }}
              onClick={() => setActiveTab(index)}
              className={cn(
                'relative px-4 py-3 text-sm font-medium',
                activeTab === index
                  ? 'text-[var(--motion-brand-primary)]'
                  : 'text-[var(--motion-text-muted)]'
              )}
              style={{
                transition: `color ${currentDurationMS}ms ${currentEasingCSS}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Sliding Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-[var(--motion-brand-primary)]"
          style={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
            transition: `left ${currentDurationMS}ms ${currentEasingCSS}, width ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        />
      </div>

      {/* Tab Content */}
      <div
        className="min-h-[100px] rounded-lg bg-[var(--motion-surface-tertiary)] p-4"
        style={{
          animation: `fadeSlideIn ${currentDurationMS}ms ${currentEasingCSS}`,
        }}
        key={activeTab}
      >
        <h5 className="font-medium text-[var(--motion-text-primary)]">{tabs[activeTab]}</h5>
        <p className="mt-2 text-sm text-[var(--motion-text-muted)]">
          Content for {tabs[activeTab]} tab
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}

function MenuPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [isOpen, setIsOpen] = React.useState(false)

  const menuItems = [
    { icon: '✏️', label: 'Edit' },
    { icon: '📋', label: 'Copy' },
    { icon: '🗑️', label: 'Delete', danger: true },
    { divider: true },
    { icon: '⚙️', label: 'Settings' },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Dropdown Menu</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click to open menu with staggered animation
        </p>
      </div>

      <div className="relative inline-block">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
        >
          Open Menu ▾
        </Button>

        {/* Menu Dropdown */}
        <div
          className="absolute left-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-lg border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] shadow-lg"
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.95)',
            transformOrigin: 'top left',
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          {menuItems.map((item, index) =>
            'divider' in item ? (
              <div key={index} className="my-1 h-px bg-[var(--motion-border-default)]" />
            ) : (
              <button
                key={item.label}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--motion-surface-tertiary)]',
                  'danger' in item && item.danger
                    ? 'text-red-500'
                    : 'text-[var(--motion-text-secondary)]'
                )}
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
                  transition: `opacity ${currentDurationMS}ms ${currentEasingCSS} ${index * 50}ms, transform ${currentDurationMS}ms ${currentEasingCSS} ${index * 50}ms`,
                }}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
    </div>
  )
}

// ============ TRANSITION PREVIEWS ============

function FadeThroughPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const cards = [
    { title: 'Card One', color: 'bg-blue-100 dark:bg-blue-900', icon: '🎨' },
    { title: 'Card Two', color: 'bg-green-100 dark:bg-green-900', icon: '🌿' },
    { title: 'Card Three', color: 'bg-purple-100 dark:bg-purple-900', icon: '✨' },
  ]

  const next = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % cards.length)
      setIsTransitioning(false)
    }, currentDurationMS / 2)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Fade Through</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          M3 transition: outgoing fades out while incoming fades in
        </p>
      </div>

      <div className="flex h-[200px] items-center justify-center rounded-lg bg-[var(--motion-surface-tertiary)]">
        <div
          className={cn(
            'flex h-32 w-48 flex-col items-center justify-center rounded-xl shadow-lg',
            cards[currentIndex].color
          )}
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.92)' : 'scale(1)',
            transition: `opacity ${currentDurationMS / 2}ms ${currentEasingCSS}, transform ${currentDurationMS / 2}ms ${currentEasingCSS}`,
          }}
        >
          <span className="text-3xl">{cards[currentIndex].icon}</span>
          <span className="mt-2 font-medium">{cards[currentIndex].title}</span>
        </div>
      </div>

      <Button
        onClick={next}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Next Card
      </Button>
    </div>
  )
}

function SharedAxisPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState<'forward' | 'back'>('forward')
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  const steps = [
    { title: 'Step 1: Welcome', description: 'Get started with your journey' },
    { title: 'Step 2: Setup', description: 'Configure your preferences' },
    { title: 'Step 3: Complete', description: "You're all set!" },
  ]

  const goTo = (newStep: number) => {
    if (newStep === step) return
    setDirection(newStep > step ? 'forward' : 'back')
    setIsTransitioning(true)
    setTimeout(() => {
      setStep(newStep)
      setIsTransitioning(false)
    }, currentDurationMS)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Shared Axis (X)</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          M3 transition: coordinated slide along horizontal axis
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={cn(
              'h-2 w-8 rounded-full transition-colors',
              step === index
                ? 'bg-[var(--motion-brand-primary)]'
                : 'bg-[var(--motion-border-default)]'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-[140px] overflow-hidden rounded-lg bg-[var(--motion-surface-tertiary)]">
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning
              ? `translateX(${direction === 'forward' ? '-30px' : '30px'})`
              : 'translateX(0)',
            transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          <h5 className="text-lg font-semibold text-[var(--motion-text-primary)]">
            {steps[step].title}
          </h5>
          <p className="mt-1 text-sm text-[var(--motion-text-muted)]">{steps[step].description}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
          Previous
        </Button>
        <Button
          onClick={() => goTo(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function ScaleTransformPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [expanded, setExpanded] = React.useState<number | null>(null)

  const items = [
    { id: 1, title: 'Project Alpha', color: 'bg-blue-500' },
    { id: 2, title: 'Project Beta', color: 'bg-green-500' },
    { id: 3, title: 'Project Gamma', color: 'bg-purple-500' },
  ]

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">Scale Transform</h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Click cards to see container transform animation
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            className={cn(
              'relative flex h-24 items-center justify-center rounded-lg text-white',
              item.color
            )}
            style={{
              transform: expanded === item.id ? 'scale(1.1)' : 'scale(1)',
              zIndex: expanded === item.id ? 10 : 1,
              transition: `transform ${currentDurationMS}ms ${currentEasingCSS}`,
            }}
          >
            <span className="font-medium">{item.title}</span>
          </button>
        ))}
      </div>

      {/* Expanded Detail View */}
      {expanded && (
        <div
          className="rounded-lg bg-[var(--motion-surface-tertiary)] p-4"
          style={{
            animation: `scaleIn ${currentDurationMS}ms ${currentEasingCSS}`,
          }}
        >
          <h5 className="font-medium text-[var(--motion-text-primary)]">
            {items.find(i => i.id === expanded)?.title} Details
          </h5>
          <p className="mt-2 text-sm text-[var(--motion-text-muted)]">
            Expanded view with more information about the selected project.
          </p>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

function SlideTransitionPreview() {
  const { currentEasingCSS, currentDurationMS } = useMotion()
  const [items, setItems] = React.useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ])
  const [removingId, setRemovingId] = React.useState<number | null>(null)
  const nextId = React.useRef(4)

  const addItem = () => {
    const newItem = { id: nextId.current++, text: `Item ${nextId.current - 1}` }
    setItems(prev => [...prev, newItem])
  }

  const removeItem = (id: number) => {
    setRemovingId(id)
    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id))
      setRemovingId(null)
    }, currentDurationMS)
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-[var(--motion-border-default)] bg-[var(--motion-surface-primary)] p-6">
      <div className="flex flex-col gap-4">
        <h4 className="text-base font-normal text-[var(--motion-text-primary)]">
          List Slide Transitions
        </h4>
        <p className="text-base text-[var(--motion-text-muted)]">
          Add/remove items to see slide animations
        </p>
      </div>

      <Button
        onClick={addItem}
        className="bg-[var(--motion-brand-primary)] hover:bg-[var(--motion-brand-primary-hover)]"
      >
        Add Item
      </Button>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-[var(--motion-surface-tertiary)] px-4 py-3"
            style={{
              opacity: removingId === item.id ? 0 : 1,
              transform: removingId === item.id ? 'translateX(20px)' : 'translateX(0)',
              transition: `opacity ${currentDurationMS}ms ${currentEasingCSS}, transform ${currentDurationMS}ms ${currentEasingCSS}`,
              animation:
                removingId !== item.id
                  ? `slideInFromRight ${currentDurationMS}ms ${currentEasingCSS}`
                  : undefined,
            }}
          >
            <span className="text-sm text-[var(--motion-text-secondary)]">{item.text}</span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-[var(--motion-text-muted)] hover:text-red-500"
              style={{
                transition: `color ${currentDurationMS / 2}ms ${currentEasingCSS}`,
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
