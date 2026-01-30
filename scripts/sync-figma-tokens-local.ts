#!/usr/bin/env tsx
/**
 * Figma Token Sync - Local File Version
 * Reads tokens directly from figma-tokens.json without fetching from API or Figma
 *
 * Use cases:
 * - Quick local development without network calls
 * - CI/CD pipelines where tokens are already committed
 * - Offline token processing
 * - Testing token transformations
 *
 * This script:
 * 1. Reads existing figma-tokens.json
 * 2. Validates structure
 * 3. Creates backup of current file
 * 4. Ready for Style Dictionary transformation
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// Types
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

// Paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_DIR = path.join(TOKENS_DIR, '.backups')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')

/**
 * Parse command line arguments
 */
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

/**
 * Check if tokens file exists
 */
function checkTokensFile(): boolean {
  if (!fs.existsSync(TOKENS_FILE)) {
    console.error(chalk.red(`Error: ${TOKENS_FILE} not found`))
    console.error(chalk.yellow('You need to create this file first by either:'))
    console.error(chalk.gray('  1. Using Figma Console MCP to extract tokens'))
    console.error(chalk.gray('  2. Running: npm run sync-tokens'))
    console.error(chalk.gray('  3. Manually creating the file from Figma\n'))
    return false
  }
  return true
}

/**
 * Read tokens from file
 */
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

/**
 * Validate tokens structure
 */
function validateTokens(tokens: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Check if it's a valid tokens object (must have at least some structure)
  if (!tokens || typeof tokens !== 'object') {
    errors.push('Invalid tokens file: must be a valid JSON object')
    return { valid: false, errors }
  }

  // W3C Format validation (preferred)
  const isW3CFormat = tokens.$schema && tokens.$metadata && tokens.primitives && tokens.semantic

  if (!isW3CFormat) {
    // Try legacy format or other formats
    const hasTokenData = Object.keys(tokens).length > 0
    if (!hasTokenData) {
      errors.push('File appears to be empty or not a valid tokens file')
    }
    // If it's not W3C format, we'll warn but not fail
    return {
      valid: Object.keys(tokens).length > 0,
      errors: errors.length > 0 ? errors : [],
    }
  }

  // W3C Format validation
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

  // Count tokens (if W3C format)
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

/**
 * Create backup of tokens file
 */
function createBackup(tokens: TokensOutput): void {
  const spinner = ora('Creating backup...').start()

  try {
    // Create backups directory if it doesn't exist
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }

    // Copy to prev backup
    if (fs.existsSync(TOKENS_FILE)) {
      fs.copyFileSync(TOKENS_FILE, BACKUP_FILE)
    }

    // Create versioned backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const versionedBackup = path.join(BACKUP_DIR, `figma-tokens-${timestamp}.json`)
    fs.writeFileSync(versionedBackup, JSON.stringify(tokens, null, 2))

    spinner.succeed('Backup created')
  } catch (error) {
    spinner.warn(`Backup skipped: ${(error as Error).message}`)
  }
}

/**
 * Generate statistics report
 */
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

  // Metadata
  console.log(chalk.cyan('📋 Metadata:\n'))
  console.log(chalk.gray(`Source: ${tokens.$metadata.source}`))
  console.log(chalk.gray(`File Key: ${tokens.$metadata.fileKey}`))
  console.log(chalk.gray(`Version: ${tokens.$metadata.version}`))
  console.log(chalk.gray(`Extracted: ${tokens.$metadata.extractedAt}\n`))
}

/**
 * Compare with previous version
 */
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

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
${chalk.blue('Local Token Sync - Load tokens from file')}

${chalk.yellow('Usage:')}
  npm run sync-tokens-local [options]

${chalk.yellow('Options:')}
  --dry-run        Preview without making changes
  --no-validate    Skip validation
  --no-backup      Skip creating backups
  --report         Show detailed token statistics
  --force          Skip confirmation prompts
  --help           Show this help message

${chalk.yellow('Examples:')}
  npm run sync-tokens-local                # Load and validate tokens
  npm run sync-tokens-local --dry-run      # Preview only
  npm run sync-tokens-local --report       # Show statistics
  npm run sync-tokens-local --no-validate  # Skip validation

${chalk.yellow('Notes:')}
  - This script reads tokens from: tokens/figma-tokens.json
  - No API calls or Figma fetching occurs
  - Suitable for offline development and CI/CD
  - Automatically creates backups before updating
`)
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const options = parseArgs()

  // Show help
  if (process.argv.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  console.log(chalk.blue.bold('\n📄 Loading tokens from local file...\n'))

  // Check if file exists
  if (!checkTokensFile()) {
    process.exit(1)
  }

  // Read tokens
  const tokens = readTokensFile()
  if (!tokens) {
    process.exit(1)
  }

  // Validate
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

  // Create backup
  if (options.backup && !options.dryRun) {
    createBackup(tokens)
  }

  // Generate report
  if (options.report) {
    generateReport(tokens)
    compareWithPrevious(tokens)
  }

  // Summary
  console.log(chalk.green.bold('\n✅ Local token load complete!\n'))

  if (options.dryRun) {
    console.log(chalk.yellow('(Dry run - no changes were made)\n'))
  } else {
    console.log(chalk.gray('Tokens are ready for transformation.'))
    console.log(chalk.gray('Next: npm run sync-tokens -- --skip-figma\n'))
  }

  // Next steps
  console.log(chalk.cyan('Next steps:'))
  console.log(chalk.gray('  1. Review tokens: npm run sync-tokens-local --report'))
  console.log(chalk.gray('  2. Transform: npm run sync-tokens -- --skip-figma'))
  console.log(chalk.gray('  3. Validate: npm run validate-tokens'))
  console.log(chalk.gray('  4. Commit: git add . && git commit\n'))
}

// Run
main().catch(error => {
  console.error(chalk.red('\n✗ Error:'), error.message)
  process.exit(1)
})

export { main }
