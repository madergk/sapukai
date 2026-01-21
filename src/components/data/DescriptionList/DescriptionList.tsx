import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const descriptionListVariants = cva('', {
  variants: {
    layout: {
      horizontal: 'grid sm:grid-cols-2 gap-4',
      vertical: 'space-y-4',
    },
  },
  defaultVariants: {
    layout: 'horizontal',
  },
})

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDListElement>,
    VariantProps<typeof descriptionListVariants> {}

const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(
  ({ className, layout, ...props }, ref) => (
    <dl
      ref={ref}
      className={cn(descriptionListVariants({ layout }), className)}
      {...props}
    />
  )
)
DescriptionList.displayName = 'DescriptionList'

const DescriptionListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('py-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0', className)}
    {...props}
  />
))
DescriptionListItem.displayName = 'DescriptionListItem'

const DescriptionListTerm = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dt
    ref={ref}
    className={cn('text-sm font-medium text-zinc-500 dark:text-zinc-400', className)}
    {...props}
  />
))
DescriptionListTerm.displayName = 'DescriptionListTerm'

const DescriptionListDetails = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <dd
    ref={ref}
    className={cn('mt-1 text-sm text-zinc-900 dark:text-white', className)}
    {...props}
  />
))
DescriptionListDetails.displayName = 'DescriptionListDetails'

export {
  DescriptionList,
  DescriptionListItem,
  DescriptionListTerm,
  DescriptionListDetails,
}
