import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const headingVariants = cva('text-zinc-900 dark:text-zinc-50 tracking-tight', {
  variants: {
    type: {
      heading: 'text-4xl font-semibold leading-10',
      subheading: 'text-lg font-medium leading-7',
    },
    as: {
      h1: '',
      h2: '',
      h3: '',
      h4: '',
      h5: '',
      h6: '',
      p: '',
    },
  },
  defaultVariants: {
    type: 'heading',
    as: 'h1',
  },
})

type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'

export interface HeadingProps
  extends
    React.HTMLAttributes<HTMLHeadingElement>,
    Omit<VariantProps<typeof headingVariants>, 'as'> {
  as?: HeadingElement
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, type, as = 'h1', ...props }, ref) => {
    const Comp = as

    return (
      <Comp
        className={cn(headingVariants({ type }), className)}
        ref={ref as React.Ref<HTMLHeadingElement>}
        {...props}
      />
    )
  }
)
Heading.displayName = 'Heading'

export { Heading, headingVariants }
