# AGENTS.md - AI Agent Instructions for Sapukai Design System

This file provides instructions for AI coding agents (GitHub Copilot, Cursor, Claude, etc.) working on the Sapukai design system codebase.

## Project Overview

**Sapukai** is a modern React component library and design system built with:
- React 19.2.0 + TypeScript 5.9
- Tailwind CSS 4.1 with CSS custom properties
- Radix UI primitives for accessibility
- Storybook 10 for documentation
- Automated Figma token synchronization
- Motion Tuner for custom animation curves

## Quick Reference Commands

```bash
# Development
npm run dev              # Start Vite dev server (localhost:5173)
npm run storybook        # Start Storybook (localhost:6006)

# Quality checks (run before committing)
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Format with Prettier
npm run typecheck        # TypeScript type checking
npm run test             # Run Vitest tests

# Full validation pipeline
npm run validate         # validate-tokens + validate-components + typecheck
npm run validate:strict  # validate + lint
npm run ci               # validate + test + build

# Token management
npm run sync-tokens      # Full Figma sync pipeline
npm run validate-tokens  # Validate token schema
```

## Critical Rules for Agents

### 1. Always Use Design Tokens

**NEVER** hardcode colors, spacing, or typography values. Always use tokens.

```tsx
// BAD - Hardcoded values
<div style={{ color: '#00686f', padding: '16px' }}>

// GOOD - Use CSS variables
<div className="text-primary-main p-4">

// GOOD - Use token imports
import { semanticColors } from '@/tokens';
```

### 2. Component Structure

Components follow this organization:
```
src/components/
├── primitives/    # Avatar, Badge, Button, Divider, Heading, Text
├── forms/         # Input, Select, Checkbox, Radio, Switch, TextArea, Listbox
├── data/          # Table, DescriptionList
├── feedback/      # Dialog
├── navigation/    # Navbar, Sidebar, Dropdown, Pagination
├── motion-primitives/  # Animation components
└── MotionTuner/   # Motion editor tool
```

### 3. Component File Pattern

Each component follows this structure:
```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.stories.tsx  # Storybook stories
└── index.ts                # Public exports
```

### 4. Styling Approach

- Use **Tailwind CSS classes** as primary styling method
- Use **CSS custom properties** from `src/tokens/theme.css`
- Use **`cn()` utility** from `src/utils/cn.ts` for conditional classes
- Use **class-variance-authority (CVA)** for component variants

```tsx
import { cn } from '@/utils/cn';
import { cva } from 'class-variance-authority';

const buttonVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      primary: 'bg-primary-main text-white',
      secondary: 'bg-zinc-100 text-zinc-900',
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### 5. Accessibility Requirements

- All interactive components must use **Radix UI primitives**
- Include proper **ARIA attributes**
- Ensure **keyboard navigation** works
- Test with screen readers when possible

### 6. TypeScript Patterns

- **Strict mode** is enabled - avoid `any` types
- Export component props interfaces
- Use proper React types

```tsx
import { type ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ variant, size, isLoading, ...props }: ButtonProps) {
  // ...
}
```

## Token System

### Token Locations

| Location | Purpose |
|----------|---------|
| `tokens/figma-tokens.json` | Raw tokens from Figma |
| `tokens/tokens.json` | Processed tokens |
| `src/tokens/colors.ts` | Color token definitions |
| `src/tokens/typography.ts` | Typography tokens |
| `src/tokens/spacing.ts` | Spacing scale |
| `src/tokens/shadows.ts` | Shadow definitions |
| `src/tokens/motion.ts` | Animation tokens |
| `src/tokens/theme.css` | CSS custom properties |
| `src/tokens/motion-theme.css` | Motion CSS variables |

### Token Naming Convention

```css
/* Primitive tokens (base values) */
--color-zinc-900: #18181b;
--color-primary-500: #00686f;

/* Semantic tokens (contextual meaning) */
--content-primary: var(--color-zinc-900);
--background-primary: var(--color-white);

