#!/usr/bin/env tsx
/**
 * Change Report Generator
 * Generates detailed reports of token changes for audit trail
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// Paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')
const REPORTS_DIR = path.join(TOKENS_DIR, '.reports')

interface TokenChange {
  path: string
  type: string
  oldValue?: string | number | boolean
  newValue?: string | number | boolean
}

interface ChangeReport {
  version: string
  timestamp: string
  summary: {
    added: number
    modified: number
    removed: number
    total: number
  }
  details: {
    added: TokenChange[]
    modified: TokenChange[]
    removed: TokenChange[]
  }
  breakingChanges: TokenChange[]
  metadata: {
    source: string
    previousVersion?: string
    duration?: number
  }
}

interface TokenValue {
  $value: string | number | boolean
  $type?: string
  $description?: string
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup
}

/**
 * Check if value is a token
 */
function isToken(obj: unknown): obj is TokenValue {
  return obj !== null && typeof obj === 'object' && '$value' in obj
}

/**
 * Flatten tokens into a map with paths
 */
function flattenTokens(obj: TokenGroup, prefix = ''): Map<string, TokenValue> {
  const tokens = new Map<string, TokenValue>()

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue

    const currentPath = prefix ? `${prefix}.${key}` : key

    if (isToken(value)) {
      tokens.set(currentPath, value)
    } else if (typeof value === 'object' && value !== null) {
      const nested = flattenTokens(value as TokenGroup, currentPath)
      for (const [k, v] of nested) {
        tokens.set(k, v)
      }
    }
  }

  return tokens
}

/**
 * Compare two token sets and generate changes
 */
function compareTokens(
  oldTokens: Map<string, TokenValue>,
  newTokens: Map<string, TokenValue>
): { added: TokenChange[]; modified: TokenChange[]; removed: TokenChange[] } {
  const added: TokenChange[] = []
  const modified: TokenChange[] = []
  const removed: TokenChange[] = []

  // Find added and modified tokens
  for (const [path, newToken] of newTokens) {
    const oldToken = oldTokens.get(path)

    if (!oldToken) {
      added.push({
        path,
        type: newToken.$type || 'unknown',
        newValue: newToken.$value,
      })
    } else if (JSON.stringify(oldToken.$value) !== JSON.stringify(newToken.$value)) {
      modified.push({
        path,
        type: newToken.$type || oldToken.$type || 'unknown',
        oldValue: oldToken.$value,
        newValue: newToken.$value,
      })
    }
  }

  // Find removed tokens
  for (const [path, oldToken] of oldTokens) {
    if (!newTokens.has(path)) {
      removed.push({
        path,
        type: oldToken.$type || 'unknown',
        oldValue: oldToken.$value,
      })
    }
  }

  return { added, modified, removed }
}

/**
 * Identify breaking changes
 */
function identifyBreakingChanges(changes: {
  added: TokenChange[]
  modified: TokenChange[]
  removed: TokenChange[]
}): TokenChange[] {
  const breaking: TokenChange[] = []

  // Removed tokens are breaking changes
  for (const change of changes.removed) {
    breaking.push({
      ...change,
      type: `REMOVED: ${change.type}`,
    })
  }

  // Type changes are breaking
  for (const change of changes.modified) {
    // Check if the value type changed significantly
    const oldType = typeof change.oldValue
    const newType = typeof change.newValue

    if (oldType !== newType) {
      breaking.push({
        ...change,
        type: `TYPE_CHANGE: ${oldType} → ${newType}`,
      })
    }
  }

  return breaking
}

/**
 * Generate a change report
 */
export async function generateReport(options: {
  compareVersions?: string
}): Promise<ChangeReport | null> {
  const spinner = ora('Generating change report...').start()

  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true })
  }

  // Read current tokens
  if (!fs.existsSync(TOKENS_FILE)) {
    spinner.fail('Current tokens file not found')
    return null
  }

  const currentTokensRaw = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
  const currentTokens = new Map<string, TokenValue>()

  if (currentTokensRaw.primitives) {
    for (const [k, v] of flattenTokens(currentTokensRaw.primitives, 'primitives')) {
      currentTokens.set(k, v)
    }
  }
  if (currentTokensRaw.semantic?.light) {
    for (const [k, v] of flattenTokens(currentTokensRaw.semantic.light, 'semantic.light')) {
      currentTokens.set(k, v)
    }
  }
  if (currentTokensRaw.semantic?.dark) {
    for (const [k, v] of flattenTokens(currentTokensRaw.semantic.dark, 'semantic.dark')) {
      currentTokens.set(k, v)
    }
  }

  // Read previous tokens
  const previousTokens = new Map<string, TokenValue>()

  if (fs.existsSync(BACKUP_FILE)) {
    const previousTokensRaw = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'))

    if (previousTokensRaw.primitives) {
      for (const [k, v] of flattenTokens(previousTokensRaw.primitives, 'primitives')) {
        previousTokens.set(k, v)
      }
    }
    if (previousTokensRaw.semantic?.light) {
      for (const [k, v] of flattenTokens(previousTokensRaw.semantic.light, 'semantic.light')) {
        previousTokens.set(k, v)
      }
    }
    if (previousTokensRaw.semantic?.dark) {
      for (const [k, v] of flattenTokens(previousTokensRaw.semantic.dark, 'semantic.dark')) {
        previousTokens.set(k, v)
      }
    }
  }

  // Compare tokens
  const changes = compareTokens(previousTokens, currentTokens)
  const breakingChanges = identifyBreakingChanges(changes)

  // Get version from package.json
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))

  // Create report
  const report: ChangeReport = {
    version: packageJson.version || '0.0.0',
    timestamp: new Date().toISOString(),
    summary: {
      added: changes.added.length,
      modified: changes.modified.length,
      removed: changes.removed.length,
      total: changes.added.length + changes.modified.length + changes.removed.length,
    },
    details: changes,
    breakingChanges,
    metadata: {
      source: currentTokensRaw.$metadata?.source || 'Unknown',
      previousVersion: currentTokensRaw.$metadata?.version,
    },
  }

  // Save report
  const reportFilename = `report-${report.version}-${Date.now()}.json`
  const reportPath = path.join(REPORTS_DIR, reportFilename)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  spinner.succeed(`Report generated: ${chalk.cyan(reportFilename)}`)

  return report
}

