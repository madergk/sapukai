#!/usr/bin/env tsx
/**
 * Token Rollback Script
 * Allows rolling back to a previous version of design tokens
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// Paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const HISTORY_DIR = path.join(TOKENS_DIR, '.history')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')

interface RollbackOptions {
  version?: string
  timestamp?: string
  list?: boolean
  latest?: boolean
  dryRun?: boolean
}

interface BackupInfo {
  filename: string
  version: string
  timestamp: string
  date: Date
  size: number
}

/**
 * Parse command line arguments
 */
function parseArgs(): RollbackOptions {
  const args = process.argv.slice(2)
  const options: RollbackOptions = {}

  for (const arg of args) {
    if (arg === '--list' || arg === '-l') {
      options.list = true
    } else if (arg === '--latest') {
      options.latest = true
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg.startsWith('--version=')) {
      options.version = arg.split('=')[1]
    } else if (arg.startsWith('--timestamp=')) {
      options.timestamp = arg.split('=')[1]
    }
  }

  return options
}

/**
 * Ensure history directory exists
 */
function ensureHistoryDir(): void {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true })
  }
}

/**
 * Get list of available backups
 */
function getBackups(): BackupInfo[] {
  ensureHistoryDir()

  const files = fs
    .readdirSync(HISTORY_DIR)
    .filter(f => f.startsWith('tokens-') && f.endsWith('.json'))

  const backups: BackupInfo[] = []

  for (const filename of files) {
    // Parse filename: tokens-0.1.0-2024-01-22T10-30-00-000Z.json
    const match = filename.match(/^tokens-(.+?)-(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.json$/)

    if (match) {
      const filePath = path.join(HISTORY_DIR, filename)
      const stats = fs.statSync(filePath)

      backups.push({
        filename,
        version: match[1],
        timestamp: match[2].replace(/-/g, ':').replace('T', 'T').replace('Z', 'Z'),
        date: new Date(match[2].replace(/-/g, (m, i) => (i > 9 ? ':' : '-'))),
        size: stats.size,
      })
    }
  }

  // Sort by date, newest first
  return backups.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * Create a backup of current tokens
 */
export function createBackup(version: string): string {
  ensureHistoryDir()

  if (!fs.existsSync(TOKENS_FILE)) {
    throw new Error('No tokens file to backup')
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFilename = `tokens-${version}-${timestamp}.json`
  const backupPath = path.join(HISTORY_DIR, backupFilename)

  fs.copyFileSync(TOKENS_FILE, backupPath)

  // Also update the simple backup
  fs.copyFileSync(TOKENS_FILE, BACKUP_FILE)

  // Clean old backups (keep last 20)
  cleanOldBackups(20)

  return backupPath
}

/**
 * Clean old backups, keeping only the specified number
 */
function cleanOldBackups(keepCount: number): void {
  const backups = getBackups()

  if (backups.length > keepCount) {
    const toDelete = backups.slice(keepCount)

    for (const backup of toDelete) {
      const filePath = path.join(HISTORY_DIR, backup.filename)
      fs.unlinkSync(filePath)
    }
  }
}

/**
 * Rollback to a specific backup
 */
async function rollbackTo(backup: BackupInfo, dryRun: boolean): Promise<void> {
  const backupPath = path.join(HISTORY_DIR, backup.filename)

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backup.filename}`)
  }

  if (dryRun) {
    console.log(chalk.yellow('\n[Dry Run] Would rollback to:'))
    console.log(`  Version: ${backup.version}`)
    console.log(`  Timestamp: ${backup.timestamp}`)
    console.log(`  File: ${backup.filename}`)
    return
  }

  // Backup current tokens before rollback
  if (fs.existsSync(TOKENS_FILE)) {
    const currentBackup = path.join(HISTORY_DIR, `tokens-pre-rollback-${Date.now()}.json`)
    fs.copyFileSync(TOKENS_FILE, currentBackup)
  }

  // Restore the backup
  fs.copyFileSync(backupPath, TOKENS_FILE)

  console.log(chalk.green(`\n✓ Rolled back to version ${backup.version}`))
  console.log(chalk.gray(`  From: ${backup.filename}`))
}

/**
 * List available backups
 */
function listBackups(): void {
  const backups = getBackups()

  if (backups.length === 0) {
    console.log(chalk.yellow('\nNo backups available'))
    console.log(chalk.gray('Backups are created automatically when running sync-tokens'))
    return
  }

  console.log(chalk.blue('\n📦 Available backups:\n'))

  console.log(chalk.gray('┌──────────────┬────────────────────────────┬──────────────┐'))
  console.log(
    chalk.gray('│') +
      ' Version      ' +
      chalk.gray('│') +
      ' Timestamp                  ' +
      chalk.gray('│') +
      ' Size         ' +
      chalk.gray('│')
  )
  console.log(chalk.gray('├──────────────┼────────────────────────────┼──────────────┤'))

  for (const backup of backups) {
    const version = backup.version.padEnd(12)
    const timestamp = backup.date.toLocaleString().padEnd(26)
    const size = `${(backup.size / 1024).toFixed(1)} KB`.padEnd(12)

    console.log(
      chalk.gray('│') +
        ` ${version} ` +
        chalk.gray('│') +
        ` ${timestamp} ` +
        chalk.gray('│') +
        ` ${size} ` +
        chalk.gray('│')
    )
  }

  console.log(chalk.gray('└──────────────┴────────────────────────────┴──────────────┘'))

  console.log(chalk.gray('\nUsage:'))
  console.log(chalk.gray('  npm run rollback-tokens -- --version=0.1.0'))
  console.log(chalk.gray('  npm run rollback-tokens -- --latest'))
  console.log('')
}

/**
 * Print help
 */
function printHelp(): void {
  console.log(`
${chalk.blue('Token Rollback - Restore Previous Token Versions')}

${chalk.yellow('Usage:')}
  npm run rollback-tokens [options]

${chalk.yellow('Options:')}
  --list, -l        List available backups
  --version=X.X.X   Rollback to specific version
  --latest          Rollback to most recent backup
  --dry-run         Preview rollback without making changes
  --help            Show this help message

${chalk.yellow('Examples:')}
  npm run rollback-tokens -- --list
  npm run rollback-tokens -- --version=0.1.0
  npm run rollback-tokens -- --latest --dry-run
`)
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  const options = parseArgs()

  // Show help
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    printHelp()
    process.exit(0)
  }

  console.log(chalk.blue('\n🔄 Token Rollback\n'))

  // List backups
  if (options.list) {
    listBackups()
    process.exit(0)
  }

  const backups = getBackups()

  if (backups.length === 0) {
    console.log(chalk.yellow('No backups available to rollback to'))
    console.log(chalk.gray('Run sync-tokens first to create backups'))
    process.exit(1)
  }

  // Find target backup
  let targetBackup: BackupInfo | undefined

  if (options.latest) {
    targetBackup = backups[0]
  } else if (options.version) {
    targetBackup = backups.find(b => b.version === options.version)

    if (!targetBackup) {
      console.error(chalk.red(`Version ${options.version} not found`))
      console.log(chalk.gray('Available versions:'))
      for (const backup of backups.slice(0, 5)) {
        console.log(chalk.gray(`  - ${backup.version}`))
      }
      process.exit(1)
    }
  } else if (options.timestamp) {
    targetBackup = backups.find(b => b.timestamp.includes(options.timestamp!))
  }

  if (!targetBackup) {
    console.log(chalk.yellow('No rollback target specified'))
    printHelp()
    process.exit(1)
  }

  // Confirm rollback
  const spinner = ora(`Rolling back to version ${targetBackup.version}...`).start()

  try {
    await rollbackTo(targetBackup, options.dryRun || false)
    spinner.succeed('Rollback complete')

    if (!options.dryRun) {
      console.log(chalk.gray('\nNext steps:'))
      console.log(chalk.gray('  1. Run: npm run build-tokens'))
      console.log(chalk.gray('  2. Test: npm run storybook'))
      console.log(chalk.gray('  3. Review changes and commit'))
    }
  } catch (error) {
    spinner.fail('Rollback failed')
    console.error(chalk.red((error as Error).message))
    process.exit(1)
  }
}

// Run if executed directly
main().catch(error => {
  console.error(chalk.red('\nError:'), error.message)
  process.exit(1)
})

export { getBackups, BackupInfo }
