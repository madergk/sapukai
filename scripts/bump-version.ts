/**
 * Version Bump Script
 * Handles semantic versioning and changelog generation
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

const PACKAGE_JSON = path.join(process.cwd(), 'package.json')
const CHANGELOG_FILE = path.join(process.cwd(), 'CHANGELOG.md')
const TOKENS_FILE = path.join(process.cwd(), 'tokens', 'figma-tokens.json')
const BACKUP_FILE = path.join(process.cwd(), 'tokens', '.figma-tokens.prev.json')

type VersionBumpType = 'patch' | 'minor' | 'major'

interface TokenChanges {
  added: string[]
  modified: string[]
  removed: string[]
}

interface VersionInfo {
  previous: string
  current: string
  bumpType: VersionBumpType
}

/**
 * Parse semantic version string
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const [major, minor, patch] = version.replace(/^v/, '').split('.').map(Number)
  return { major: major || 0, minor: minor || 0, patch: patch || 0 }
}

/**
 * Bump version based on type
 */
function bumpVersion(version: string, type: VersionBumpType): string {
  const { major, minor, patch } = parseVersion(version)

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`
  }
}

/**
 * Flatten tokens for comparison
 */
function flattenTokens(obj: Record<string, any>, prefix = ''): Map<string, any> {
  const result = new Map<string, any>()

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object') {
      if ('$value' in value) {
        result.set(currentPath, value.$value)
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

/**
 * Detect changes between old and new tokens
 */
function detectChanges(): TokenChanges {
  const changes: TokenChanges = {
    added: [],
    modified: [],
    removed: [],
  }

  if (!fs.existsSync(TOKENS_FILE)) {
    return changes
  }

  const newTokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
  const newFlat = flattenTokens(newTokens)

  if (!fs.existsSync(BACKUP_FILE)) {
    // All tokens are new
    changes.added = Array.from(newFlat.keys())
    return changes
  }

  const oldTokens = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'))
  const oldFlat = flattenTokens(oldTokens)

  // Find added and modified
  for (const [key, value] of newFlat) {
    if (!oldFlat.has(key)) {
      changes.added.push(key)
    } else if (JSON.stringify(oldFlat.get(key)) !== JSON.stringify(value)) {
      changes.modified.push(key)
    }
  }

  // Find removed
  for (const key of oldFlat.keys()) {
    if (!newFlat.has(key)) {
      changes.removed.push(key)
    }
  }

  return changes
}

/**
 * Determine version bump type based on changes
 */
function determineBumpType(changes: TokenChanges, forceType?: VersionBumpType): VersionBumpType {
  if (forceType) return forceType

  // Removed tokens = potential breaking change (would be major, but defaulting to manual)
  // Added tokens = new feature (would be minor, but defaulting to patch for auto)
  // Modified tokens = patch

  // For automatic versioning, we default to patch
  // Major and minor bumps should be manual decisions
  return 'patch'
}

/**
 * Update package.json version
 */
function updatePackageJson(newVersion: string): void {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'))
  packageJson.version = newVersion
  fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2) + '\n')
}

/**
 * Generate changelog entry
 */
function generateChangelogEntry(version: string, changes: TokenChanges): string {
  const date = new Date().toISOString().split('T')[0]

  let entry = `## [${version}] - ${date}\n\n`

  if (changes.added.length > 0) {
    entry += `### Added\n\n`
    entry += changes.added
      .slice(0, 10)
      .map(t => `- \`${t}\``)
      .join('\n')
    if (changes.added.length > 10) {
      entry += `\n- ...and ${changes.added.length - 10} more tokens`
    }
    entry += '\n\n'
  }

  if (changes.modified.length > 0) {
    entry += `### Changed\n\n`
    entry += changes.modified
      .slice(0, 10)
      .map(t => `- \`${t}\``)
      .join('\n')
    if (changes.modified.length > 10) {
      entry += `\n- ...and ${changes.modified.length - 10} more tokens`
    }
    entry += '\n\n'
  }

  if (changes.removed.length > 0) {
    entry += `### Removed\n\n`
    entry += changes.removed
      .slice(0, 10)
      .map(t => `- \`${t}\``)
      .join('\n')
    if (changes.removed.length > 10) {
      entry += `\n- ...and ${changes.removed.length - 10} more tokens`
    }
    entry += '\n\n'
  }

  if (changes.added.length === 0 && changes.modified.length === 0 && changes.removed.length === 0) {
    entry += `### Synced\n\n- Tokens synced from Figma (no changes detected)\n\n`
  }

  return entry
}

