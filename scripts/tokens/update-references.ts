#!/usr/bin/env tsx
/**
 * Update token references using a config-driven search/replace.
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { REFERENCE_MAP_PATH } from './config'

interface ReferenceMap {
  include: string[]
  exclude?: string[]
  replacements: Record<string, string>
}

function readReferenceMap(filePath: string): ReferenceMap {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as ReferenceMap
}

function globToRegExp(pattern: string): RegExp {
  const normalized = pattern.replace(/\\/g, '/')
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, '\\$&')
  const withStars = escaped
    .replace(/\*\*/g, '__DOUBLE_STAR__')
    .replace(/\*/g, '[^/]*')
    .replace(/__DOUBLE_STAR__/g, '.*')
  return new RegExp(`^${withStars}$`)
}

function matchesAny(filePath: string, patterns: string[]): boolean {
  const normalized = filePath.replace(/\\/g, '/')
  return patterns.some(pattern => globToRegExp(pattern).test(normalized))
}

function getAllFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

export function updateReferences(configPath = REFERENCE_MAP_PATH): {
  filesTouched: number
  replacementsApplied: number
} {
  const spinner = ora('Updating token references...').start()
  const config = readReferenceMap(configPath)
  const include = config.include || []
  const exclude = config.exclude || []

  const root = process.cwd()
  const allFiles = getAllFiles(root).map(file => path.relative(root, file))
  const targetFiles = allFiles.filter(file => {
    const included = include.length === 0 || matchesAny(file, include)
    const excluded = exclude.length > 0 && matchesAny(file, exclude)
    return included && !excluded
  })

  let filesTouched = 0
  let replacementsApplied = 0

  for (const relativeFile of targetFiles) {
    const filePath = path.join(root, relativeFile)
    const original = fs.readFileSync(filePath, 'utf-8')
    let updated = original

    for (const [from, to] of Object.entries(config.replacements || {})) {
      if (!from || from === to) continue
      if (updated.includes(from)) {
        const beforeCount = updated.split(from).length - 1
        updated = updated.split(from).join(to)
        replacementsApplied += Math.max(beforeCount, 0)
      }
    }

    if (updated !== original) {
      fs.writeFileSync(filePath, updated)
      filesTouched++
    }
  }

  spinner.succeed(
    `References updated in ${chalk.cyan(filesTouched)} files (${chalk.cyan(
      replacementsApplied
    )} replacements)`
  )

  return { filesTouched, replacementsApplied }
}

async function main(): Promise<void> {
  const configArg = process.argv.find(arg => arg.startsWith('--config='))
  const configPath = configArg ? configArg.split('=')[1] : REFERENCE_MAP_PATH

  if (!fs.existsSync(configPath)) {
    console.error(chalk.red(`Reference map not found: ${configPath}`))
    process.exit(1)
  }

  updateReferences(configPath)
}

if (process.argv[1]?.includes('update-references')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), (error as Error).message)
    process.exit(1)
  })
}
