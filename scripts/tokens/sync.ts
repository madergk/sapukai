#!/usr/bin/env tsx
/**
 * Consolidated tokens sync:
 * 1) Fetch variables from Figma (API/MCP/Tokens Studio/local)
 * 2) Save JSON and CSS
 * 3) Run Style Dictionary build (DTCG outputs)
 */

import { spawn } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'
import { DEFAULT_SOURCE, TokenSource } from './config'

interface SyncOptions {
  source: TokenSource
  dryRun: boolean
  skipStyleDictionary: boolean
}

function parseArgs(): SyncOptions {
  const args = process.argv.slice(2)
  const sourceArg = args.find(arg => arg.startsWith('--source='))
  const source = (sourceArg?.split('=')[1] as TokenSource) || DEFAULT_SOURCE

  return {
    source,
    dryRun: args.includes('--dry-run'),
    skipStyleDictionary: args.includes('--skip-style-dictionary'),
  }
}

function runScript(scriptPath: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npx', ['tsx', scriptPath, ...args], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })

    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`Script failed: ${scriptPath}`))
    })

    proc.on('error', err => reject(err))
  })
}

async function runSource(source: TokenSource, dryRun: boolean): Promise<void> {
  const args = dryRun ? ['--dry-run'] : []

  switch (source) {
    case 'mcp':
      await runScript('scripts/tokens/sources/figma-mcp.ts', args)
      return
    case 'api':
      await runScript('scripts/tokens/sources/figma-api.ts', args)
      return
    case 'tokens-studio':
      await runScript('scripts/tokens/sources/tokens-studio.ts', args)
      return
    case 'local':
      await runScript('scripts/tokens/sources/local.ts', args)
      return
    default:
      throw new Error(`Unknown source: ${source}`)
  }
}

async function runStyleDictionary(dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log(chalk.gray('Dry run: skipping Style Dictionary build'))
    return
  }

  const { buildTokens } = await import('../../style-dictionary.config.js')
  await buildTokens()
}

async function main(): Promise<void> {
  const options = parseArgs()

  console.log(chalk.blue.bold('\n🎨 Token Sync (Consolidated)\n'))
  console.log(chalk.gray(`Source: ${options.source}`))
  if (options.dryRun) console.log(chalk.yellow('Mode: dry-run'))

  const fetchSpinner = ora('Fetching tokens...').start()
  try {
    await runSource(options.source, options.dryRun)
    fetchSpinner.succeed('Tokens fetched')
  } catch (error) {
    fetchSpinner.fail('Token fetch failed')
    throw error
  }

  if (!options.skipStyleDictionary) {
    const buildSpinner = ora('Running Style Dictionary...').start()
    try {
      await runStyleDictionary(options.dryRun)
      buildSpinner.succeed('Style Dictionary build complete')
    } catch (error) {
      buildSpinner.fail('Style Dictionary build failed')
      throw error
    }
  }

  console.log(chalk.green('\n✓ Token sync complete\n'))
}

if (process.argv[1]?.includes('tokens/sync')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), (error as Error).message)
    process.exit(1)
  })
}

export { main }