/**
 * Update changelog file
 */
function updateChangelog(entry: string): void {
  let changelog = ''

  if (fs.existsSync(CHANGELOG_FILE)) {
    changelog = fs.readFileSync(CHANGELOG_FILE, 'utf-8')
  } else {
    changelog = `# Changelog

All notable changes to the design tokens will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`
  }

  // Find the position after the header to insert new entry
  const headerEnd = changelog.indexOf('\n## ')

  if (headerEnd === -1) {
    // No existing entries, append to end
    changelog += entry
  } else {
    // Insert before first entry
    changelog = changelog.slice(0, headerEnd + 1) + entry + changelog.slice(headerEnd + 1)
  }

  fs.writeFileSync(CHANGELOG_FILE, changelog)
}

/**
 * Main version bump function
 */
async function bumpVersionMain(
  options: {
    type?: VersionBumpType
    skipChangelog?: boolean
    dryRun?: boolean
  } = {}
): Promise<VersionInfo | null> {
  const spinner = ora('Analyzing changes...').start()

  // Detect changes
  const changes = detectChanges()
  const hasChanges =
    changes.added.length > 0 || changes.modified.length > 0 || changes.removed.length > 0

  if (!hasChanges && !options.dryRun) {
    spinner.info('No token changes detected')
    return null
  }

  // Get current version
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf-8'))
  const currentVersion = packageJson.version || '0.0.0'

  // Determine bump type
  const bumpType = determineBumpType(changes, options.type)
  const newVersion = bumpVersion(currentVersion, bumpType)

  spinner.succeed('Analyzed changes')

  if (options.dryRun) {
    console.log(chalk.yellow('\n[Dry Run] Would bump version:'))
    console.log(`  ${currentVersion} → ${newVersion}`)
    console.log('\nChanges:')
    console.log(chalk.green(`  • ${changes.added.length} tokens added`))
    console.log(chalk.yellow(`  • ${changes.modified.length} tokens modified`))
    console.log(chalk.red(`  • ${changes.removed.length} tokens removed`))
    return { previous: currentVersion, current: newVersion, bumpType }
  }

  // Update package.json
  const updateSpinner = ora('Updating package.json...').start()
  updatePackageJson(newVersion)
  updateSpinner.succeed(
    `Updated version: ${chalk.yellow(currentVersion)} → ${chalk.green(newVersion)}`
  )

  // Update changelog
  if (!options.skipChangelog) {
    const changelogSpinner = ora('Updating CHANGELOG.md...').start()
    const entry = generateChangelogEntry(newVersion, changes)
    updateChangelog(entry)
    changelogSpinner.succeed('Updated CHANGELOG.md')
  }

  return {
    previous: currentVersion,
    current: newVersion,
    bumpType,
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log(chalk.blue('\n📦 Bumping version...\n'))

  // Parse command line arguments
  const args = process.argv.slice(2)
  const options: { type?: VersionBumpType; skipChangelog?: boolean; dryRun?: boolean } = {}

  for (const arg of args) {
    if (arg === '--patch') options.type = 'patch'
    if (arg === '--minor') options.type = 'minor'
    if (arg === '--major') options.type = 'major'
    if (arg === '--no-changelog') options.skipChangelog = true
    if (arg === '--dry-run') options.dryRun = true
  }

  const result = await bumpVersionMain(options)

  if (result) {
    console.log(chalk.green(`\n✓ Version bumped: ${result.previous} → ${result.current}\n`))
  } else {
    console.log(chalk.gray('\nNo version bump needed\n'))
  }
}

// Run if executed directly
if (process.argv[1]?.includes('bump-version')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}

export { bumpVersionMain as bumpVersion, detectChanges, TokenChanges, VersionInfo }