/**
 * Print report to console
 */
function printReport(report: ChangeReport): void {
  console.log(chalk.blue(`\n📊 Token Change Report - v${report.version}\n`))

  // Summary
  console.log(chalk.gray('Summary:'))
  console.log(chalk.green(`  + ${report.summary.added} added`))
  console.log(chalk.yellow(`  ~ ${report.summary.modified} modified`))
  console.log(chalk.red(`  - ${report.summary.removed} removed`))
  console.log(chalk.gray(`  = ${report.summary.total} total changes`))

  // Breaking changes warning
  if (report.breakingChanges.length > 0) {
    console.log(chalk.red.bold(`\n⚠️  ${report.breakingChanges.length} BREAKING CHANGES:\n`))

    for (const change of report.breakingChanges.slice(0, 10)) {
      console.log(chalk.red(`  • ${change.path}`))
      console.log(chalk.gray(`    ${change.type}`))
    }

    if (report.breakingChanges.length > 10) {
      console.log(chalk.gray(`  ... and ${report.breakingChanges.length - 10} more`))
    }
  }

  // Details (limited)
  if (report.details.added.length > 0) {
    console.log(chalk.green('\nAdded tokens:'))
    for (const change of report.details.added.slice(0, 5)) {
      console.log(chalk.green(`  + ${change.path}: ${change.newValue}`))
    }
    if (report.details.added.length > 5) {
      console.log(chalk.gray(`  ... and ${report.details.added.length - 5} more`))
    }
  }

  if (report.details.modified.length > 0) {
    console.log(chalk.yellow('\nModified tokens:'))
    for (const change of report.details.modified.slice(0, 5)) {
      console.log(chalk.yellow(`  ~ ${change.path}`))
      console.log(chalk.gray(`    ${change.oldValue} → ${change.newValue}`))
    }
    if (report.details.modified.length > 5) {
      console.log(chalk.gray(`  ... and ${report.details.modified.length - 5} more`))
    }
  }

  if (report.details.removed.length > 0) {
    console.log(chalk.red('\nRemoved tokens:'))
    for (const change of report.details.removed.slice(0, 5)) {
      console.log(chalk.red(`  - ${change.path}`))
    }
    if (report.details.removed.length > 5) {
      console.log(chalk.gray(`  ... and ${report.details.removed.length - 5} more`))
    }
  }

  console.log('')
}

/**
 * List all reports
 */
function listReports(): void {
  if (!fs.existsSync(REPORTS_DIR)) {
    console.log(chalk.yellow('\nNo reports found'))
    return
  }

  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter(f => f.startsWith('report-') && f.endsWith('.json'))
    .sort()
    .reverse()

  if (files.length === 0) {
    console.log(chalk.yellow('\nNo reports found'))
    return
  }

  console.log(chalk.blue('\n📋 Available reports:\n'))

  for (const file of files.slice(0, 20)) {
    const filePath = path.join(REPORTS_DIR, file)
    const report = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as ChangeReport

    console.log(chalk.cyan(`  ${file}`))
    console.log(
      chalk.gray(
        `    v${report.version} | ${report.summary.total} changes | ${new Date(report.timestamp).toLocaleString()}`
      )
    )
  }

  if (files.length > 20) {
    console.log(chalk.gray(`\n  ... and ${files.length - 20} more`))
  }

  console.log('')
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // List reports
  if (args.includes('--list') || args.includes('-l')) {
    listReports()
    return
  }

  console.log(chalk.blue('\n📊 Generating change report...\n'))

  const report = await generateReport({})

  if (report) {
    printReport(report)
  }
}

// Run if executed directly
if (process.argv[1]?.includes('generate-report')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}
