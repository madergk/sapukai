import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const avatarVariants = cva(
  [
    'relative inline-flex items-center justify-center',
    'bg-zinc-200 text-zinc-600',
    'dark:bg-zinc-700 dark:text-zinc-300',
    'overflow-hidden',
    'shrink-0',
  ],
  {
    variants: {
      type: {
        circular: 'rounded-full',
        rounded: 'rounded-lg',
      },
      size: {
        4: 'size-5 text-[8px]',   // 20px
        6: 'size-6 text-[10px]',  // 24px
        8: 'size-8 text-xs',      // 32px
        10: 'size-10 text-sm',    // 40px
      },
    },
    defaultVariants: {
      type: 'circular',
      size: 8,
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  initials?: string
}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, type, size, src, alt, initials, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)

    const showInitials = !src || hasError

    return (
      <span
        className={cn(avatarVariants({ type, size }), className)}
        ref={ref}
        {...props}
      >
        {!showInitials && (
          <img
            src={src}
            alt={alt || ''}
            className="size-full object-cover"
            onError={() => setHasError(true)}
          />
        )}
        {showInitials && initials && (
          <span className="font-medium uppercase">{initials}</span>
        )}
        {showInitials && !initials && (
          <svg
            className="size-[60%] text-zinc-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </span>
    )
  }
)
Avatar.displayName = 'Avatar'

// Avatar Group component
const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex -space-x-2', className)}
    {...props}
  />
))
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarGroup, avatarVariants }
