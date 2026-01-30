#!/usr/bin/env tsx
/**
 * Token Sync Orchestrator
 * Main command that orchestrates the complete token synchronization flow
 *
 * Features:
 * - Retry logic for flaky network operations
 * - Backup creation with version history
 * - Interactive mode for selective syncing
 * - Notification support
 * - Performance metrics tracking
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'

// Paths
const TOKENS_DIR = path.join(process.cwd(), 'tokens')
const TOKENS_FILE = path.join(TOKENS_DIR, 'figma-tokens.json')
const BACKUP_FILE = path.join(TOKENS_DIR, '.figma-tokens.prev.json')
const METRICS_FILE = path.join(TOKENS_DIR, '.metrics.json')

interface SyncOptions {
  dryRun: boolean
  noVersion: boolean
  force: boolean
  skipValidation: boolean
  skipDocs: boolean
  tagOnly: boolean
  skipFigma: boolean
  useMCP: boolean
  interactive: boolean
  notify: boolean
  retries: number
}

interface SyncMetrics {
  timestamp: string
  duration: number
  figmaApiCalls: number
  tokensProcessed: number
  filesGenerated: number
  success: boolean
  error?: string
}

/**
 * Parse command line arguments
 */
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const normalizedArgs = args.map(arg => (arg.startsWith('---') ? `--${arg.slice(3)}` : arg))

  // Extract retry count if specified
  let retries = 3 // default
  const retriesArg = normalizedArgs.find(a => a.startsWith('--retries='))
  if (retriesArg) {
    retries = parseInt(retriesArg.split('=')[1], 10) || 3
  }

  return {
    dryRun: normalizedArgs.includes('--dry-run'),
    noVersion: normalizedArgs.includes('--no-version'),
    force: normalizedArgs.includes('--force'),
    skipValidation: normalizedArgs.includes('--skip-validation'),
    skipDocs: normalizedArgs.includes('--skip-docs'),
    tagOnly: normalizedArgs.includes('--tag-only'),
    skipFigma: normalizedArgs.includes('--skip-figma'),
    useMCP: normalizedArgs.includes('--mcp'),
    interactive: normalizedArgs.includes('--interactive') || normalizedArgs.includes('-i'),
    notify: normalizedArgs.includes('--notify'),
    retries,
  }
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Run with retry logic
 */
async function runWithRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries: number; delay: number; operation: string }
): Promise<T> {
  let lastError: Error = new Error('Unknown error')

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < options.maxRetries) {
        console.log(
          chalk.yellow(
            `  ⚠ ${options.operation} failed (attempt ${attempt}/${options.maxRetries}), retrying in ${options.delay / 1000}s...`
          )
        )
        await sleep(options.delay)
      }
    }
  }

  throw lastError
}

/**
 * Run a script using tsx with retry support
 */
function runScript(
  scriptPath: string,
  args: string[] = [],
  options: { retries?: number; retryDelay?: number } = {}
): Promise<{ code: number; output: string }> {
  const execute = (): Promise<{ code: number; output: string }> => {
    return new Promise((resolve, reject) => {
      const fullPath = path.join(process.cwd(), scriptPath)
      let output = ''

      const proc = spawn('npx', ['tsx', fullPath, ...args], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ['inherit', 'pipe', 'pipe'],
      })

      proc.stdout?.on('data', data => {
        output += data.toString()
        process.stdout.write(data)
      })

      proc.stderr?.on('data', data => {
        output += data.toString()
        process.stderr.write(data)
      })

      proc.on('close', code => {
        if (code !== 0 && options.retries) {
          reject(new Error(`Script exited with code ${code}`))
        } else {
          resolve({ code: code || 0, output })
        }
      })

      proc.on('error', err => {
        reject(err)
      })
    })
  }

  if (options.retries && options.retries > 1) {
    return runWithRetry(execute, {
      maxRetries: options.retries,
      delay: options.retryDelay || 2000,
      operation: path.basename(scriptPath),
    }).catch(() => ({ code: 1, output: 'Failed after retries' }))
  }

  return execute().catch(() => ({ code: 1, output: 'Failed to run script' }))
}

/**
 * Track sync metrics
 */
