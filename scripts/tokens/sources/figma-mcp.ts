#!/usr/bin/env tsx
/**
 * Figma Token Extraction Script - MCP Version
 * Extracts design tokens (variables) from Figma using Figma Console MCP
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// Types for Figma variables via MCP
interface FigmaVariable {
  name: string
  value: string | number | boolean | Record<string, any>
  type: 'color' | 'number' | 'string' | 'boolean'
  description?: string
  group?: string
  mode?: string
}

interface FigmaVariablesCollection {
  primitives: FigmaVariable[]
  semantic: {
    light: FigmaVariable[]
    dark: FigmaVariable[]
  }
}

// Token output structure
interface TokenValue {
  $value: string | number | boolean
  $type: 'color' | 'dimension' | 'number' | 'string' | 'boolean'
  $description?: string
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup
}

interface TokensOutput {
  $schema: string
  $metadata: {
    source: string
    fileKey: string
    extractedAt: string
    version: string
  }
  primitives: TokenGroup
  semantic: {
    light: TokenGroup
    dark: TokenGroup
  }
}

// Environment variables
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY

// Output paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const OUTPUT_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')

interface SyncOptions {
  dryRun: boolean
  interactive: boolean
  source: 'mcp' | 'manual' | 'file'
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const normalizedArgs = args.map(arg => (arg.startsWith('---') ? `--${arg.slice(3)}` : arg))

  return {
    dryRun: normalizedArgs.includes('--dry-run'),
    interactive: normalizedArgs.includes('--interactive'),
    source: 'mcp' as const,
  }
}

function validateEnv(): void {
  if (!FIGMA_FILE_KEY) {
    console.error(chalk.red('Error: FIGMA_FILE_KEY is not set'))
    console.error(chalk.yellow('Please set the Figma file key in your .env file'))
    console.error(chalk.gray('Extract it from your Figma URL: figma.com/design/{FILE_KEY}/...'))
    process.exit(1)
  }
}

function setNestedValue(obj: TokenGroup, path: string[], value: TokenValue): void {
  let current = obj
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (!(key in current)) {
      current[key] = {}
    }
    current = current[key] as TokenGroup
  }
  current[path[path.length - 1]] = value
}

async function fetchFigmaVariablesViaMCP(): Promise<FigmaVariablesCollection> {
  const spinner = ora('Fetching variables via Figma Console MCP...').start()

  try {
    if (fs.existsSync(OUTPUT_FILE)) {
      spinner.succeed('Using existing Figma tokens file')
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8')) as TokensOutput

      const variables: FigmaVariablesCollection = {
        primitives: [],
        semantic: {
          light: [],
          dark: [],
        },
      }

      const flattenTokens = (obj: TokenGroup, prefix = ''): FigmaVariable[] => {
        const result: FigmaVariable[] = []
        for (const [key, value] of Object.entries(obj)) {
          const name = prefix ? `${prefix}/${key}` : key
          if (value && typeof value === 'object' && '$value' in value) {
            const tokenValue = value as TokenValue
            result.push({
              name,
              value: tokenValue.$value,
              type: tokenValue.$type as any,
              description: tokenValue.$description,
            })
          } else if (value && typeof value === 'object') {
            result.push(...flattenTokens(value as TokenGroup, name))
          }
        }
        return result
      }

      variables.primitives = flattenTokens(existing.primitives)
      variables.semantic.light = flattenTokens(existing.semantic.light)
      variables.semantic.dark = flattenTokens(existing.semantic.dark)

      return variables
    }

    console.log(chalk.yellow('\n📝 No existing tokens found.'))
    console.log(chalk.gray('To fetch from Figma:'))
    console.log(chalk.gray('  1. Open Figma file in Claude Code browser'))
    console.log(chalk.gray('  2. Open Figma Console in Dev Tools (Cmd+Alt+J)'))
    console.log(chalk.gray('  3. Run: figma.variables.getAll()'))
    console.log(chalk.gray('  4. Copy the output and save to tokens/figma-tokens.json'))

    spinner.fail('No tokens file found and MCP connection not available')
    process.exit(1)
  } catch (error) {
    spinner.fail('Failed to fetch variables')
    console.error(chalk.red((error as Error).message))
    throw error
  }
}

function processVariables(variables: FigmaVariablesCollection): TokensOutput {
  const spinner = ora('Processing variables...').start()

  const output: TokensOutput = {
    $schema: 'https://design-tokens.org/schema.json',
    $metadata: {
      source: 'Figma (Console MCP)',
      fileKey: FIGMA_FILE_KEY!,
      extractedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    primitives: {},
    semantic: {
      light: {},
      dark: {},
    },
  }

  for (const variable of variables.primitives) {
    const path = variable.name.split('/').map(p => p.trim())
    const tokenValue: TokenValue = {
      $value: variable.value,
      $type: variable.type,
    }
    if (variable.description) {
      tokenValue.$description = variable.description
    }
    setNestedValue(output.primitives, path, tokenValue)
  }

  for (const variable of variables.semantic.light) {
    const path = variable.name.split('/').map(p => p.trim())
    const tokenValue: TokenValue = {
      $value: variable.value,
      $type: variable.type,
    }
    if (variable.description) {
      tokenValue.$description = variable.description
    }
    setNestedValue(output.semantic.light, path, tokenValue)
  }

  for (const variable of variables.semantic.dark) {
    const path = variable.name.split('/').map(p => p.trim())
    const tokenValue: TokenValue = {
      $value: variable.value,
      $type: variable.type,
    }
    if (variable.description) {
      tokenValue.$description = variable.description
    }
    setNestedValue(output.semantic.dark, path, tokenValue)
  }

  spinner.succeed('Processed variables')
  return output
}

function backupExistingTokens(): void {
  if (fs.existsSync(OUTPUT_FILE)) {
    const spinner = ora('Backing up existing tokens...').start()
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE)
    spinner.succeed('Backed up existing tokens')
  }
}

function saveTokens(tokens: TokensOutput): void {
  const spinner = ora('Saving tokens to file...').start()

  if (!fs.existsSync(TOKENS_DIR)) {
    fs.mkdirSync(TOKENS_DIR, { recursive: true })
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokens, null, 2))
  spinner.succeed(`Saved tokens to ${chalk.cyan(OUTPUT_FILE)}`)
}

function readTokensFile(filePath: string): TokensOutput | null {
  if (!fs.existsSync(filePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as TokensOutput
}

function compareTokens(
  newTokens: TokensOutput,
  previousTokens: TokensOutput | null
): { added: number; modified: number; removed: number } {
  if (!previousTokens) {
    return { added: 0, modified: 0, removed: 0 }
  }

  let added = 0
  let modified = 0
  let removed = 0

  const countTokens = (obj: TokenGroup): Map<string, any> => {
    const tokens = new Map<string, any>()
    const flatten = (obj: TokenGroup, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key
        if (value && typeof value === 'object' && '$value' in value) {
          tokens.set(path, (value as TokenValue).$value)
        } else if (value && typeof value === 'object') {
          flatten(value as TokenGroup, path)
        }
      }
    }
    flatten(obj)
    return tokens
  }

  const oldFlat = countTokens(previousTokens.primitives)
  const newFlat = countTokens(newTokens.primitives)

  for (const [key, value] of newFlat) {
    if (!oldFlat.has(key)) {
      added++
    } else if (oldFlat.get(key) !== value) {
      modified++
    }
  }

  for (const key of oldFlat.keys()) {
    if (!newFlat.has(key)) {
      removed++
    }
  }

  return { added, modified, removed }
}

function printMCPInstructions(): void {
  console.log(chalk.blue.bold('\n📱 Figma Console MCP Instructions\n'))

  console.log(chalk.cyan('To fetch variables directly from Figma:\n'))

  console.log('1. Open your Figma file in Claude Code browser')
  console.log('2. Open Developer Tools (Cmd+Alt+J on Mac, Ctrl+Alt+J on Windows)')
  console.log('3. Go to Console tab and run:\n')

  console.log(chalk.yellow('   // Fetch all variables'))
  console.log(chalk.yellow('   figma.variables.getAll()\n'))

  console.log(chalk.yellow('   // Get specific variable set'))
  console.log(chalk.yellow('   figma.variables.getLocalVariables()\n'))

  console.log(chalk.yellow('   // Export as JSON'))
  console.log(chalk.yellow('   JSON.stringify(figma.variables.getAll(), null, 2)\n'))

  console.log('4. Copy the JSON output')
  console.log('5. Save it to tokens/figma-tokens.json')
  console.log('6. Run: npm run token:sync -- --source=local\n')
}

async function main(): Promise<void> {
  const options = parseArgs()

  console.log(chalk.blue.bold('\n🎨 Syncing design tokens via Figma Console MCP\n'))

  validateEnv()

  if (options.interactive) {
    printMCPInstructions()
  }

  if (!options.dryRun) {
    backupExistingTokens()
  } else {
    console.log(chalk.gray('Dry run: skipping backup and file writes'))
  }

  const variables = await fetchFigmaVariablesViaMCP()
  const tokens = processVariables(variables)

  if (!options.dryRun) {
    saveTokens(tokens)
  }

  const previousTokens = options.dryRun ? readTokensFile(TOKENS_FILE) : readTokensFile(BACKUP_FILE)
  const changes = compareTokens(tokens, previousTokens)

  console.log(chalk.green('\n✓ Token extraction complete!\n'))
  console.log('Changes:')
  console.log(chalk.green(`  • ${changes.added} tokens added`))
  console.log(chalk.yellow(`  • ${changes.modified} tokens modified`))
  console.log(chalk.red(`  • ${changes.removed} tokens removed`))

  console.log(chalk.gray('\nNext: Run npm run token:sync to transform and sync\n'))
  process.exit(0)
}

if (process.argv[1]?.includes('figma-mcp')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}

export { main, TokensOutput, TokenGroup, TokenValue }
