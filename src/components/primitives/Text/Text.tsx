import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'

const textVariants = cva(
  'text-zinc-600 dark:text-zinc-400',
  {
    variants: {
      variant: {
        text: '',
        code: [
          'font-mono text-sm',
          'bg-zinc-100 dark:bg-zinc-800',
          'px-1.5 py-0.5 rounded',
        ],
      },
      size: {
        xs: 'text-xs leading-4',
        sm: 'text-sm leading-5',
        base: 'text-base leading-6',
        lg: 'text-lg leading-7',
      },
      underline: {
        true: 'underline underline-offset-2',
        false: '',
      },
      strong: {
        true: 'font-semibold text-zinc-900 dark:text-white',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'text',
      size: 'base',
      underline: false,
      strong: false,
    },
  }
)

export interface TextProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  as?: 'span' | 'p' | 'code' | 'strong' | 'em'
}

function Text({
  className,
  variant,
  size,
  underline,
  strong,
  as: Tag = 'span',
  ...props
}: TextProps) {
  const Comp = variant === 'code' ? 'code' : Tag

  return (
    <Comp
      className={cn(textVariants({ variant, size, underline, strong }), className)}
      {...props}
    />
  )
}

export { Text, textVariants }
