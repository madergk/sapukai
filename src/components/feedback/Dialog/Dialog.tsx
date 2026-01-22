import * as React from 'react'
import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle as HeadlessDialogTitle,
  Description as HeadlessDialogDescription,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import { Slot } from '@radix-ui/react-slot'
import { XMarkIcon } from '@heroicons/react/16/solid'
import { cn } from '@/utils'

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within <Dialog>.')
  }
  return context
}

interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const Dialog = ({ open, defaultOpen = false, onOpenChange, children }: DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open: isOpen, setOpen }}>{children}</DialogContext.Provider>
  )
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild = false, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext()
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            setOpen(true)
          }
        }}
        {...props}
      />
    )
  }
)
DialogTrigger.displayName = 'DialogTrigger'

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild = false, onClick, ...props }, ref) => {
    const { setOpen } = useDialogContext()
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented) {
            setOpen(false)
          }
        }}
        {...props}
      />
    )
  }
)
DialogClose.displayName = 'DialogClose'

const DialogOverlay = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogBackdrop>
>(({ className, ...props }, ref) => (
  <DialogBackdrop
    ref={ref}
    className={cn('fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity', className)}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useDialogContext()

    return (
      <Transition appear show={open} as={React.Fragment}>
        <HeadlessDialog onClose={setOpen} className="relative z-50">
          <TransitionChild
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogOverlay />
          </TransitionChild>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                ref={ref}
                className={cn(
                  'relative w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-lg',
                  'dark:border-zinc-700 dark:bg-zinc-900',
                  className
                )}
                {...props}
              >
                {children}
                <DialogClose className="absolute right-4 top-4 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300">
                  <XMarkIcon className="size-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogPanel>
            </TransitionChild>
          </div>
        </HeadlessDialog>
      </Transition>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof HeadlessDialogTitle>
>(({ className, ...props }, ref) => (
  <HeadlessDialogTitle
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof HeadlessDialogDescription>
>(({ className, ...props }, ref) => (
  <HeadlessDialogDescription
    ref={ref}
    className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export {
  Dialog,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
