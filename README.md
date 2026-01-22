# Sapukai - Catalyst UI Design System

A modern React component library built with TypeScript, Tailwind CSS v4, and Storybook, featuring automated design token synchronization from Figma and a powerful Motion Tuner tool for creating custom animations.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)
![Storybook](https://img.shields.io/badge/Storybook-10.1-FF4785?style=flat-square&logo=storybook)

## Features

- **React 19** + TypeScript for type-safe components
- **Tailwind CSS v4** with `@theme` directive for design tokens
- **Storybook 10** for interactive component documentation
- **Radix UI** primitives for accessibility-first components
- **Automated Figma sync** for design token updates
- **Motion Tuner** - Interactive cubic bezier animation tool

---

## Component Library

### Primitives
| Component | Description |
|-----------|-------------|
| `Avatar` | User profile images with fallback initials |
| `Badge` | Status indicators and labels |
| `Button` | Primary, secondary, and outline variants |
| `Divider` | Visual separators |
| `Heading` | Typography headings (h1-h6) |
| `Text` | Body text with size variants |

### Forms
| Component | Description |
|-----------|-------------|
| `Checkbox` | Binary selection with Radix UI |
| `Input` | Text input fields |
| `Listbox` | List selection component |
| `Radio` | Single-choice selection groups |
| `Select` | Dropdown selection with Radix UI |
| `Switch` | Toggle switches |
| `TextArea` | Multi-line text input |

### Data Display
| Component | Description |
|-----------|-------------|
| `DescriptionList` | Key-value pair displays |
| `Table` | Data tables with sorting support |

### Feedback
| Component | Description |
|-----------|-------------|
| `Dialog` | Modal dialogs with Radix UI |

### Navigation
| Component | Description |
|-----------|-------------|
| `Dropdown` | Dropdown menus |
| `Navbar` | Top navigation bar |
| `Pagination` | Page navigation controls |
| `Sidebar` | Side navigation panel |

---

## Motion Tuner

An interactive tool for creating, visualizing, and exporting custom cubic bezier easing curves.

### Features

- **Interactive Bezier Canvas** - Drag control points with visual feedback
- **13 Preset Easings** - Material Design 3, CSS defaults, exponential
- **Duration Tokens** - 16 presets from 50ms to 1000ms
- **Live Preview Panel** - See animations in real-time
- **5 Export Formats** - CSS, JSON, GSAP, Design Tokens, M3 Tokens
- **State Persistence** - Settings saved to localStorage

### Preview Components

Test your animations with built-in demos:
- Modal Dialog (open/close)
- Button States (hover/focus)
- Accordion (expand/collapse)
- Notifications (slide-in)
- Loading States (spinner)
- Page Transitions (fade/slide)

### Motion Tokens

```css
/* Easing */
var(--motion-easing-emphasized)
var(--motion-easing-standard)
var(--motion-easing-linear)

/* Duration */
var(--motion-duration-short-1)    /* 50ms */
var(--motion-duration-medium-2)   /* 300ms */
var(--motion-duration-long-3)     /* 500ms */
```

For detailed documentation, see [MOTION_TUNER_README.md](./MOTION_TUNER_README.md).

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Figma account (for token sync)

### Installation

```bash
git clone https://github.com/madergk/sapukai.git
cd sapukai
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook
```

---

## Design Token Synchronization

Automated system to sync design tokens from Figma Variables.

### Setup

1. **Create environment file**:
```bash
cp .env.example .env
```

2. **Get Figma Personal Access Token**:
   - Go to Figma Settings → Account → Personal Access Tokens
   - Generate a new token with read access
   - Add to `.env` file

3. **Get Figma File Key**:
   - Open your Figma file
   - Copy key from URL: `figma.com/design/{FILE_KEY}/...`
   - Add to `.env` file

### Syncing Tokens

```bash
npm run sync-tokens
```

This will:
1. Fetch latest variables from Figma API
2. Transform tokens to TypeScript and CSS
3. Validate components for breaking changes
4. Update Storybook documentation
5. Bump the package version
6. Create a git commit and tag

### Sync Options

```bash
npm run sync-tokens -- --dry-run       # Preview changes
npm run sync-tokens -- --no-version    # Skip version bump
npm run sync-tokens -- --force         # Force sync
npm run sync-tokens -- --skip-validation
```

### Individual Scripts

```bash
npm run sync-figma          # Fetch tokens from Figma
npm run build-tokens        # Transform with Style Dictionary
npm run validate-components # Validate components
npm run update-docs         # Update documentation
npm run bump-version        # Bump version
```

---

## Token Structure

```
tokens/
├── figma-tokens.json       # Source from Figma

src/tokens/
├── colors.ts               # Color tokens (primitive + semantic)
├── typography.ts           # Typography tokens
├── spacing.ts              # Spacing and border radius
├── shadows.ts              # Shadow tokens
├── motion.ts               # Motion/animation tokens
├── theme.css               # CSS variables for Tailwind v4
├── motion-theme.css        # Motion CSS variables
└── index.ts                # Barrel export
```

### Using Tokens

#### In TypeScript/React

```tsx
import { primitiveColors, semanticColors } from '@/tokens'

const Component = () => (
  <div style={{ color: primitiveColors.zinc[900] }}>
    Content
  </div>
)
```

#### In CSS/Tailwind

```css
.my-element {
  color: var(--content-primary);
  background: var(--background-primary);
}
```

#### With Tailwind Classes

```tsx
<div className="bg-zinc-100 text-zinc-900">
  Content
</div>
```

---

## Project Structure

```
sapukai/
├── .storybook/              # Storybook configuration
├── scripts/                 # Token sync scripts
│   ├── sync-tokens.ts       # Main orchestrator
│   ├── sync-figma-tokens.ts
│   ├── validate-components.ts
│   ├── update-docs.ts
│   └── bump-version.ts
├── src/
│   ├── components/
│   │   ├── primitives/      # Avatar, Badge, Button, etc.
│   │   ├── forms/           # Input, Select, Checkbox, etc.
│   │   ├── data/            # Table, DescriptionList
│   │   ├── feedback/        # Dialog
│   │   ├── navigation/      # Navbar, Sidebar, etc.
│   │   └── MotionTuner/     # Motion tool components
│   ├── context/             # React context providers
│   ├── docs/                # Storybook MDX documentation
│   ├── layouts/             # Page layouts
│   ├── pages/               # Page components
│   ├── tokens/              # Design tokens
│   └── utils/               # Utility functions
├── tokens/                  # Raw Figma tokens
└── package.json
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |
| `npm run lint` | Run ESLint |
| `npm run sync-tokens` | Sync tokens from Figma |
| `npm run preview` | Preview production build |

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19.2.0 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4.1 |
| Components | Radix UI |
| Icons | Heroicons |
| Build | Vite 7.2 |
| Documentation | Storybook 10.1 |
| Token Transform | Style Dictionary 4.4 |
| Testing | Vitest + Playwright |

---

## Design System

### Colors

- **Primary**: Teal (`#00686f`)
- **Neutrals**: Zinc scale
- **Semantic**: Error, Warning, Success, Info

### Typography

- **Headings**: Nunito (600 weight)
- **Body**: Nunito (400 weight)
- **Code**: Menlo / Martian Mono

### Spacing

Based on 4px grid: `4, 8, 12, 16, 24, 32, 40, 48, 56, 64px`

### Border Radius

- **sm**: 4px
- **md**: 8px
- **lg**: 12px
- **xl**: 24px
- **rounded**: 9999px (pill)

---

## Requirements

### Figma API Access

The Figma Variables API requires:
- A Figma account
- Access to the design file
- Personal Access Token with read permissions

**Note**: Variables REST API requires Figma Enterprise. Without Enterprise:
1. Export tokens manually using Tokens Studio plugin
2. Create `tokens/figma-tokens.json` manually

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check for issues
4. Submit a pull request

---

## License

Private - All rights reserved

---

## Links

- [Storybook Documentation](https://your-storybook-url.com)
- [Figma Design File](https://www.figma.com/design/...)
- [Motion Tuner Documentation](./MOTION_TUNER_README.md)
