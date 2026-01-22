#!/usr/bin/env tsx
/**
 * Release Script
 * Orchestrates all automated steps needed to release a new version
 *
 * Usage:
 *   npm run release                    # Interactive mode
 *   npm run release -- --patch         # Patch release (0.0.x)
 *   npm run release -- --minor         # Minor release (0.x.0)
 *   npm run release -- --major         # Major release (x.0.0)
 *   npm run release -- --dry-run       # Preview without making changes
 *   npm run release -- --skip-tests    # Skip test step
 *   npm run release -- --skip-push     # Skip git push
 */

import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'

// ============================================
// Types
// ============================================

interface ReleaseOptions {
  type: 'patch' | 'minor' | 'major'
  dryRun: boolean
  skipTests: boolean
  skipPush: boolean
  interactive: boolean
}

interface StepResult {
  success: boolean
  message?: string
  duration?: number
}

// ============================================
// Helpers
// ============================================

function exec(command: string, options: { silent?: boolean } = {}): string {
  try {
    return execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
    })
  } catch (error) {
    throw error
  }
}

function execAsync(
  command: string,
  args: string[] = []
): Promise<{ code: number; output: string }> {
  return new Promise(resolve => {
    let output = ''
    const proc = spawn(command, args, {
      cwd: process.cwd(),
      shell: true,
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
      resolve({ code: code ?? 0, output })
    })
  })
}

function getPackageVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8'))
  return packageJson.version
}

function bumpVersion(type: 'patch' | 'minor' | 'major'): string {
  const current = getPackageVersion()
  const [major, minor, patch] = current.split('.').map(Number)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
  }
}

function updatePackageVersion(newVersion: string): void {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  packageJson.version = newVersion
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
}

function hasUncommittedChanges(): boolean {
  try {
    const result = execSync('git status --porcelain', { encoding: 'utf-8' })
    return result.trim().length > 0
  } catch {
    return true
  }
}

function getCurrentBranch(): string {
  return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
}

// ============================================
// Release Steps
// ============================================

async function stepPreflightChecks(options: ReleaseOptions): Promise<StepResult> {
  const spinner = ora('Running preflight checks...').start()

  try {
    // Check branch
    const branch = getCurrentBranch()
    if (branch !== 'main' && branch !== 'master') {
      spinner.warn(`On branch "${branch}" (not main)`)
    }

    // Check uncommitted changes
    if (hasUncommittedChanges()) {
      spinner.fail('Uncommitted changes detected')
      return { success: false, message: 'Please commit or stash changes before releasing' }
    }

    // Check remote sync
    try {
      exec('git fetch origin', { silent: true })
      const localRef = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim()
      const remoteRef = execSync(`git rev-parse origin/${branch}`, { encoding: 'utf-8' }).trim()

      if (localRef !== remoteRef) {
        spinner.warn('Local branch differs from remote')
      }
    } catch {
      spinner.warn('Could not check remote sync')
    }

    spinner.succeed('Preflight checks passed')
    return { success: true }
  } catch (error) {
    spinner.fail('Preflight checks failed')
    return { success: false, message: (error as Error).message }
  }
}

async function stepValidate(): Promise<StepResult> {
  console.log(chalk.cyan('\n📋 Step 1/7: Validating codebase\n'))

  const start = Date.now()
  const result = await execAsync('npm', ['run', 'validate'])

  if (result.code !== 0) {
    return { success: false, message: 'Validation failed' }
  }

  return { success: true, duration: Date.now() - start }
}

async function stepLint(): Promise<StepResult> {
  console.log(chalk.cyan('\n🔍 Step 2/7: Running linter\n'))

  const start = Date.now()
  const result = await execAsync('npm', ['run', 'lint'])

  // Lint errors are warnings, not blockers
  if (result.code !== 0) {
    console.log(chalk.yellow('  ⚠ Lint warnings found (continuing)'))
  }

  return { success: true, duration: Date.now() - start }
}

