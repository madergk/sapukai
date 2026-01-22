# Sapukai Design System - Workflow Guide

A comprehensive guide to the automated workflows and development tools in this design system.

## Table of Contents

- [Quick Start](#quick-start)
- [Daily Development](#daily-development)
- [Token Management](#token-management)
- [Quality Assurance](#quality-assurance)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### First-Time Setup

```bash
# Install dependencies
npm install

# Verify everything works
npm run validate

# Start development
npm run dev          # Start Vite dev server
npm run storybook    # Start Storybook on port 6006
```

### Environment Setup

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
# Required for Figma sync
FIGMA_ACCESS_TOKEN=your_token_here
FIGMA_FILE_KEY=your_file_key

# Optional: Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## Daily Development

### Available Scripts

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `npm run dev`       | Start Vite development server |
| `npm run storybook` | Start Storybook on port 6006  |
| `npm run build`     | Build for production          |
| `npm run preview`   | Preview production build      |

### Code Quality

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run lint`         | Run ESLint                |
| `npm run lint:fix`     | Run ESLint with auto-fix  |
| `npm run format`       | Format code with Prettier |
| `npm run format:check` | Check code formatting     |
| `npm run typecheck`    | TypeScript type checking  |
| `npm run validate`     | Run all validations       |

### Testing

| Command                 | Description             |
| ----------------------- | ----------------------- |
| `npm run test`          | Run all tests once      |
| `npm run test:watch`    | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:scripts`  | Run script tests only   |

### Pre-Commit Hooks

When you commit, the following checks run automatically:

1. **Token JSON files** → Token validation (schema, contrast, naming)
2. **TypeScript/TSX files** → ESLint with auto-fix
3. **All supported files** → Prettier formatting

```bash
# Commit normally - hooks run automatically
git commit -m "feat: add new component"

# Skip hooks if needed (not recommended)
git commit -m "wip" --no-verify
```

---

## Token Management

### Token Sync Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│     Figma       │────▶│  figma-tokens.json│────▶│  src/tokens/*   │
│   Variables     │     │   (raw tokens)    │     │  (TS, CSS, etc) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                        │
        │                        ▼                        ▼
        │               ┌──────────────────┐     ┌─────────────────┐
        │               │   Validation     │     │   Components    │
        │               │   • Schema       │     │   use tokens    │
        │               │   • Contrast     │     └─────────────────┘
        │               │   • Naming       │
        │               └──────────────────┘
        │
        ▼
┌─────────────────┐
│  Multi-Platform │
│  • iOS Swift    │
│  • Android XML  │
│  • SCSS         │
│  • JSON         │
└─────────────────┘
```

### Sync Commands

```bash
# Full sync from Figma
npm run sync-tokens

# Sync with interactive step selection
npm run sync-tokens -- --interactive

# Sync with options
npm run sync-tokens -- --dry-run           # Preview changes
npm run sync-tokens -- --force             # Force sync
npm run sync-tokens -- --no-version        # Skip version bump
npm run sync-tokens -- --skip-figma        # Use local tokens
npm run sync-tokens -- --notify            # Send notifications
npm run sync-tokens -- --retries=5         # More retries
```

### Token Validation

```bash
# Validate token schema, contrast, and naming
npm run validate-tokens

# Validate component token usage
npm run validate-components

# Run both validations
npm run validate
```

Validation checks include:

- ✅ DTCG schema compliance
- ✅ WCAG AA contrast ratios
- ✅ Naming conventions
- ✅ Light/dark mode parity
- ✅ Reference resolution
- ✅ Duplicate detection

### Rollback Tokens

```bash
# List available backups
npm run rollback-tokens -- --list

# Rollback to specific version
npm run rollback-tokens -- --version=0.1.0

# Rollback to latest backup
npm run rollback-tokens -- --latest

# Preview rollback
npm run rollback-tokens -- --version=0.1.0 --dry-run
```

### Change Reports

```bash
# Generate change report
npm run generate-report

# List all reports
npm run generate-report -- --list
```

Reports include:

- Summary of added/modified/removed tokens
- Breaking change detection
- Detailed change list
- Timestamps and metadata

### Multi-Platform Output

After syncing, tokens are generated for multiple platforms:

| Platform   | Output Location               | Format         |
| ---------- | ----------------------------- | -------------- |
| TypeScript | `src/tokens/*.ts`             | ES Modules     |
| CSS        | `src/tokens/theme.css`        | CSS Variables  |
| SCSS       | `dist/scss/_variables.scss`   | SCSS Variables |
| JSON       | `dist/tokens.json`            | Flat JSON      |
| iOS        | `dist/ios/DesignTokens.swift` | Swift          |
| Android    | `dist/android/colors.xml`     | XML Resources  |

---

## Quality Assurance

### Full Validation

Run all checks before pushing:

```bash
npm run validate
```

This runs:

1. Token validation
2. Component validation
3. ESLint
4. TypeScript type check

### CI Command

Run the full CI pipeline locally:

```bash
npm run ci
```

This runs:

1. All validations
2. All tests
3. Production build

---

## CI/CD Pipeline

### GitHub Actions Workflows

#### `validate.yml` - Main CI Pipeline

Triggered on: Push to `main`/`develop`, Pull requests

Jobs:

1. **Lint & Format** - ESLint + Prettier
2. **TypeScript Check** - Type checking
3. **Validate Tokens** - Token validation + reports
4. **Unit Tests** - Vitest with coverage
5. **Build** - Production build
6. **Storybook** - Build Storybook

#### `tokens-sync.yml` - Automated Token Sync

Triggered on:

- Schedule (weekdays at 9am UTC)
- Manual dispatch

Features:

- Fetches tokens from Figma
- Creates PR with changes
- Generates change reports

### Manual Workflow Trigger

1. Go to GitHub → Actions
2. Select "Sync Design Tokens"
3. Click "Run workflow"
4. Configure options:
   - Force sync
   - Skip PR creation

---

## Troubleshooting

### Common Issues

#### Pre-commit hook fails

```bash
# Check what's failing
npm run validate

# Fix lint issues
npm run lint:fix

# Fix formatting
npm run format
```

#### Token validation fails

```bash
# Check specific issues
npm run validate-tokens

# Common fixes:
# - Ensure colors are in hex format (#RRGGBB)
# - Check contrast ratios (WCAG AA: 4.5:1)
# - Ensure light/dark mode parity
```

#### Figma sync fails

```bash
# Check credentials
echo $FIGMA_ACCESS_TOKEN
echo $FIGMA_FILE_KEY

# Try with more retries
npm run sync-tokens -- --retries=5

# Use local tokens instead
npm run sync-tokens -- --skip-figma
```

#### Rollback needed

```bash
# List available backups
npm run rollback-tokens -- --list

# Rollback to previous version
npm run rollback-tokens -- --latest

# Rebuild tokens after rollback
npm run build-tokens
```

### Getting Help

1. Check the validation output for specific errors
2. Run with `--dry-run` to preview changes
3. Check GitHub Actions logs for CI failures
4. Review change reports in `tokens/.reports/`

---

## Best Practices

### Token Updates

1. Always run `npm run validate-tokens` before committing token changes
2. Review WCAG contrast warnings
3. Ensure light/dark mode parity
4. Use semantic token names

### Component Development

1. Always use tokens from `@/tokens` - never hardcode colors
2. Run `npm run validate-components` to check for issues
3. Test in Storybook with both light and dark modes

### Git Workflow

1. Create feature branch from `develop`
2. Make changes and commit (hooks run automatically)
3. Push and create PR
4. CI runs full validation
5. Merge after review

### Release Process

1. Merge to `main`
2. Token sync runs automatically (or manually trigger)
3. Version is bumped and tagged
4. Changelog is updated
5. Multi-platform outputs are generated

---

## File Structure

```
sapukai/
├── .github/workflows/     # CI/CD workflows
├── .husky/                # Git hooks
├── dist/                  # Multi-platform outputs
│   ├── android/          # Android XML
│   ├── ios/              # iOS Swift
│   ├── scss/             # SCSS variables
│   └── tokens.json       # Flat JSON
├── scripts/               # Automation scripts
│   ├── __tests__/        # Script tests
│   ├── bump-version.ts
│   ├── convert-tokens-studio.ts
│   ├── generate-report.ts
│   ├── notify.ts
│   ├── rollback-tokens.ts
│   ├── sync-figma-tokens.ts
│   ├── sync-tokens.ts
│   ├── update-docs.ts
│   ├── validate-components.ts
│   └── validate-tokens.ts
├── src/
│   ├── components/       # React components
│   ├── tokens/           # Generated tokens
│   └── ...
├── tokens/
│   ├── .history/         # Version backups
│   ├── .reports/         # Change reports
│   ├── figma-tokens.json # Raw tokens
│   └── tokens.json       # Tokens Studio format
└── package.json
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    SAPUKAI QUICK REFERENCE                      │
├─────────────────────────────────────────────────────────────────┤
│  DEVELOPMENT                                                     │
│    npm run dev              Start dev server                     │
│    npm run storybook        Start Storybook                      │
│                                                                  │
│  QUALITY                                                         │
│    npm run validate         Run all checks                       │
│    npm run lint:fix         Fix lint issues                      │
│    npm run format           Format code                          │
│                                                                  │
│  TOKENS                                                          │
│    npm run sync-tokens      Full Figma sync                      │
│    npm run sync-tokens -- -i Interactive mode                    │
│    npm run validate-tokens  Validate tokens                      │
│    npm run rollback-tokens -- --list  Show backups               │
│                                                                  │
│  TESTING                                                         │
│    npm run test             Run all tests                        │
│    npm run test:watch       Watch mode                           │
│    npm run ci               Full CI pipeline                     │
│                                                                  │
│  BUILD                                                           │
│    npm run build            Production build                     │
│    npm run build-storybook  Build Storybook                      │
│                                                                  │
│  RELEASE                                                         │
│    npm run release          Interactive release                  │
│    npm run release -- --patch  Patch release (0.0.x)             │
│    npm run release -- --minor  Minor release (0.x.0)             │
│    npm run release -- --major  Major release (x.0.0)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Release Process

### Interactive Release

```bash
npm run release
```

This will:

1. Prompt you to select release type (patch/minor/major)
2. Run all validations
3. Run linter
4. Run tests
5. Build project
6. Build Storybook
7. Bump version in package.json
8. Update CHANGELOG.md
9. Create git commit and tag
10. Push to remote

### Quick Release

```bash
# Patch release (bug fixes): 0.0.1 → 0.0.2
npm run release -- --patch

# Minor release (new features): 0.1.0 → 0.2.0
npm run release -- --minor

# Major release (breaking changes): 1.0.0 → 2.0.0
npm run release -- --major
```

### Release Options

| Option         | Description                      |
| -------------- | -------------------------------- |
| `--patch`      | Patch version bump               |
| `--minor`      | Minor version bump               |
| `--major`      | Major version bump               |
| `--dry-run`    | Preview without making changes   |
| `--skip-tests` | Skip test step                   |
| `--skip-push`  | Create commit/tag but don't push |

### Example: Dry Run

```bash
npm run release -- --minor --dry-run
```

This shows what would happen without making any changes.
