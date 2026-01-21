# Sapukai - Catalyst UI Design System

A React component library built with TypeScript, Tailwind CSS v4, and Storybook, featuring automated design token synchronization from Figma.

## Features

- React 19 + TypeScript
- Tailwind CSS v4 with `@theme` directive
- Storybook 10 for component documentation
- Radix UI primitives for accessibility
- Automated design token sync from Figma

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Figma account with access to the design file

### Installation

```bash
npm install
```

### Development

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook
```

## Design Token Synchronization

This project includes an automated system to sync design tokens from Figma Variables.

### Setup

1. **Create a `.env` file** (copy from `.env.example`):

```bash
cp .env.example .env
```

2. **Get your Figma Personal Access Token**:
   - Go to Figma Settings > Account > Personal Access Tokens
   - Generate a new token with read access
   - Add it to your `.env` file

3. **Get your Figma File Key**:
   - Open your Figma file
   - Copy the key from the URL: `figma.com/design/{FILE_KEY}/...`
   - Add it to your `.env` file

### Syncing Tokens

Run the sync command whenever design tokens are updated in Figma:

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
# Preview changes without applying them
npm run sync-tokens -- --dry-run

# Skip version bump
npm run sync-tokens -- --no-version

# Force sync even if no changes detected
npm run sync-tokens -- --force

# Skip component validation
npm run sync-tokens -- --skip-validation

# Show help
npm run sync-tokens -- --help
```

### Individual Scripts

You can also run individual parts of the sync process:

```bash
# Fetch tokens from Figma only
npm run sync-figma

# Transform tokens with Style Dictionary
npm run build-tokens

# Validate components
npm run validate-components

# Update documentation
npm run update-docs

# Bump version
npm run bump-version
```

### Token Structure

Tokens are organized in a three-tier architecture:

```
tokens/
├── figma-tokens.json       # Source of truth from Figma

src/tokens/
├── colors.ts               # Color tokens (primitive + semantic)
├── typography.ts           # Typography tokens
├── spacing.ts              # Spacing and border radius
├── shadows.ts              # Shadow tokens
├── theme.css               # CSS variables for Tailwind v4
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
/* CSS variables are auto-generated */
.my-element {
  color: var(--content-primary);
  background: var(--background-primary);
}
```

#### With Tailwind Classes

```tsx
// Tailwind classes work with the theme
<div className="bg-zinc-100 text-zinc-900">
  Content
</div>
```

## Project Structure

```
sapukai/
├── .storybook/           # Storybook configuration
├── scripts/              # Token sync scripts
│   ├── sync-tokens.ts    # Main orchestrator
│   ├── sync-figma-tokens.ts
│   ├── validate-components.ts
│   ├── update-docs.ts
│   └── bump-version.ts
├── src/
│   ├── components/       # UI components
│   │   ├── primitives/   # Basic components
│   │   ├── forms/        # Form components
│   │   ├── data/         # Data display
│   │   ├── feedback/     # Feedback components
│   │   └── navigation/   # Navigation components
│   ├── docs/             # Storybook MDX docs
│   ├── tokens/           # Design tokens
│   └── utils/            # Utility functions
├── tokens/               # Raw Figma tokens
├── style-dictionary.config.ts
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build Storybook |
| `npm run lint` | Run ESLint |
| `npm run sync-tokens` | Sync tokens from Figma |

## Requirements

### Figma API Access

The Figma Variables API requires:
- A Figma account
- Access to the design file
- Personal Access Token with read permissions

**Note**: The Variables REST API requires a Figma Enterprise plan. If you don't have Enterprise access, you can:
1. Export tokens manually from Figma using Tokens Studio plugin
2. Create `tokens/figma-tokens.json` manually following the expected format

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check for issues
4. Submit a pull request

## License

Private - All rights reserved
