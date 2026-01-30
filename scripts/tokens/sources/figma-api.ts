/**
 * Figma Token Extraction Script (API)
 * Extracts design tokens (variables) from Figma and saves them as JSON
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// Types for Figma API responses
interface FigmaVariable {
  id: string
  name: string
  key: string
  variableCollectionId: string
  resolvedType: 'BOOLEAN' | 'FLOAT' | 'STRING' | 'COLOR'
  valuesByMode: Record<string, FigmaVariableValue>
  remote: boolean
  description: string
  hiddenFromPublishing: boolean
  scopes: string[]
  codeSyntax: Record<string, string>
}

interface FigmaVariableValue {
  type?: 'VARIABLE_ALIAS'
  id?: string
  r?: number
  g?: number
  b?: number
  a?: number
}

interface FigmaVariableCollection {
  id: string
  name: string
  key: string
  modes: { modeId: string; name: string }[]
  defaultModeId: string
  remote: boolean
  hiddenFromPublishing: boolean
  variableIds: string[]
}

interface FigmaVariablesResponse {
  status: number
  error: boolean
  meta: {
    variableCollections: Record<string, FigmaVariableCollection>
    variables: Record<string, FigmaVariable>
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
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY

// Output paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const OUTPUT_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')

interface SyncOptions {
  dryRun: boolean
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const normalizedArgs = args.map(arg => (arg.startsWith('---') ? `--${arg.slice(3)}` : arg))
  return {
    dryRun: normalizedArgs.includes('--dry-run'),
  }
}

function validateEnv(): void {
  if (!FIGMA_ACCESS_TOKEN) {
    console.error(chalk.red('Error: FIGMA_ACCESS_TOKEN is not set'))
    console.error(chalk.yellow('Please create a .env file with your Figma Personal Access Token'))
    console.error(chalk.gray('See .env.example for reference'))
    process.exit(1)
  }

  if (!FIGMA_FILE_KEY) {
    console.error(chalk.red('Error: FIGMA_FILE_KEY is not set'))
    console.error(chalk.yellow('Please set the Figma file key in your .env file'))
    console.error(chalk.gray('Extract it from your Figma URL: figma.com/design/{FILE_KEY}/...'))
    process.exit(1)
  }
}

function rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  if (a < 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function nameToPath(name: string): string[] {
  return name.split('/').map(part => part.trim())
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

async function fetchFigmaVariables(): Promise<FigmaVariablesResponse> {
  const spinner = ora('Fetching variables from Figma API...').start()

  try {
    const response = await fetch(
      `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
      {
        headers: {
          'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      spinner.fail('Failed to fetch from Figma API')
      console.error(chalk.red(`HTTP ${response.status}: ${errorText}`))

      if (response.status === 403) {
        console.error(chalk.yellow('\nNote: The Variables API requires a Figma Enterprise plan.'))
        console.error(chalk.yellow("If you don't have Enterprise, you can:"))
        console.error(chalk.gray('  1. Export tokens manually from Figma'))
        console.error(chalk.gray('  2. Use Tokens Studio plugin'))
        console.error(chalk.gray('  3. Create tokens/figma-tokens.json manually'))
      }

      process.exit(1)
    }

    const data = (await response.json()) as FigmaVariablesResponse
    spinner.succeed('Fetched variables from Figma API')
    return data
  } catch (error) {
    spinner.fail('Failed to fetch from Figma API')
    throw error
  }
}

function processVariables(data: FigmaVariablesResponse): TokensOutput {
  const spinner = ora('Processing variables...').start()

  const { variableCollections, variables } = data.meta

  const variableMap = new Map<string, FigmaVariable>()
  for (const variable of Object.values(variables)) {
    variableMap.set(variable.id, variable)
  }

  const output: TokensOutput = {
    $schema: 'https://design-tokens.org/schema.json',
    $metadata: {
      source: 'Figma',
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

  for (const collection of Object.values(variableCollections)) {
    const collectionName = collection.name.toLowerCase()
    const isPrimitive =
      collectionName.includes('primitive') ||
      collectionName.includes('base') ||
      collectionName.includes('core')
    const modes = collection.modes

    for (const variableId of collection.variableIds) {
      const variable = variableMap.get(variableId)
      if (!variable || variable.hiddenFromPublishing) continue

      const tokenPath = nameToPath(variable.name)
      const tokenType = getTokenType(variable.resolvedType)

      for (const mode of modes) {
        const value = variable.valuesByMode[mode.modeId]
        if (value === undefined) continue

        const resolvedValue = resolveValue(value, variable.resolvedType, variableMap)

        const tokenValue: TokenValue = {
          $value: resolvedValue,
          $type: tokenType,
        }

        if (variable.description) {
          tokenValue.$description = variable.description
        }

        if (isPrimitive) {
          setNestedValue(output.primitives, tokenPath, tokenValue)
        } else {
          const modeName = mode.name.toLowerCase()
          if (modeName.includes('dark')) {
            setNestedValue(output.semantic.dark, tokenPath, tokenValue)
          } else {
            setNestedValue(output.semantic.light, tokenPath, tokenValue)
          }
        }
      }
    }
  }

  spinner.succeed('Processed variables')
  return output
}

function getTokenType(resolvedType: FigmaVariable['resolvedType']): TokenValue['$type'] {
  switch (resolvedType) {
    case 'COLOR':
      return 'color'
    case 'FLOAT':
      return 'number'
    case 'BOOLEAN':
      return 'boolean'
    case 'STRING':
    default:
      return 'string'
  }
}

function resolveValue(
  value: FigmaVariableValue,
  resolvedType: FigmaVariable['resolvedType'],
  variableMap: Map<string, FigmaVariable>
): string | number | boolean {
  if (value.type === 'VARIABLE_ALIAS' && value.id) {
    const aliasedVariable = variableMap.get(value.id)
    if (aliasedVariable) {
      const refPath = nameToPath(aliasedVariable.name).join('.')
      return `{${refPath}}`
    }
  }

  if (resolvedType === 'COLOR' && value.r !== undefined) {
    return rgbaToHex(value.r, value.g!, value.b!, value.a)
  }

  if (typeof value === 'number') return value
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value

  if ('value' in (value as any)) {
    return (value as any).value
  }

  return String(value)
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

  const countTokens = (obj: TokenGroup, prefix = ''): Map<string, any> => {
    const tokens = new Map<string, any>()
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && '$value' in value) {
        tokens.set(path, (value as TokenValue).$value)
      } else if (value && typeof value === 'object') {
        const nested = countTokens(value as TokenGroup, path)
        for (const [k, v] of nested) {
          tokens.set(k, v)
        }
      }
    }
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

async function main(): Promise<void> {
  const options = parseArgs()
  console.log(chalk.blue('\n🎨 Syncing design tokens from Figma...\n'))

  validateEnv()

  if (!options.dryRun) {
    backupExistingTokens()
  } else {
    console.log(chalk.gray('Dry run: skipping backup and file writes'))
  }

  const figmaData = await fetchFigmaVariables()
  const tokens = processVariables(figmaData)

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
  console.log('')

  process.exit(0)
}

if (process.argv[1]?.includes('figma-api')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}

export { main as syncFigmaTokens, TokensOutput, TokenGroup, TokenValue }
