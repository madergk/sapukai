# Sapukai Design System - Developer Guide

**Sapukai** is a modern React component library and design system with an integrated Motion Tuner tool for creating custom animation curves and an automated token synchronization system from Figma.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or pnpm
- Figma account (for token sync)

### Installation

```bash
git clone https://github.com/madergk/sapukai.git
cd sapukai
npm install
```

### Environment Setup

Create a `.env` file for Figma token synchronization:

```bash
cp .env.example .env
```

**Required environment variables:**
- `FIGMA_ACCESS_TOKEN`: Your Figma personal access token
- `FIGMA_FILE_KEY`: The Figma file key for token source

**Optional:**
- `SLACK_WEBHOOK_URL`: For Slack notifications on token sync
- `DISCORD_WEBHOOK_URL`: For Discord notifications on token sync

## Core Commands

### Development
```bash
npm run dev              # Start Vite dev server (localhost:5173)
npm run storybook       # Start Storybook (localhost:6006)
npm run preview         # Preview production build
```

### Building
```bash
npm run build           # Build for production
npm run build-storybook # Build Storybook static site
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting
npm run typecheck       # TypeScript type checking
```

### Testing
```bash
npm run test            # Run Vitest once
npm run test:watch      # Run Vitest in watch mode
npm run test:coverage   # Generate coverage report
npm run test:scripts    # Test utility scripts
```

## Token Management

### Full Token Synchronization

```bash
npm run sync-tokens          # Full automated sync pipeline
npm run sync-tokens -- --dry-run              # Preview without committing
npm run sync-tokens -- --no-version           # Skip version bump
npm run sync-tokens -- --force                # Force sync (ignore validation warnings)
npm run sync-tokens -- --skip-validation      # Skip component validation checks
```

**What the full sync does:**
1. Fetches tokens from Figma API
2. Transforms tokens using Style Dictionary
3. Converts Tokens Studio format
4. Validates token schema
5. Checks for breaking changes in components
6. Updates Storybook documentation
7. Bumps version number (if not skipped)
8. Creates automatic git commit
9. Sends notifications (if webhooks configured)

### Individual Token Steps

```bash
npm run sync-figma      # Fetch tokens from Figma API only
npm run build-tokens    # Transform tokens with Style Dictionary
npm run convert-tokens  # Convert Tokens Studio format
npm run validate-tokens # Validate token schema
npm run validate-components # Check for component breaking changes
npm run update-docs     # Auto-update Storybook documentation
npm run bump-version    # Increment version (semver)
npm run rollback-tokens # Restore tokens from backup
npm run generate-report # Generate sync report
npm run notify          # Send webhook notifications
```

## Project Structure

```
sapukai/
├── src/
│   ├── components/          # React components
│   │   ├── primitives/      # Avatar, Badge, Button, Divider, Heading, Text
│   │   ├── forms/           # Input, Select, Checkbox, Radio, Switch, TextArea
│   │   ├── data/            # Table, DescriptionList
│   │   ├── feedback/        # Dialog (modals)
│   │   ├── navigation/      # Navbar, Sidebar, Dropdown, Pagination
│   │   └── MotionTuner/     # Interactive animation curve editor
│   ├── pages/               # Page components (Home, MotionTuner, TokensVisualizer)
│   ├── layouts/             # Layout wrappers
│   ├── tokens/              # Generated design tokens
│   │   ├── colors.ts        # Color token definitions
│   │   ├── typography.ts    # Font and text tokens
│   │   ├── spacing.ts       # Spacing scale
│   │   ├── shadows.ts       # Shadow definitions
│   │   ├── motion.ts        # Animation easing & duration tokens
│   │   ├── theme.css        # CSS custom properties
│   │   └── motion-theme.css # Motion-specific CSS variables
│   ├── utils/               # Utility functions (bezier, clipboard, etc.)
│   ├── context/             # React Context (MotionContext, ThemeContext)
│   └── docs/                # Storybook MDX documentation
├── scripts/                 # Automation scripts
│   ├── sync-tokens.ts       # Main orchestrator
│   ├── sync-figma-tokens.ts # Figma API integration
│   ├── validate-tokens.ts   # Token schema validation
│   ├── validate-components.ts # Component compatibility checks
│   ├── update-docs.ts       # Storybook doc generation
│   ├── bump-version.ts      # Version management
│   └── __tests__/           # Script tests
├── tokens/                  # Token source files
│   ├── figma-tokens.json    # Raw tokens from Figma
│   └── tokens.json          # Processed tokens
├── .storybook/              # Storybook configuration
├── .husky/                  # Git hooks (pre-commit validation)
├── vite.config.ts           # Vite bundler config
├── style-dictionary.config.ts # Token transformation rules
├── tsconfig.json            # TypeScript configuration
├── eslint.config.js         # ESLint rules (flat config)
└── package.json             # Dependencies and scripts
```

## Key Technologies

| Area | Technology | Version |
|------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | Tailwind CSS | 4.1.18 |
| **Components** | Radix UI | Latest |
| **Icons** | Heroicons, Lucide | 2.2.0, 0.562.0 |
| **Animation** | Motion | 12.29.0 |
| **Build** | Vite | 7.2.4 |
| **Docs** | Storybook | 10.1.11 |
| **Testing** | Vitest + Playwright | 4.0.17, 1.57.0 |

## Development Workflow

### Working on Components

1. Create or edit component in `src/components/`
2. Use TypeScript for type safety
3. Follow accessibility best practices (Radix UI primitives)
4. Add Storybook stories in component docs

