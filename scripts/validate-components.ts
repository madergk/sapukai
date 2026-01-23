/**
 * Component Validation Script
 * Validates that components are compatible with updated tokens
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

interface ValidationResult {
  file: string
  issues: ValidationIssue[]
}

interface ValidationIssue {
  type: 'warning' | 'error'
  message: string
  line?: number
  suggestion?: string
}

interface ValidationReport {
  totalFiles: number
  filesWithIssues: number
  warnings: number
  errors: number
  results: ValidationResult[]
}

const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components')
const TOKENS_FILE = path.join(process.cwd(), 'tokens', 'figma-tokens.json')
const BACKUP_FILE = path.join(process.cwd(), 'tokens', '.figma-tokens.prev.json')

/**
 * Get all TypeScript/React component files
 */
function getComponentFiles(dir: string): string[] {
  const files: string[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const items = fs.readdirSync(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files.push(...getComponentFiles(fullPath))
    } else if (
      item.isFile() &&
      /\.(tsx?|jsx?)$/.test(item.name) &&
      !item.name.includes('.stories.') &&
      !item.name.includes('.test.')
    ) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Extract token keys from tokens JSON
 */
function extractTokenKeys(tokens: any, prefix = ''): Set<string> {
  const keys = new Set<string>()

  for (const [key, value] of Object.entries(tokens)) {
    const currentPath = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object') {
      if ('$value' in value) {
        // This is a token
        keys.add(currentPath)
      } else {
        // This is a nested object
        const nestedKeys = extractTokenKeys(value, currentPath)
        for (const nestedKey of nestedKeys) {
          keys.add(nestedKey)
        }
      }
    }
  }

  return keys
}

/**
 * Find deprecated tokens (removed or renamed)
 */
function findDeprecatedTokens(): { removed: Set<string>; renamed: Map<string, string> } {
  const removed = new Set<string>()
  const renamed = new Map<string, string>()

  if (!fs.existsSync(TOKENS_FILE) || !fs.existsSync(BACKUP_FILE)) {
    return { removed, renamed }
  }

  const newTokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
  const oldTokens = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'))

  const newKeys = extractTokenKeys(newTokens)
  const oldKeys = extractTokenKeys(oldTokens)

  // Find removed tokens
  for (const key of oldKeys) {
    if (!newKeys.has(key)) {
      removed.add(key)
    }
  }

  // TODO: Implement rename detection based on similar values
  // This would require comparing token values to suggest renames

  return { removed, renamed }
}

/**
 * Validate a single component file
 */
function validateFile(
  filePath: string,
  deprecatedTokens: { removed: Set<string>; renamed: Map<string, string> }
): ValidationResult {
  const result: ValidationResult = {
    file: path.relative(process.cwd(), filePath),
    issues: [],
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  // Check for hardcoded color values
  const hardcodedColorPattern = /#[0-9a-fA-F]{3,8}\b|rgb\(|rgba\(|hsl\(|hsla\(/g

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return
    }

    // Check for hardcoded colors in styles (not in imports or comments)
    const matches = line.match(hardcodedColorPattern)
    if (matches && !line.includes('import') && !line.includes('from')) {
      // Allow certain common colors
      const allowedColors = ['#ffffff', '#000000', '#fff', '#000']
      for (const match of matches) {
        if (!allowedColors.includes(match.toLowerCase())) {
          result.issues.push({
            type: 'warning',
            message: `Hardcoded color value found: ${match}`,
            line: index + 1,
            suggestion: 'Consider using a design token instead',
          })
        }
      }
    }
  })

  // Check for deprecated token usage
  for (const removedToken of deprecatedTokens.removed) {
    const tokenParts = removedToken.split('.')
    const lastPart = tokenParts[tokenParts.length - 1]

    // Search for potential usage of removed tokens
    const tokenPattern = new RegExp(`\\b${lastPart}\\b`, 'i')

    lines.forEach((line, index) => {
      if (tokenPattern.test(line) && !line.trim().startsWith('//')) {
        result.issues.push({
          type: 'error',
          message: `Potentially using removed token: ${removedToken}`,
          line: index + 1,
          suggestion:
            'This token was removed in the latest update. Please replace with an existing token.',
        })
      }
    })
  }

  // Check for renamed tokens
  for (const [oldName, newName] of deprecatedTokens.renamed) {
    const oldParts = oldName.split('.')
    const lastOldPart = oldParts[oldParts.length - 1]

    const tokenPattern = new RegExp(`\\b${lastOldPart}\\b`, 'i')

    lines.forEach((line, index) => {
      if (tokenPattern.test(line) && !line.trim().startsWith('//')) {
        result.issues.push({
          type: 'warning',
          message: `Token was renamed: ${oldName} → ${newName}`,
          line: index + 1,
          suggestion: `Update to use the new token name: ${newName}`,
        })
      }
    })
  }

  return result
}

/**
 * Validate all components
 */
async function validateComponents(): Promise<ValidationReport> {
  const spinner = ora('Scanning components...').start()

  const componentFiles = getComponentFiles(COMPONENTS_DIR)
  spinner.text = `Found ${componentFiles.length} component files`

  const deprecatedTokens = findDeprecatedTokens()

  const results: ValidationResult[] = []
  let warnings = 0
  let errors = 0

  for (const file of componentFiles) {
    const result = validateFile(file, deprecatedTokens)

    if (result.issues.length > 0) {
      results.push(result)
      for (const issue of result.issues) {
        if (issue.type === 'warning') warnings++
        if (issue.type === 'error') errors++
      }
    }
  }

  spinner.succeed(`Validated ${componentFiles.length} components`)

  return {
    totalFiles: componentFiles.length,
    filesWithIssues: results.length,
    warnings,
    errors,
    results,
  }
}

/**
 * Print validation report
 */
function printReport(report: ValidationReport): void {
  console.log('')

  if (report.results.length === 0) {
    console.log(chalk.green('✓ All components validated successfully'))
    console.log(chalk.gray(`  ${report.totalFiles} files checked, no issues found`))
    return
  }

  console.log(chalk.yellow(`⚠ Found issues in ${report.filesWithIssues} files:`))
  console.log('')

  for (const result of report.results) {
    console.log(chalk.cyan(`  ${result.file}`))

    for (const issue of result.issues) {
      const icon = issue.type === 'error' ? chalk.red('✗') : chalk.yellow('⚠')
      const lineInfo = issue.line ? chalk.gray(`:${issue.line}`) : ''
      console.log(`    ${icon} ${issue.message}${lineInfo}`)

      if (issue.suggestion) {
        console.log(chalk.gray(`      → ${issue.suggestion}`))
      }
    }
    console.log('')
  }

  console.log(chalk.gray('Summary:'))
  console.log(chalk.yellow(`  • ${report.warnings} warnings`))
  console.log(chalk.red(`  • ${report.errors} errors`))
}

/**
 * Main execution
 */
async function main(): Promise<ValidationReport> {
  console.log(chalk.blue('\n🔍 Validating components...\n'))

  const report = await validateComponents()
  printReport(report)

  // Exit with error code if there are errors
  if (report.errors > 0) {
    process.exit(1)
  }

  return report
}

// Run if executed directly
if (process.argv[1]?.includes('validate-components')) {
  main().catch(error => {
    console.error(chalk.red('\nError:'), error.message)
    process.exit(1)
  })
}

export { main as validateComponents, ValidationReport }