function trackMetrics(metrics: Partial<SyncMetrics>): void {
  try {
    let history: SyncMetrics[] = []

    if (fs.existsSync(METRICS_FILE)) {
      history = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf-8'))
    }

    history.push({
      timestamp: new Date().toISOString(),
      duration: 0,
      figmaApiCalls: 1,
      tokensProcessed: 0,
      filesGenerated: 5,
      success: true,
      ...metrics,
    })

    // Keep last 100 entries
    if (history.length > 100) {
      history = history.slice(-100)
    }

    fs.writeFileSync(METRICS_FILE, JSON.stringify(history, null, 2))
  } catch {
    // Ignore metrics errors
  }
}

/**
 * Create versioned backup
 */
async function createVersionedBackup(version: string): Promise<void> {
  try {
    const { createBackup } = await import('./rollback-tokens.js')
    createBackup(version)
  } catch {
    // Fallback to simple backup
    if (fs.existsSync(TOKENS_FILE)) {
      fs.copyFileSync(TOKENS_FILE, BACKUP_FILE)
    }
  }
}

/**
 * Run Style Dictionary build
 */
async function runStyleDictionary(): Promise<boolean> {
  const spinner = ora('Running Style Dictionary...').start()

  try {
    const { buildTokens } = await import('../style-dictionary.config.js')
    await buildTokens()
    spinner.succeed('Style Dictionary build complete')
    return true
  } catch (error) {
    spinner.fail('Style Dictionary build failed')
    console.error(chalk.red((error as Error).message))
    return false
  }
}

/**
 * Check if tokens have changed
 */
function tokensHaveChanged(): boolean {
  if (!fs.existsSync(TOKENS_FILE)) {
    return true
  }

  if (!fs.existsSync(BACKUP_FILE)) {
    return true
  }

  const current = fs.readFileSync(TOKENS_FILE, 'utf-8')
  const previous = fs.readFileSync(BACKUP_FILE, 'utf-8')

  // Compare ignoring metadata
  try {
    const currentJson = JSON.parse(current)
    const previousJson = JSON.parse(previous)

    delete currentJson.$metadata
    delete previousJson.$metadata

    return JSON.stringify(currentJson) !== JSON.stringify(previousJson)
  } catch {
    return current !== previous
  }
}

/**
 * Create git commit and tag
 */
async function createGitTag(version: string): Promise<void> {
  const spinner = ora('Creating git tag...').start()

  try {
    const { execSync } = await import('child_process')

    execSync(`git tag -a v${version} -m "Design tokens v${version}"`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    })

    spinner.succeed(`Created tag: v${version}`)
  } catch (error) {
    spinner.warn('Git tag skipped (already exists or not a git repo)')
  }
}

/**
 * Interactive mode - prompt user for confirmation
 */
async function runInteractiveMode(): Promise<{ proceed: boolean; options: Partial<SyncOptions> }> {
  try {
    const { confirm, checkbox } = await import('@inquirer/prompts')

    console.log(chalk.blue('\n🎨 Interactive Token Sync\n'))

    // Check what would change
    const hasExistingTokens = fs.existsSync(TOKENS_FILE)

    if (hasExistingTokens) {
      console.log(chalk.gray('Current tokens file found. Checking for changes...\n'))
    }

    const steps = await checkbox({
      message: 'Select sync steps to run:',
      choices: [
        { name: 'Fetch tokens from Figma', value: 'figma', checked: true },
        { name: 'Transform with Style Dictionary', value: 'transform', checked: true },
        { name: 'Validate tokens', value: 'validate', checked: true },
        { name: 'Validate components', value: 'components', checked: true },
        { name: 'Update documentation', value: 'docs', checked: true },
        { name: 'Bump version', value: 'version', checked: true },
        { name: 'Create git tag', value: 'tag', checked: false },
      ],
    })

    const proceed = await confirm({
      message: 'Proceed with selected steps?',
      default: true,
    })

    return {
      proceed,
      options: {
        skipFigma: !steps.includes('figma'),
        skipValidation: !steps.includes('components'),
        skipDocs: !steps.includes('docs'),
        noVersion: !steps.includes('version'),
      },
    }
  } catch {
    // Fallback if inquirer fails
    return { proceed: true, options: {} }
  }
}

/**
 * Send notifications
 */