async function stepTests(skip: boolean): Promise<StepResult> {
  console.log(chalk.cyan('\n🧪 Step 3/7: Running tests\n'))

  if (skip) {
    console.log(chalk.gray('  Skipped (--skip-tests)'))
    return { success: true }
  }

  const start = Date.now()
  const result = await execAsync('npm', ['run', 'test'])

  if (result.code !== 0) {
    return { success: false, message: 'Tests failed' }
  }

  return { success: true, duration: Date.now() - start }
}

async function stepBuild(): Promise<StepResult> {
  console.log(chalk.cyan('\n🔨 Step 4/7: Building project\n'))

  const start = Date.now()
  const result = await execAsync('npm', ['run', 'build'])

  if (result.code !== 0) {
    return { success: false, message: 'Build failed' }
  }

  return { success: true, duration: Date.now() - start }
}

async function stepBuildStorybook(): Promise<StepResult> {
  console.log(chalk.cyan('\n📚 Step 5/7: Building Storybook\n'))

  const start = Date.now()
  const result = await execAsync('npm', ['run', 'build-storybook'])

  if (result.code !== 0) {
    return { success: false, message: 'Storybook build failed' }
  }

  return { success: true, duration: Date.now() - start }
}

async function stepVersion(options: ReleaseOptions): Promise<StepResult> {
  console.log(chalk.cyan('\n🏷️  Step 6/7: Bumping version\n'))

  const currentVersion = getPackageVersion()
  const newVersion = bumpVersion(options.type)

  console.log(chalk.gray(`  Current: ${currentVersion}`))
  console.log(chalk.green(`  New:     ${newVersion}`))

  if (options.dryRun) {
    console.log(chalk.yellow('  [DRY RUN] Would update version'))
    return { success: true }
  }

  try {
    // Update package.json
    updatePackageVersion(newVersion)
    console.log(chalk.gray('  Updated package.json'))

    // Update CHANGELOG
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    if (fs.existsSync(changelogPath)) {
      const changelog = fs.readFileSync(changelogPath, 'utf-8')
      const date = new Date().toISOString().split('T')[0]
      const newEntry = `## [${newVersion}] - ${date}\n\n### Changed\n- Release ${newVersion}\n\n`

      // Insert after first heading
      const updated = changelog.replace(/(# Changelog\n\n)/, `$1${newEntry}`)
      fs.writeFileSync(changelogPath, updated)
      console.log(chalk.gray('  Updated CHANGELOG.md'))
    }

    // Git commit
    exec('git add package.json CHANGELOG.md', { silent: true })
    exec(`git commit -m "chore(release): v${newVersion}"`, { silent: true })
    console.log(chalk.gray('  Created commit'))

    // Git tag
    exec(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { silent: true })
    console.log(chalk.gray(`  Created tag v${newVersion}`))

    return { success: true }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

async function stepPush(options: ReleaseOptions): Promise<StepResult> {
  console.log(chalk.cyan('\n🚀 Step 7/7: Pushing to remote\n'))

  if (options.skipPush) {
    console.log(chalk.yellow('  Skipped (--skip-push)'))
    console.log(chalk.gray('  Run manually: git push origin main --tags'))
    return { success: true }
  }

  if (options.dryRun) {
    console.log(chalk.yellow('  [DRY RUN] Would push to origin'))
    return { success: true }
  }

  try {
    const branch = getCurrentBranch()
    exec(`git push origin ${branch} --tags`, { silent: true })
    console.log(chalk.green('  Pushed to remote with tags'))
    return { success: true }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

// ============================================
// Main
// ============================================

function parseArgs(): ReleaseOptions {
  const args = process.argv.slice(2)

  let type: 'patch' | 'minor' | 'major' = 'patch'

  if (args.includes('--major')) type = 'major'
  else if (args.includes('--minor')) type = 'minor'
  else if (args.includes('--patch')) type = 'patch'

  return {
    type,
    dryRun: args.includes('--dry-run'),
    skipTests: args.includes('--skip-tests'),
    skipPush: args.includes('--skip-push'),
    interactive: !args.some(a => ['--patch', '--minor', '--major'].includes(a)),
  }
}

async function interactiveMode(): Promise<ReleaseOptions['type']> {
  const { select } = await import('@inquirer/prompts')

  const currentVersion = getPackageVersion()

  const type = await select({
    message: `Current version: ${currentVersion}. Select release type:`,
    choices: [
      { name: `Patch (${bumpVersion('patch')}) - Bug fixes`, value: 'patch' as const },
      { name: `Minor (${bumpVersion('minor')}) - New features`, value: 'minor' as const },
      { name: `Major (${bumpVersion('major')}) - Breaking changes`, value: 'major' as const },
    ],
  })

  return type
}

async function main(): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Sapukai Release Script\n'))
  console.log(chalk.gray('─'.repeat(50)))

  let options = parseArgs()

  // Interactive mode
  if (options.interactive) {
    try {
      options.type = await interactiveMode()
    } catch {
      console.log(chalk.yellow('\nRelease cancelled'))
      process.exit(0)
    }
  }

  const currentVersion = getPackageVersion()
  const newVersion = bumpVersion(options.type)

  console.log('')
  console.log(chalk.white(`  Release type: ${chalk.cyan(options.type)}`))
  console.log(chalk.white(`  Version:      ${currentVersion} → ${chalk.green(newVersion)}`))
  if (options.dryRun) console.log(chalk.yellow('  Mode:         DRY RUN'))
  console.log(chalk.gray('─'.repeat(50)))

  const startTime = Date.now()
  const results: { step: string; result: StepResult }[] = []

  // Preflight
  const preflight = await stepPreflightChecks(options)
  if (!preflight.success) {
    console.error(chalk.red(`\n✗ ${preflight.message}`))
    process.exit(1)
  }

  // Step 1: Validate
  const validate = await stepValidate()
  results.push({ step: 'Validate', result: validate })
  if (!validate.success) {
    console.error(chalk.red(`\n✗ ${validate.message}`))
    process.exit(1)
  }

  // Step 2: Lint
  const lint = await stepLint()
  results.push({ step: 'Lint', result: lint })

  // Step 3: Tests
  const tests = await stepTests(options.skipTests)
  results.push({ step: 'Tests', result: tests })
  if (!tests.success) {
    console.error(chalk.red(`\n✗ ${tests.message}`))
    process.exit(1)
  }

  // Step 4: Build
  const build = await stepBuild()
  results.push({ step: 'Build', result: build })
  if (!build.success) {
    console.error(chalk.red(`\n✗ ${build.message}`))
    process.exit(1)
  }

  // Step 5: Storybook
  const storybook = await stepBuildStorybook()
  results.push({ step: 'Storybook', result: storybook })
  if (!storybook.success) {
    console.error(chalk.red(`\n✗ ${storybook.message}`))
    process.exit(1)
  }

  // Step 6: Version
  const version = await stepVersion(options)
  results.push({ step: 'Version', result: version })
  if (!version.success) {
    console.error(chalk.red(`\n✗ ${version.message}`))
    process.exit(1)
  }

  // Step 7: Push
  const push = await stepPush(options)
  results.push({ step: 'Push', result: push })
  if (!push.success) {
    console.error(chalk.red(`\n✗ ${push.message}`))
    process.exit(1)
  }

  // Summary
  const totalDuration = Date.now() - startTime
  console.log(chalk.gray('\n' + '─'.repeat(50)))
  console.log(chalk.green.bold('\n✓ Release completed successfully!\n'))

  console.log(chalk.white('  Summary:'))
  for (const { step, result } of results) {
    const status = result.success ? chalk.green('✓') : chalk.red('✗')
    const duration = result.duration ? chalk.gray(` (${(result.duration / 1000).toFixed(1)}s)`) : ''
    console.log(`    ${status} ${step}${duration}`)
  }

  console.log(chalk.gray(`\n  Total time: ${(totalDuration / 1000).toFixed(1)}s`))

  if (!options.dryRun && !options.skipPush) {
    console.log(chalk.cyan(`\n  🎉 Version ${newVersion} released!`))
    console.log(chalk.gray(`  Tag: v${newVersion}`))
  }

  console.log('')
}

main().catch(error => {
  console.error(chalk.red('\n✗ Release failed:'), error.message)
  process.exit(1)
})