/* Component tokens (component-specific) */
--button-primary-bg: var(--color-primary-500);
```

### Color Palette

- **Primary**: Teal (#00686f)
- **Neutrals**: Zinc scale (50-950)
- **Semantic**: error, warning, success, info

### Spacing Scale

4px grid system: `4, 8, 12, 16, 24, 32, 40, 48, 56, 64px`

Use Tailwind classes: `p-1` (4px), `p-2` (8px), `p-4` (16px), etc.

## Testing Requirements

### Before Submitting Changes

1. **Run linting**: `npm run lint`
2. **Run type check**: `npm run typecheck`
3. **Run tests**: `npm run test`
4. **Validate tokens**: `npm run validate-tokens` (if tokens changed)

### Test Files Location

Tests are in `scripts/__tests__/`:
- `validate-tokens.test.ts`
- `generate-report.test.ts`
- `rollback-tokens.test.ts`

## Git Workflow

### Pre-commit Hooks

Husky + lint-staged automatically runs on commit:
- Token validation (for `tokens/*.json`)
- ESLint fix (for `*.ts`, `*.tsx`)
- Prettier format (for all supported files)

### Commit Message Format

Use descriptive commit messages:
```
feat(Button): add loading state variant
fix(tokens): correct primary color value
docs(Storybook): update Button documentation
refactor(Input): extract shared styles
```

### Branch Naming

- Feature: `feature/component-name`
- Fix: `fix/issue-description`
- Refactor: `refactor/scope`

## Common Tasks

### Adding a New Component

1. Create folder: `src/components/{category}/ComponentName/`
2. Create files:
   - `ComponentName.tsx` - Component implementation
   - `ComponentName.stories.tsx` - Storybook stories
   - `index.ts` - Export file
3. Add export to `src/components/{category}/index.ts`
4. Add export to `src/components/index.ts`
5. Use Radix UI primitives for accessibility
6. Apply design tokens for styling

### Modifying Tokens

1. Update tokens in Figma (preferred) OR edit `tokens/tokens.json`
2. Run `npm run sync-tokens` (or `npm run build-tokens` for local changes)
3. Run `npm run validate-tokens` to verify
4. Run `npm run validate-components` to check for breaking changes
5. Update affected components if needed

### Adding Storybook Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};
```

## CI/CD Pipeline

GitHub Actions runs on push/PR to `main` and `develop`:

1. **Lint & Format** - ESLint + Prettier check
2. **TypeScript Check** - Type validation
3. **Validate Tokens** - Token schema validation
4. **Unit Tests** - Vitest test suite
5. **Build** - Production build
6. **Build Storybook** - Documentation build

## File Patterns to Know

### Important Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript configuration |
| `eslint.config.js` | ESLint rules (flat config) |
| `.prettierrc` | Prettier formatting rules |
| `style-dictionary.config.ts` | Token transformation |
| `.storybook/main.ts` | Storybook configuration |

### Import Aliases

The project uses path aliases:
- `@/` → `src/`
- `@/components` → `src/components`
- `@/tokens` → `src/tokens`
- `@/utils` → `src/utils`

## Troubleshooting

### Common Issues

**Token validation fails**
```bash
npm run validate-tokens -- --verbose
npm run rollback-tokens  # Restore backup if needed
```

**TypeScript errors after token sync**
```bash
npm run typecheck
# Check src/tokens/*.ts for issues
```

**Component breaking after token update**
```bash
npm run validate-components
# Review the report for affected components
```

**Storybook build fails**
```bash
npm run build-storybook -- --debug
# Check for missing imports or syntax errors
```

## Dependencies Overview

### Core UI
- `@radix-ui/*` - Accessible primitives
- `@headlessui/react` - Additional UI components
- `class-variance-authority` - Variant management
- `clsx` + `tailwind-merge` - Class utilities

### Icons
- `@heroicons/react` - Heroicons
- `lucide-react` - Lucide icons

### Animation
- `motion` - Animation library (Framer Motion fork)

### Development
- `storybook` - Component documentation
- `vitest` - Testing framework
- `style-dictionary` - Token transformation

## Design System Principles

1. **Token-first**: All visual properties come from design tokens
2. **Accessibility-first**: Use Radix UI primitives, ARIA attributes
3. **Composition over inheritance**: Small, composable components
4. **Type-safe**: Full TypeScript coverage, strict mode
5. **Documented**: Storybook stories for all components
6. **Tested**: Unit tests for critical paths

## Contact & Resources

- **Repository**: https://github.com/madergk/sapukai
- **CLAUDE.md**: Detailed developer guide in project root
- **README.md**: Project overview and setup
- **MOTION_TUNER_README.md**: Motion Tuner documentation
- **Storybook**: Interactive component documentation

---

*Last updated: January 2026*
