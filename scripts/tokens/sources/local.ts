#!/usr/bin/env tsx
/**
 * Figma Token Sync - Local File Version
 * Reads tokens directly from figma-tokens.json without fetching from API or Figma
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

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

interface SyncOptions {
  dryRun: boolean
  validate: boolean
  report: boolean
  backup: boolean
  force: boolean
}

const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_DIR = path.join(TOKENS_DIR, '.backups')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const normalizedArgs = args.map(arg => (arg.startsWith('---') ? `--${arg.slice(3)}` : arg))

  return {
    dryRun: normalizedArgs.includes('--dry-run'),
    validate: !normalizedArgs.includes('--no-validate'),
    report: normalizedArgs.includes('--report'),
    backup: !normalizedArgs.includes('--no-backup'),
    force: normalizedArgs.includes('--force'),
  }
}

function checkTokensFile(): boolean {
  if (!fs.existsSync(TOKENS_FILE)) {
    console.error(chalk.red(`Error: ${TOKENS_FILE} not found`))
    console.error(chalk.yellow('You need to create this file first by either:'))
    console.error(chalk.gray('  1. Using Figma Console MCP to extract tokens'))
    console.error(chalk.gray('  2. Running: npm run token:sync'))
    console.error(chalk.gray('  3. Manually creating the file from Figma\n'))
    return false
  }
  return true
}

function readTokensFile(): TokensOutput | null {
  const spinner = ora('Reading tokens from file...').start()

  try {
    const content = fs.readFileSync(TOKENS_FILE, 'utf-8')
    const tokens = JSON.parse(content) as TokensOutput
    spinner.succeed(`Loaded ${TOKENS_FILE}`)
    return tokens
  } catch (error) {
    spinner.fail('Failed to read tokens file')
    console.error(chalk.red((error as Error).message))
    return null
  }
}

function validateTokens(tokens: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!tokens || typeof tokens !== 'object') {
    errors.push('Invalid tokens file: must be a valid JSON object')
    return { valid: false, errors }
  }

  const isW3CFormat = tokens.$schema && tokens.$metadata && tokens.primitives && tokens.semantic

  if (!isW3CFormat) {
    const hasTokenData = Object.keys(tokens).length > 0
    if (!hasTokenData) {
      errors.push('File appears to be empty or not a valid tokens file')
    }
    return {
      valid: Object.keys(tokens).length > 0,
      errors: errors.length > 0 ? errors : [],
    }
  }

  if (!tokens.$schema) {
    errors.push('Missing $schema')
  }

  if (!tokens.$metadata) {
    errors.push('Missing $metadata')
  } else {
    if (!tokens.$metadata.source) errors.push('Missing $metadata.source')
    if (!tokens.$metadata.fileKey) errors.push('Missing $metadata.fileKey')
    if (!tokens.$metadata.extractedAt) errors.push('Missing $metadata.extractedAt')
    if (!tokens.$metadata.version) errors.push('Missing $metadata.version')
  }

  if (!tokens.primitives) {
    errors.push('Missing primitives section')
  }

  if (!tokens.semantic) {
    errors.push('Missing semantic section')
  } else {
    if (!tokens.semantic.light) errors.push('Missing semantic.light')
    if (!tokens.semantic.dark) errors.push('Missing semantic.dark')
  }

  if (isW3CFormat && (tokens.primitives || tokens.semantic)) {
    const countTokens = (obj: any, depth = 0): number => {
      let count = 0
      for (const value of Object.values(obj || {})) {
        if (value && typeof value === 'object' && '$value' in value) {
          count++
        } else if (value && typeof value === 'object') {
          count += countTokens(value, depth + 1)
        }
      }
      return count
    }

    const primitiveCount = tokens.primitives ? countTokens(tokens.primitives) : 0
    const lightCount = tokens.semantic?.light ? countTokens(tokens.semantic.light) : 0
    const darkCount = tokens.semantic?.dark ? countTokens(tokens.semantic.dark) : 0

    if (primitiveCount === 0 && !lightCount && !darkCount) {
      errors.push('No tokens found in any section')
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

function createBackup(tokens: TokensOutput): void {
  const spinner = ora('Creating backup...').start()

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }

    if (fs.existsSync(TOKENS_FILE)) {
      fs.copyFileSync(TOKENS_FILE, BACKUP_FILE)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const versionedBackup = path.join(BACKUP_DIR, `figma-tokens-${timestamp}.json`)
    fs.writeFileSync(versionedBackup, JSON.stringify(tokens, null, 2))

    spinner.succeed('Backup created')
  } catch (error) {
    spinner.warn(`Backup skipped: ${(error as Error).message}`)
  }
}

function generateReport(tokens: any): void {
  console.log(chalk.cyan('\n📊 Token Statistics:\n'))

  const countTokens = (obj: any): Map<string, number> => {
    const counts = new Map<string, number>()
    if (!obj) return counts

    const traverse = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj || {})) {
        const fullKey = prefix ? `${prefix}/${key}` : key

        if (value && typeof value === 'object' && '$value' in value) {
          const type = (value as any).$type
          counts.set(type, (counts.get(type) || 0) + 1)
        } else if (value && typeof value === 'object') {
          traverse(value as any, fullKey)
        }
      }
    }
    traverse(obj)
    return counts
  }

  const primitiveStats = tokens.primitives ? countTokens(tokens.primitives) : new Map()
  const lightStats = tokens.semantic?.light ? countTokens(tokens.semantic.light) : new Map()
  const darkStats = tokens.semantic?.dark ? countTokens(tokens.semantic.dark) : new Map()

  console.log(chalk.yellow('Primitives:'))
  let primitiveTotal = 0
  for (const [type, count] of primitiveStats) {
    console.log(chalk.gray(`  ${type}: ${count}`))
    primitiveTotal += count
  }
  console.log(chalk.gray(`  Total: ${primitiveTotal}\n`))

  console.log(chalk.yellow('Semantic - Light:'))
  let lightTotal = 0
  for (const [type, count] of lightStats) {
    console.log(chalk.gray(`  ${type}: ${count}`))
    lightTotal += count
  }
  console.log(chalk.gray(`  Total: ${lightTotal}\n`))

  console.log(chalk.yellow('Semantic - Dark:'))
  let darkTotal = 0
  for (const [type, count] of darkStats) {
    console.log(chalk.gray(`  ${type}: ${count}`))
    darkTotal += count
  }
  console.log(chalk.gray(`  Total: ${darkTotal}\n`))

  console.log(chalk.green(`Grand Total: ${primitiveTotal + lightTotal + darkTotal} tokens\n`))

  console.log(chalk.cyan('📋 Metadata:\n'))
  console.log(chalk.gray(`Source: ${tokens.$metadata.source}`))
  console.log(chalk.gray(`File Key: ${tokens.$metadata.fileKey}`))
  console.log(chalk.gray(`Version: ${tokens.$metadata.version}`))
  console.log(chalk.gray(`Extracted: ${tokens.$metadata.extractedAt}\n`))
}

function compareWithPrevious(current: TokensOutput): void {
  if (!fs.existsSync(BACKUP_FILE)) {
    console.log(chalk.gray('No previous version to compare'))
    return
  }

  const spinner = ora('Comparing with previous version...').start()

  try {
    const previous = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8')) as TokensOutput

    const countTokens = (obj: TokenGroup): number => {
      let count = 0
      const traverse = (obj: TokenGroup) => {
        for (const value of Object.values(obj)) {
          if (value && typeof value === 'object' && '$value' in value) {
            count++
          } else if (value && typeof value === 'object') {
            traverse(value as TokenGroup)
          }
        }
      }
      traverse(obj)
      return count
    }

    const prevTotal =
      countTokens(previous.primitives) +
      countTokens(previous.semantic.light) +
      countTokens(previous.semantic.dark)
    const currentTotal =
      countTokens(current.primitives) +
      countTokens(current.semantic.light) +
      countTokens(current.semantic.dark)
    const diff = currentTotal - prevTotal

    spinner.succeed('Comparison complete')

    console.log(chalk.cyan('\n📈 Changes from previous version:\n'))
    console.log(chalk.gray(`Previous: ${prevTotal} tokens`))
    console.log(chalk.gray(`Current:  ${currentTotal} tokens`))

    if (diff > 0) {
      console.log(chalk.green(`Change:   +${diff} tokens`))
    } else if (diff < 0) {
      console.log(chalk.red(`Change:   ${diff} tokens`))
    } else {
      console.log(chalk.yellow(`Change:   No changes`))
    }
    console.log('')
  } catch (error) {
    spinner.fail(`Comparison failed: ${(error as Error).message}`)
  }
}

function printHelp(): void {
  console.log(`
${chalk.blue('Local Token Sync - Load tokens from file')}

${chalk.yellow('Usage:')}
  tsx scripts/tokens/sources/local.ts [options]

${chalk.yellow('Options:')}
  --dry-run        Preview without making changes
  --no-validate    Skip validation
  --no-backup      Skip creating backups
  --report         Show detailed token statistics
  --force          Skip confirmation prompts
  --help           Show this help message
`)
}

async function main(): Promise<void> {
  const options = parseArgs()

  if (process.argv.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  console.log(chalk.blue.bold('\n📄 Loading tokens from local file...\n'))

  if (!checkTokensFile()) {
    process.exit(1)
  }

  const tokens = readTokensFile()
  if (!tokens) {
    process.exit(1)
  }

  if (options.validate) {
    const spinner = ora('Validating tokens structure...').start()
    const validation = validateTokens(tokens)

    if (validation.valid) {
      spinner.succeed('Tokens structure is valid ✓')
    } else {
      spinner.fail('Validation errors found:')
      for (const error of validation.errors) {
        console.error(chalk.red(`  ✗ ${error}`))
      }
      if (!options.force) {
        process.exit(1)
      }
    }
  }

  if (options.backup && !options.dryRun) {
    createBackup(tokens)
  }

  if (options.report) {
    generateReport(tokens)
    compareWithPrevious(tokens)
  }

  console.log(chalk.green.bold('\n✅ Local token load complete!\n'))
  if (options.dryRun) {
    console.log(chalk.yellow('(Dry run - no changes were made)\n'))
  } else {
    console.log(chalk.gray('Tokens are ready for transformation.'))
    console.log(chalk.gray('Next: npm run token:sync -- --source=local\n'))
  }
}

if (process.argv[1]?.includes('sources/local')) {
  main().catch(error => {
    console.error(chalk.red('\n✗ Error:'), error.message)
    process.exit(1)
  })
}

export { main }