### Adding New Tokens

1. Update design tokens in Figma
2. Run `npm run sync-tokens` to automatically pull and process
3. Tokens are generated in `src/tokens/` and `src/tokens/theme.css`
4. Use token variables in components

### Modifying Motion Presets

The Motion Tuner (`src/components/MotionTuner/`) allows:
- Creating cubic bezier curves with visual editor
- 13 preset easing functions (Material Design 3, CSS defaults, etc.)
- 16 duration presets (50ms - 1000ms)
- Export to CSS, JSON, GSAP, Design Tokens, or Material 3 format

### Before Committing

Git hooks (Husky + lint-staged) automatically run:
```bash
# These run automatically before git commit:
npm run validate-tokens      # Validate token schema
npm run lint:fix             # Fix ESLint issues
npm run format               # Format code with Prettier
```

If pre-commit validation fails, fix the issues and try committing again.

## Testing

### Running Tests

```bash
# Run all tests once
npm run test

# Watch mode with interactive UI
npm run test:watch

# Coverage report
npm run test:coverage

# Test only scripts folder
npm run test:scripts
```

### Test Files Location

Tests are in `scripts/__tests__/`:
- `validate-tokens.test.ts` - Token schema validation
- `generate-report.test.ts` - Report generation
- `rollback-tokens.test.ts` - Backup/rollback functionality

## CI/CD Pipeline

### Validation Commands

```bash
# All validation checks
npm run validate

# Strict validation (includes linting)
npm run validate:strict

# CI pipeline: validate → test → build
npm run ci
```

## Design System Details

### Color Scale
- **Primary**: Teal (#00686f)
- **Neutrals**: Zinc (50-950)
- **Semantic**: Error, Warning, Success, Info
- All colors are CSS variables in `src/tokens/theme.css`

### Typography
- **Headings**: Nunito 600
- **Body**: Nunito 400
- **Code**: Menlo / Martian Mono

### Spacing
- Grid-based: 4px multiples (4, 8, 12, 16, 24, 32, 40, 48, 56, 64px)
- Used consistently across all components

### Motion Tokens
- **Easing curves**: emphasized, standard, linear
- **Durations**: short-1, short-2, medium-1, long-1-3, extra-long-4
- Defined in `src/tokens/motion.ts` and `src/tokens/motion-theme.css`

## Component Library

### Available Components (20+)

**Primitives**
- Avatar, Badge, Button, Divider, Heading, Text

**Forms**
- Input, Select, Checkbox, Radio, Switch, TextArea, Listbox

**Data Display**
- Table (with sorting), DescriptionList

**Feedback**
- Dialog (Modal)

**Navigation**
- Navbar, Sidebar, Dropdown, Pagination

**Motion-Enhanced**
- Animated Accordion, Dialog, and other components

All components use Radix UI primitives for accessibility compliance.

## Common Tasks

### Add a New Component

1. Create file in `src/components/{category}/ComponentName.tsx`
2. Build component using Radix UI primitives
3. Add TypeScript types
4. Create Storybook story in `src/docs/stories/ComponentName.stories.tsx`
5. Export in `src/components/index.ts`

### Update Component Styling

- Styles use Tailwind CSS classes
- Apply theme tokens via CSS variables
- For animations, use Motion library
- Keep component CSS-scoped with Tailwind utility classes

### Generate New Token Export Formats

1. Edit `style-dictionary.config.ts` to add transform rules
2. Add new output format to token export
3. Run `npm run build-tokens` to generate
4. Test exports are accessible in application

### Troubleshooting Token Sync

If token sync fails:

```bash
# Check what changed (dry-run)
npm run sync-tokens -- --dry-run

# Rollback to previous version
npm run rollback-tokens

# Check sync report
npm run generate-report
```

## Git Workflow

### Current Development Branch

All work is on: `claude/create-claude-md-JS4L2`

### Making Changes

1. Work on the development branch
2. Code changes are automatically linted and formatted on commit
3. Use descriptive commit messages
4. Push with: `git push -u origin claude/create-claude-md-JS4L2`

## Release Management

### Version Bumping

The `npm run bump-version` script automatically:
- Updates `package.json` version
- Updates version in component files
- Follows semantic versioning (major.minor.patch)

### Release Process

```bash
# Full release orchestration
npm run release
```

This handles versioning, tagging, and notifications.

## Code Quality Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Enforces React Hooks, imports, and style rules
- **Prettier**: Configured for consistency (single quotes, 2-space indent)
- **Accessibility**: All interactive components use Radix UI primitives
- **Testing**: Critical utility functions have test coverage

## Documentation

- **Storybook**: Interactive component documentation at `src/docs/`
- **README**: General project information
- **TSDoc**: JSDoc comments on exported functions
- **Type definitions**: Full TypeScript coverage

## Performance Tips

- Use `React.memo()` for expensive component re-renders
- Lazy load pages with `React.lazy()`
- Token values are CSS variables (efficient for theme switching)
- Motion Tuner has localStorage persistence for user presets

## Helpful Links

- **Repository**: https://github.com/madergk/sapukai
- **Figma Tokens**: Check your Figma account for the source design file
- **Storybook**: Built-in component explorer and documentation

## Need Help?

For Claude Code specific help:
- Run `/help` in the CLI for Claude Code commands
- Check https://github.com/anthropics/claude-code/issues for issues
- Review this CLAUDE.md for project-specific guidance
