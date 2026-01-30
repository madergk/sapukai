/**
 * Documentation Update Script
 * Updates Storybook documentation with current token values
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { TOKENS_FILE } from './config'

const DOCS_DIR = path.join(process.cwd(), 'src', 'docs')
const DESIGN_TOKENS_MDX = path.join(DOCS_DIR, 'DesignTokens.mdx')

interface TokensData {
  $metadata?: {
    source: string
    fileKey: string
    extractedAt: string
    version: string
  }
  primitives: Record<string, any>
  semantic: {
    light: Record<string, any>
    dark: Record<string, any>
  }
}

function readTokens(): TokensData | null {
  if (!fs.existsSync(TOKENS_FILE)) {
    return null
  }

  return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
}

function flattenTokens(obj: Record<string, any>, prefix = ''): Map<string, any> {
  const result = new Map<string, any>()

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object') {
      if ('$value' in value) {
        result.set(currentPath, {
          value: value.$value,
          type: value.$type,
          description: value.$description,
        })
      } else {
        const nested = flattenTokens(value, currentPath)
        for (const [k, v] of nested) {
          result.set(k, v)
        }
      }
    }
  }

  return result
}

function generateColorTable(tokens: Map<string, any>): string {
  const colorTokens = Array.from(tokens.entries())
    .filter(([, v]) => v.type === 'color')
    .sort(([a], [b]) => a.localeCompare(b))

  if (colorTokens.length === 0) {
    return '*No color tokens defined*'
  }

  let table = '| Token | Value | Preview |\n'
  table += '|-------|-------|----------|\n'

  for (const [name, token] of colorTokens) {
    const value = token.value
    const isRef = typeof value === 'string' && value.startsWith('{')
    const preview = isRef
      ? '(alias)'
      : `<div style={{width: '24px', height: '24px', backgroundColor: '${value}', border: '1px solid #e4e4e7', borderRadius: '4px'}} />`

    table += `| \`${name}\` | \`${value}\` | ${preview} |\n`
  }

  return table
}

function generateSpacingTable(tokens: Map<string, any>): string {
  const spacingTokens = Array.from(tokens.entries())
    .filter(
      ([name]) => name.toLowerCase().includes('spacing') || name.toLowerCase().includes('space')
    )
    .sort(([a], [b]) => a.localeCompare(b))

  if (spacingTokens.length === 0) {
    return '*No spacing tokens defined*'
  }

  let table = '| Token | Value |\n'
  table += '|-------|-------|\n'

  for (const [name, token] of spacingTokens) {
    table += `| \`${name}\` | \`${token.value}\` |\n`
  }

  return table
}

function generateTypographyTable(tokens: Map<string, any>): string {
  const typographyTokens = Array.from(tokens.entries())
    .filter(
      ([name]) =>
        name.toLowerCase().includes('font') ||
        name.toLowerCase().includes('typography') ||
        name.toLowerCase().includes('text')
    )
    .sort(([a], [b]) => a.localeCompare(b))

  if (typographyTokens.length === 0) {
    return '*No typography tokens defined*'
  }

  let table = '| Token | Value | Type |\n'
  table += '|-------|-------|------|\n'

  for (const [name, token] of typographyTokens) {
    table += `| \`${name}\` | \`${token.value}\` | ${token.type} |\n`
  }

  return table
}

function generateMdxContent(tokens: TokensData): string {
  const metadata = tokens.$metadata
  const primitiveTokens = flattenTokens(tokens.primitives)
  const lightTokens = flattenTokens(tokens.semantic?.light || {})
  const darkTokens = flattenTokens(tokens.semantic?.dark || {})

  const lastUpdated = metadata?.extractedAt
    ? new Date(metadata.extractedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown'

  return `import { Meta } from '@storybook/addon-docs/blocks'

<Meta title="Foundation/Design Tokens" />

# Design Tokens

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes.

> **Auto-generated documentation** - This file is automatically updated when tokens are synced from Figma.
> Last updated: ${lastUpdated}

## Overview

This design system uses a three-tier token architecture:

1. **Primitive Tokens**: Raw values (colors, sizes, etc.)
2. **Semantic Tokens**: Contextual tokens that reference primitives
3. **Component Tokens**: Component-specific styling tokens

---

## Primitive Colors

Base color palette extracted from Figma.

${generateColorTable(primitiveTokens)}

---

## Semantic Colors

### Light Mode

Contextual color tokens for light theme.

${generateColorTable(lightTokens)}

### Dark Mode

Contextual color tokens for dark theme.

${generateColorTable(darkTokens)}

---

## Spacing

Spacing scale based on 4px base unit.

${generateSpacingTable(primitiveTokens)}

---

## Typography

Font families, sizes, weights, and line heights.

${generateTypographyTable(primitiveTokens)}

---

## Usage

### In TypeScript/React

\`\`\`tsx
import { primitiveColors, semanticColors } from '@/tokens'

// Use primitive colors
const brandColor = primitiveColors.indigo[500]

// Use semantic colors
const textColor = semanticColors.light.content.primary
\`\`\`

### In CSS/Tailwind

\`\`\`css
/* Use CSS variables generated from tokens */
.my-element {
  color: var(--content-primary);
  background: var(--background-primary);
}
\`\`\`

### With Tailwind Classes

\`\`\`tsx
// Tailwind classes are automatically generated from CSS variables
<div className="bg-zinc-100 text-zinc-900">
  Content
</div>
\`\`\`

---

## Syncing Tokens

To update tokens from Figma:

\`\`\`bash
npm run token:sync
\`\`\`

This will:
1. Fetch latest variables from Figma
2. Transform tokens to TypeScript and CSS
3. Validate components for breaking changes
4. Update this documentation
5. Bump the package version

---

## Token Metadata

| Property | Value |
|----------|-------|
| Source | ${metadata?.source || 'Figma'} |
| File Key | \`${metadata?.fileKey || 'N/A'}\` |
| Version | ${metadata?.version || '1.0.0'} |
| Last Sync | ${lastUpdated} |
`
}

export async function updateDocs(): Promise<void> {
  const spinner = ora('Updating documentation...').start()

  const tokens = readTokens()

  if (!tokens) {
    spinner.warn('No tokens file found, using placeholder documentation')

    const placeholderContent = `import { Meta } from '@storybook/addon-docs/blocks'

<Meta title="Foundation/Design Tokens" />

# Design Tokens

> **Note**: No tokens have been synced from Figma yet.
> Run \`npm run token:sync\` to fetch tokens from Figma.

## Getting Started

1. Create a \`.env\` file with your Figma credentials (see \`.env.example\`)
2. Run \`npm run token:sync\` to fetch tokens from Figma
3. This documentation will be automatically updated

## Manual Token Files

If you don't have access to the Figma API, you can manually create \`tokens/figma-tokens.json\` following the expected format.
`

    if (!fs.existsSync(DOCS_DIR)) {
      fs.mkdirSync(DOCS_DIR, { recursive: true })
    }

    fs.writeFileSync(DESIGN_TOKENS_MDX, placeholderContent)
    spinner.succeed('Created placeholder documentation')
    return
  }

  const content = generateMdxContent(tokens)

  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true })
  }

  fs.writeFileSync(DESIGN_TOKENS_MDX, content)

  spinner.succeed(`Updated ${chalk.cyan('src/docs/DesignTokens.mdx')}`)
}

async function main(): Promise<void> {
  console.log(chalk.blue('\n📚 Updating documentation...\n'))

  await updateDocs()

  console.log(chalk.green('\n✓ Documentation updated successfully\n'))
}

if (process.argv[1]?.includes('tokens/docs')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}
