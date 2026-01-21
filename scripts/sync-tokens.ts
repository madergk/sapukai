#!/usr/bin/env tsx
/**
 * Token Sync Orchestrator
 * Main command that orchestrates the complete token synchronization flow
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

interface SyncOptions {
  dryRun: boolean
  noVersion: boolean
  force: boolean
  skipValidation: boolean
  skipDocs: boolean
  tagOnly: boolean
}

/**
 * Parse command line arguments
 */
function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const normalizedArgs = args.map((arg) => (arg.startsWith('---') ? `--${arg.slice(3)}` : arg))
  
  return {
    dryRun: normalizedArgs.includes('--dry-run'),
    noVersion: normalizedArgs.includes('--no-version'),
    force: normalizedArgs.includes('--force'),
    skipValidation: normalizedArgs.includes('--skip-validation'),
    skipDocs: normalizedArgs.includes('--skip-docs'),
    tagOnly: normalizedArgs.includes('--tag-only'),
  }
}

/**
 * Run a script using tsx
 */
function runScript(scriptPath: string, args: string[] = []): Promise<{ code: number; output: string }> {
  return new Promise((resolve) => {
    const fullPath = path.join(process.cwd(), scriptPath)
    let output = ''
    
    const proc = spawn('npx', ['tsx', fullPath, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ['inherit', 'pipe', 'pipe'],
    })

    proc.stdout?.on('data', (data) => {
      output += data.toString()
      process.stdout.write(data)
    })

    proc.stderr?.on('data', (data) => {
      output += data.toString()
      process.stderr.write(data)
    })

    proc.on('close', (code) => {
      resolve({ code: code || 0, output })
    })

    proc.on('error', () => {
      resolve({ code: 1, output: 'Failed to run script' })
    })
  })
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
  --tag-only        Skip version bump and tag current version
  --help            Show this help message

${chalk.yellow('Examples:')}
  npm run sync-tokens                    # Full sync
  npm run sync-tokens --dry-run          # Preview changes
  npm run sync-tokens --no-version       # Sync without version bump

${chalk.yellow('Environment Variables:')}
  FIGMA_ACCESS_TOKEN   Your Figma Personal Access Token
  FIGMA_FILE_KEY       The Figma file key (from URL)

${chalk.gray('See .env.example for setup instructions.')}
`)
}

/**
 * Main orchestration function
 */
async function main(): Promise<void> {
  const options = parseArgs()

  // Show help
  if (process.argv.includes('--help')) {
    printHelp()
    process.exit(0)
  }

  console.log(chalk.blue.bold('\n🎨 Syncing design tokens from Figma...\n'))

  if (options.dryRun) {
    console.log(chalk.yellow('Running in dry-run mode - no changes will be made\n'))
  }

  // Step 1: Fetch tokens from Figma
  console.log(chalk.cyan('Step 1/6: Fetching tokens from Figma'))
  const fetchArgs = options.dryRun ? ['--dry-run'] : []
  const fetchResult = await runScript('scripts/sync-figma-tokens.ts', fetchArgs)
  
  if (fetchResult.code !== 0) {
    console.error(chalk.red('\n✗ Failed to fetch tokens from Figma'))
    process.exit(1)
  }

  // Check if tokens changed (skip remaining steps if no changes)
  if (!options.force && !tokensHaveChanged()) {
    console.log(chalk.yellow('\nNo changes detected in tokens. Use --force to sync anyway.'))
    process.exit(0)
  }

  // Step 2: Transform tokens with Style Dictionary
  console.log(chalk.cyan('\nStep 2/6: Transforming tokens'))
  
  if (!options.dryRun) {
    // Check if tokens file exists before running Style Dictionary
    if (!fs.existsSync(TOKENS_FILE)) {
      console.error(chalk.red('Tokens file not found. Figma fetch may have failed.'))
      process.exit(1)
    }

    const sdSuccess = await runStyleDictionary()
    if (!sdSuccess) {
      console.error(chalk.red('\n✗ Style Dictionary transformation failed'))
      process.exit(1)
    }
  } else {
    console.log(chalk.gray('  [Dry run] Would transform tokens with Style Dictionary'))
  }

  // Step 3: Validate components
  if (!options.skipValidation) {
    console.log(chalk.cyan('\nStep 3/6: Validating components'))
    
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
    console.log(chalk.gray('\nStep 3/6: Skipping component validation'))
  }

  // Step 4: Update documentation
  if (!options.skipDocs) {
    console.log(chalk.cyan('\nStep 4/6: Updating documentation'))
    
    if (!options.dryRun) {
      const docsResult = await runScript('scripts/update-docs.ts')
      
      if (docsResult.code !== 0) {
        console.error(chalk.yellow('\n⚠ Documentation update had issues'))
      }
    } else {
      console.log(chalk.gray('  [Dry run] Would update documentation'))
    }
  } else {
    console.log(chalk.gray('\nStep 4/6: Skipping documentation update'))
  }

  // Step 5: Bump version
  let newVersion = ''
  
  if (options.tagOnly) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))
    newVersion = packageJson.version
    console.log(chalk.gray(`\nStep 5/6: Skipping version bump (tag-only for v${newVersion})`))
  } else if (!options.noVersion) {
    console.log(chalk.cyan('\nStep 5/6: Bumping version'))
    
    if (!options.dryRun) {
      const versionResult = await runScript('scripts/bump-version.ts')
      
      // Extract version from package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))
      newVersion = packageJson.version
    } else {
      console.log(chalk.gray('  [Dry run] Would bump patch version'))
    }
  } else {
    console.log(chalk.gray('\nStep 5/6: Skipping version bump'))
  }

  // Step 6: Git tag (only if not dry run and version was bumped)
  console.log(chalk.cyan('\nStep 6/6: Git operations'))
  
  if (!options.dryRun && newVersion && !options.noVersion) {
    await createGitTag(newVersion)
  } else if (options.dryRun) {
    console.log(chalk.gray('  [Dry run] Would create git tag'))
  } else {
    console.log(chalk.gray('  Skipping git tag (no version bump)'))
  }

  // Summary
  console.log(chalk.green.bold('\n✅ Token sync complete!\n'))

  if (!options.dryRun) {
    console.log('Next steps:')
    console.log(chalk.gray('  1. Review changes: git diff src/tokens/'))
    console.log(chalk.gray('  2. Test locally: npm run storybook'))
    console.log(chalk.gray('  3. Push to GitHub: git push origin main --tags'))
  }

  console.log('')
}

// Run
main().catch((error) => {
  console.error(chalk.red('\n✗ Sync failed:'), error.message)
  process.exit(1)
})
