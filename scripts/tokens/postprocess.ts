#!/usr/bin/env tsx
/**
 * Post-process tokens:
 * 1) Generate diff report
 * 2) Update references (config-driven)
 * 3) Update docs
 * 4) Build Storybook
 */

import { spawn } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'
import { generateReport } from './report.js'
import { updateDocs } from './docs.js'
import { updateReferences } from './update-references.js'
import { REFERENCE_MAP_PATH } from './config'

interface PostprocessOptions {
  referenceMap: string
  skipStorybook: boolean
}

function parseArgs(): PostprocessOptions {
  const args = process.argv.slice(2)
  const configArg = args.find(arg => arg.startsWith('--config='))

  return {
    referenceMap: configArg ? configArg.split('=')[1] : REFERENCE_MAP_PATH,
    skipStorybook: args.includes('--skip-storybook'),
  }
}

function runNpmScript(scriptName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', scriptName], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })

    proc.on('close', code => {
      if (code === 0) resolve()
      else reject(new Error(`npm run ${scriptName} failed`))
    })

    proc.on('error', err => reject(err))
  })
}

async function main(): Promise<void> {
  const options = parseArgs()

  console.log(chalk.blue.bold('\n🧩 Token Postprocess (Consolidated)\n'))

  const reportSpinner = ora('Generating diff report...').start()
  try {
    await generateReport({})
    reportSpinner.succeed('Report generated')
  } catch (error) {
    reportSpinner.fail('Report generation failed')
    throw error
  }

  const refSpinner = ora('Updating references...').start()
  try {
    updateReferences(options.referenceMap)
    refSpinner.succeed('References updated')
  } catch (error) {
    refSpinner.fail('Reference update failed')
    throw error
  }

  const docsSpinner = ora('Updating docs...').start()
  try {
    await updateDocs()
    docsSpinner.succeed('Docs updated')
  } catch (error) {
    docsSpinner.fail('Docs update failed')
    throw error
  }

  if (!options.skipStorybook) {
    const storySpinner = ora('Building Storybook...').start()
    try {
      await runNpmScript('build-storybook')
      storySpinner.succeed('Storybook built')
    } catch (error) {
      storySpinner.fail('Storybook build failed')
      throw error
    }
  } else {
    console.log(chalk.gray('Skipping Storybook build'))
  }

  console.log(chalk.green('\n✓ Postprocess complete\n'))
}

if (process.argv[1]?.includes('tokens/postprocess')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), (error as Error).message)
    process.exit(1)
  })
}

export { main }