async function sendNotifications(success: boolean, message: string): Promise<void> {
  try {
    const { sendNotification } = await import('./notify.js')
    await sendNotification({
      success,
      message,
      channel: 'slack', // or 'discord', 'email'
    })
  } catch {
    // Notifications are optional
  }
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
${chalk.blue('Token Sync - Design Tokens Synchronization Tool')}

${chalk.yellow('Usage:')}
  npm run sync-tokens [options]

${chalk.yellow('Options:')}
  --dry-run         Simulate without making changes
  --no-version      Skip version bump
  --force           Sync even if no changes detected
  --skip-validation Skip component validation
  --skip-docs       Skip documentation update
  --skip-figma      Skip Figma fetch, use existing tokens/figma-tokens.json
  --mcp             Use Figma Console MCP instead of REST API
  --tag-only        Skip version bump and tag current version
  --interactive, -i Run in interactive mode (select steps)
  --notify          Send notifications on completion
  --retries=N       Number of retries for network operations (default: 3)
  --help            Show this help message

${chalk.yellow('Examples:')}
  npm run sync-tokens                    # Full sync (REST API)
  npm run sync-tokens --mcp              # Sync using Figma Console MCP
  npm run sync-tokens --dry-run          # Preview changes
  npm run sync-tokens --no-version       # Sync without version bump
  npm run sync-tokens --interactive      # Interactive step selection
  npm run sync-tokens --retries=5        # More retries for flaky connections

${chalk.yellow('Environment Variables:')}
  FIGMA_ACCESS_TOKEN   Your Figma Personal Access Token
  FIGMA_FILE_KEY       The Figma file key (from URL)
  SLACK_WEBHOOK_URL    Slack webhook for notifications (optional)
  DISCORD_WEBHOOK_URL  Discord webhook for notifications (optional)

${chalk.gray('See .env.example for setup instructions.')}
`)
}

/**
 * Main orchestration function
 */
async function main(): Promise<void> {
  const startTime = Date.now()
  let options = parseArgs()

  // Show help
  if (process.argv.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  // Interactive mode
  if (options.interactive) {
    const interactiveResult = await runInteractiveMode()
    if (!interactiveResult.proceed) {
      console.log(chalk.yellow('\nSync cancelled by user'))
      process.exit(0)
    }
    options = { ...options, ...interactiveResult.options }
  }

  console.log(chalk.blue.bold('\n🎨 Syncing design tokens from Figma...\n'))

  if (options.dryRun) {
    console.log(chalk.yellow('Running in dry-run mode - no changes will be made\n'))
  }

  let syncSuccess = true
  let errorMessage = ''

  try {
    // Step 1: Fetch tokens from Figma (or skip)
    if (options.skipFigma) {
      console.log(chalk.gray('Step 1/7: Skipping Figma fetch (using existing tokens)'))

      if (!fs.existsSync(TOKENS_FILE)) {
        console.error(chalk.red('Error: tokens/figma-tokens.json not found'))
        console.error(
          chalk.yellow('Run `npm run convert-tokens` first if you have tokens/tokens.json')
        )
        process.exit(1)
      }
    } else {
      console.log(chalk.cyan('Step 1/7: Fetching tokens from Figma'))

      // Choose between REST API and MCP
      const scriptPath = options.useMCP
        ? 'scripts/sync-figma-tokens-mcp.ts'
        : 'scripts/sync-figma-tokens.ts'
      const fetchArgs = options.dryRun ? ['--dry-run'] : []

      if (options.useMCP) {
        console.log(chalk.gray('  Using Figma Console MCP method'))
      }

      const fetchResult = await runScript(scriptPath, fetchArgs, {
        retries: options.retries,
        retryDelay: 2000,
      })

      if (fetchResult.code !== 0) {
        throw new Error('Failed to fetch tokens from Figma')
      }
    }

    // Check if tokens changed (skip remaining steps if no changes)
    if (!options.force && !tokensHaveChanged()) {
      console.log(chalk.yellow('\nNo changes detected in tokens. Use --force to sync anyway.'))
      process.exit(0)
    }

    // Step 2: Create versioned backup
    console.log(chalk.cyan('\nStep 2/7: Creating backup'))

    if (!options.dryRun) {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
      )
      await createVersionedBackup(packageJson.version || '0.0.0')
      console.log(chalk.gray('  Backup created'))
    } else {
      console.log(chalk.gray('  [Dry run] Would create backup'))
    }

    // Step 3: Transform tokens with Style Dictionary
    console.log(chalk.cyan('\nStep 3/7: Transforming tokens'))

    if (!options.dryRun) {
      // Check if tokens file exists before running Style Dictionary
      if (!fs.existsSync(TOKENS_FILE)) {
        throw new Error('Tokens file not found. Figma fetch may have failed.')
      }

      const sdSuccess = await runStyleDictionary()
      if (!sdSuccess) {
        throw new Error('Style Dictionary transformation failed')
      }
    } else {
      console.log(chalk.gray('  [Dry run] Would transform tokens with Style Dictionary'))
    }

    // Step 4: Validate tokens
    console.log(chalk.cyan('\nStep 4/7: Validating tokens'))

    if (!options.dryRun) {
      const tokenValidateResult = await runScript('scripts/validate-tokens.ts')

      if (tokenValidateResult.code !== 0) {
        console.error(chalk.yellow('\n⚠ Token validation found issues (see above)'))
      }
    } else {
      console.log(chalk.gray('  [Dry run] Would validate tokens'))
    }

    // Step 5: Validate components
    if (!options.skipValidation) {
      console.log(chalk.cyan('\nStep 5/7: Validating components'))

      if (!options.dryRun) {
        const validateResult = await runScript('scripts/validate-components.ts')

        if (validateResult.code !== 0) {
          console.error(chalk.yellow('\n⚠ Component validation found issues (see above)'))
          // Don't exit - warnings shouldn't block the sync
        }
      } else {
        console.log(chalk.gray('  [Dry run] Would validate components'))
      }
    } else {
      console.log(chalk.gray('\nStep 5/7: Skipping component validation'))
    }

    // Step 6: Update documentation
    if (!options.skipDocs) {
      console.log(chalk.cyan('\nStep 6/7: Updating documentation'))

      if (!options.dryRun) {
        const docsResult = await runScript('scripts/update-docs.ts')

        if (docsResult.code !== 0) {
          console.error(chalk.yellow('\n⚠ Documentation update had issues'))
        }
      } else {
        console.log(chalk.gray('  [Dry run] Would update documentation'))
      }
    } else {
      console.log(chalk.gray('\nStep 6/7: Skipping documentation update'))
    }

    // Step 7: Bump version and git tag
    let newVersion = ''

    if (options.tagOnly) {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
      )
      newVersion = packageJson.version
      console.log(chalk.gray(`\nStep 7/7: Skipping version bump (tag-only for v${newVersion})`))
    } else if (!options.noVersion) {
      console.log(chalk.cyan('\nStep 7/7: Bumping version & Git operations'))

      if (!options.dryRun) {
        await runScript('scripts/bump-version.ts')

        // Extract version from package.json
        const packageJson = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
        )
        newVersion = packageJson.version

        // Create git tag
        await createGitTag(newVersion)

        // Generate change report
        await runScript('scripts/generate-report.ts').catch(() => {})
      } else {
        console.log(chalk.gray('  [Dry run] Would bump version and create git tag'))
      }
    } else {
      console.log(chalk.gray('\nStep 7/7: Skipping version bump'))
    }

    // Summary
    console.log(chalk.green.bold('\n✅ Token sync complete!\n'))

    if (!options.dryRun) {
      console.log('Next steps:')
      console.log(chalk.gray('  1. Review changes: git diff src/tokens/'))
      console.log(chalk.gray('  2. Test locally: npm run storybook'))
      console.log(chalk.gray('  3. Push to GitHub: git push origin main --tags'))
      console.log(chalk.gray('  4. Rollback if needed: npm run rollback-tokens -- --list'))
    }
  } catch (error) {
    syncSuccess = false
    errorMessage = (error as Error).message
    console.error(chalk.red('\n✗ Sync failed:'), errorMessage)
  }

  // Track metrics
  const duration = Date.now() - startTime
  trackMetrics({
    duration,
    success: syncSuccess,
    error: errorMessage || undefined,
  })

  // Send notifications
  if (options.notify) {
    const message = syncSuccess
      ? `Token sync completed successfully in ${(duration / 1000).toFixed(1)}s`
      : `Token sync failed: ${errorMessage}`
    await sendNotifications(syncSuccess, message)
  }

  console.log(chalk.gray(`\nCompleted in ${(duration / 1000).toFixed(1)}s\n`))

  if (!syncSuccess) {
    process.exit(1)
  }
}

// Run
main().catch(error => {
  console.error(chalk.red('\n✗ Sync failed:'), error.message)
  process.exit(1)
})
