#!/usr/bin/env tsx
/**
 * Publish tokens update:
 * 1) Create branch tokens-update-DD-MM-YY
 * 2) Generate commit message from latest report
 * 3) Commit and push to origin
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'
import { REPORTS_DIR } from './config'

interface ChangeReport {
  version: string
  timestamp: string
  summary: {
    added: number
    modified: number
    removed: number
    total: number
  }
}

function getLatestReport(): { report: ChangeReport; filename: string } {
  if (!fs.existsSync(REPORTS_DIR)) {
    throw new Error(`Reports directory not found: ${REPORTS_DIR}`)
  }

  const files = fs
    .readdirSync(REPORTS_DIR)
    .filter(file => file.startsWith('report-') && file.endsWith('.json'))
    .map(file => ({ file, path: path.join(REPORTS_DIR, file) }))
    .sort((a, b) => fs.statSync(b.path).mtimeMs - fs.statSync(a.path).mtimeMs)

  if (files.length === 0) {
    throw new Error('No report files found in tokens/.reports')
  }

  const latest = files[0]
  const report = JSON.parse(fs.readFileSync(latest.path, 'utf-8')) as ChangeReport
  return { report, filename: latest.file }
}

function formatBranchName(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yy = String(date.getFullYear()).slice(-2)
  return `tokens-update-${dd}-${mm}-${yy}`
}

function buildCommitMessage(
  report: ChangeReport,
  reportFile: string
): { subject: string; body: string } {
  return {
    subject: 'chore(tokens): update design tokens',
    body: [
      `Summary: +${report.summary.added} ~${report.summary.modified} -${report.summary.removed}`,
      `Report: ${reportFile}`,
      `Timestamp: ${report.timestamp}`,
      `Version: ${report.version}`,
    ].join('\n'),
  }
}

function exec(command: string): void {
  execSync(command, { stdio: 'inherit' })
}

async function main(): Promise<void> {
  console.log(chalk.blue.bold('\n🚀 Token Publish (Consolidated)\n'))

  const reportSpinner = ora('Loading latest report...').start()
  const { report, filename } = getLatestReport()
  reportSpinner.succeed(`Using ${filename}`)

  const branchName = formatBranchName()

  const branchSpinner = ora(`Creating branch ${branchName}...`).start()
  exec(`git checkout -b ${branchName}`)
  branchSpinner.succeed(`Checked out ${branchName}`)

  const commitSpinner = ora('Creating commit...').start()
  const message = buildCommitMessage(report, filename)
  exec('git add -A')
  exec(
    `git commit -m "${message.subject.replace(/"/g, '\\"')}" -m "${message.body.replace(
      /"/g,
      '\\"'
    )}"`
  )
  commitSpinner.succeed('Commit created')

  const pushSpinner = ora('Pushing to origin...').start()
  exec(`git push -u origin ${branchName}`)
  pushSpinner.succeed('Branch pushed')

  console.log(chalk.green('\n✓ Publish complete\n'))
}

if (process.argv[1]?.includes('tokens/publish')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), (error as Error).message)
    process.exit(1)
  })
}

export { main }
