#!/usr/bin/env tsx
/**
 * Token Validation Script
 * Validates token schema, naming conventions, and WCAG contrast compliance
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { getContrast, parseToRgba } from 'color2k'

// Paths
const TOKENS_FILE = path.join(process.cwd(), 'tokens', 'figma-tokens.json')

// Types
interface ValidationIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  path?: string
  suggestion?: string
}

interface ValidationReport {
  valid: boolean
  errors: number
  warnings: number
  info: number
  issues: ValidationIssue[]
  timestamp: string
}

interface TokenValue {
  $value: string | number | boolean
  $type?: string
  $description?: string
}

interface TokenGroup {
  [key: string]: TokenValue | TokenGroup
}

interface TokensData {
  $schema?: string
  $metadata?: {
    source: string
    fileKey: string
    extractedAt: string
    version: string
  }
  primitives: TokenGroup
  semantic: {
    light: TokenGroup
    dark: TokenGroup
  }
}

/**
 * Check if value is a token (has $value)
 */
function isToken(obj: unknown): obj is TokenValue {
  return obj !== null && typeof obj === 'object' && '$value' in obj
}

/**
 * Check if a string is a valid hex color
 */
function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)
}

/**
 * Check if value is a token reference
 */
function isTokenReference(value: unknown): boolean {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}')
}

/**
 * Flatten tokens into a map with paths
 */
function flattenTokens(obj: TokenGroup, prefix = ''): Map<string, TokenValue> {
  const tokens = new Map<string, TokenValue>()

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue // Skip metadata keys

    const currentPath = prefix ? `${prefix}.${key}` : key

    if (isToken(value)) {
      tokens.set(currentPath, value)
    } else if (typeof value === 'object' && value !== null) {
      const nested = flattenTokens(value as TokenGroup, currentPath)
      for (const [k, v] of nested) {
        tokens.set(k, v)
      }
    }
  }

  return tokens
}

/**
 * Validate DTCG schema compliance
 */
function validateSchema(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Check required top-level keys
  if (!tokens.primitives) {
    issues.push({
      type: 'error',
      category: 'schema',
      message: 'Missing required "primitives" object',
    })
  }

  if (!tokens.semantic) {
    issues.push({
      type: 'error',
      category: 'schema',
      message: 'Missing required "semantic" object',
    })
  } else {
    if (!tokens.semantic.light) {
      issues.push({
        type: 'warning',
        category: 'schema',
        message: 'Missing "semantic.light" theme',
      })
    }
    if (!tokens.semantic.dark) {
      issues.push({
        type: 'warning',
        category: 'schema',
        message: 'Missing "semantic.dark" theme',
      })
    }
  }

  // Check metadata
  if (!tokens.$metadata) {
    issues.push({
      type: 'info',
      category: 'schema',
      message: 'Missing $metadata object (recommended for tracking)',
      suggestion: 'Add $metadata with source, fileKey, extractedAt, and version',
    })
  }

  // Validate each token
  const allTokens = new Map<string, TokenValue>()

  if (tokens.primitives) {
    const primitives = flattenTokens(tokens.primitives, 'primitives')
    for (const [k, v] of primitives) allTokens.set(k, v)
  }

  if (tokens.semantic?.light) {
    const light = flattenTokens(tokens.semantic.light, 'semantic.light')
    for (const [k, v] of light) allTokens.set(k, v)
  }

  if (tokens.semantic?.dark) {
    const dark = flattenTokens(tokens.semantic.dark, 'semantic.dark')
    for (const [k, v] of dark) allTokens.set(k, v)
  }

  for (const [tokenPath, token] of allTokens) {
    // Check $value exists
    if (token.$value === undefined) {
      issues.push({
        type: 'error',
        category: 'schema',
        message: `Token missing $value`,
        path: tokenPath,
      })
    }

    // Validate $type if present
    const validTypes = [
      'color',
      'dimension',
      'fontFamily',
      'fontWeight',
      'duration',
      'cubicBezier',
      'number',
      'string',
      'boolean',
    ]
    if (token.$type && !validTypes.includes(token.$type)) {
      issues.push({
        type: 'warning',
        category: 'schema',
        message: `Invalid $type: "${token.$type}"`,
        path: tokenPath,
        suggestion: `Valid types: ${validTypes.join(', ')}`,
      })
    }

    // Validate color format
    if (token.$type === 'color' && typeof token.$value === 'string') {
      if (!isTokenReference(token.$value) && !isValidHexColor(token.$value)) {
        issues.push({
          type: 'error',
          category: 'schema',
          message: `Invalid color format: "${token.$value}"`,
          path: tokenPath,
          suggestion: 'Use hex format: #RGB, #RGBA, #RRGGBB, or #RRGGBBAA',
        })
      }
    }
  }

  return issues
}

/**
 * Validate naming conventions
 */
function validateNaming(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  const allTokens = new Map<string, TokenValue>()

  if (tokens.primitives) {
    const primitives = flattenTokens(tokens.primitives, 'primitives')
    for (const [k, v] of primitives) allTokens.set(k, v)
  }

  if (tokens.semantic?.light) {
    const light = flattenTokens(tokens.semantic.light, 'semantic.light')
    for (const [k, v] of light) allTokens.set(k, v)
  }

  if (tokens.semantic?.dark) {
    const dark = flattenTokens(tokens.semantic.dark, 'semantic.dark')
    for (const [k, v] of dark) allTokens.set(k, v)
  }

  // Check for naming issues
  const namingPatterns = {
    // Should use lowercase
    uppercase: /[A-Z]/,
    // Should not have spaces
    spaces: /\s/,
    // Should not have special characters (except - and _)
    special: /[^a-zA-Z0-9\-_\.]/,
  }

  for (const [tokenPath] of allTokens) {
    const parts = tokenPath.split('.')
    const name = parts[parts.length - 1]

    if (namingPatterns.spaces.test(name)) {
      issues.push({
        type: 'warning',
        category: 'naming',
        message: `Token name contains spaces`,
        path: tokenPath,
        suggestion: 'Use hyphens or camelCase instead of spaces',
      })
    }

    if (namingPatterns.special.test(name)) {
      issues.push({
        type: 'warning',
        category: 'naming',
        message: `Token name contains special characters`,
        path: tokenPath,
        suggestion: 'Use only alphanumeric characters, hyphens, and underscores',
      })
    }
  }

  return issues
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
function getWCAGContrast(foreground: string, background: string): number | null {
  try {
    // Handle references - skip them
    if (isTokenReference(foreground) || isTokenReference(background)) {
      return null
    }

    return getContrast(foreground, background)
  } catch {
    return null
  }
}

/**
 * Validate WCAG color contrast compliance
 */
function validateContrast(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Define color pairs to check (foreground -> background)
  const contrastPairs = [
    { fg: 'content.primary', bg: 'background.primary', minRatio: 4.5, level: 'AA' },
    { fg: 'content.secondary', bg: 'background.primary', minRatio: 4.5, level: 'AA' },
    { fg: 'content.primary', bg: 'background.secondary', minRatio: 4.5, level: 'AA' },
    { fg: 'content.primary', bg: 'background.tertiary', minRatio: 4.5, level: 'AA' },
  ]

  const modes = ['light', 'dark'] as const

  for (const mode of modes) {
    const modeTokens = tokens.semantic?.[mode]
    if (!modeTokens) continue

    const flatTokens = flattenTokens(modeTokens)

    for (const pair of contrastPairs) {
      const fgToken = flatTokens.get(pair.fg)
      const bgToken = flatTokens.get(pair.bg)

      if (!fgToken || !bgToken) continue

      const fgValue = fgToken.$value
      const bgValue = bgToken.$value

      if (typeof fgValue !== 'string' || typeof bgValue !== 'string') continue

      const ratio = getWCAGContrast(fgValue, bgValue)

      if (ratio === null) continue // Skip references

      if (ratio < pair.minRatio) {
        issues.push({
          type: 'warning',
          category: 'contrast',
          message: `${mode} mode: "${pair.fg}" on "${pair.bg}" has contrast ratio ${ratio.toFixed(2)}:1 (WCAG ${pair.level} requires ${pair.minRatio}:1)`,
          path: `semantic.${mode}.${pair.fg}`,
          suggestion: `Adjust colors to achieve at least ${pair.minRatio}:1 contrast ratio`,
        })
      }
    }
  }

  return issues
}

/**
 * Check for light/dark mode token parity
 */
function validateModeParity(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!tokens.semantic?.light || !tokens.semantic?.dark) {
    return issues
  }

  const lightTokens = flattenTokens(tokens.semantic.light)
  const darkTokens = flattenTokens(tokens.semantic.dark)

  // Check for tokens in light but not in dark
  for (const [path] of lightTokens) {
    if (!darkTokens.has(path)) {
      issues.push({
        type: 'warning',
        category: 'parity',
        message: `Token exists in light mode but not in dark mode`,
        path: `semantic.light.${path}`,
        suggestion: `Add corresponding token to semantic.dark.${path}`,
      })
    }
  }

  // Check for tokens in dark but not in light
  for (const [path] of darkTokens) {
    if (!lightTokens.has(path)) {
      issues.push({
        type: 'warning',
        category: 'parity',
        message: `Token exists in dark mode but not in light mode`,
        path: `semantic.dark.${path}`,
        suggestion: `Add corresponding token to semantic.light.${path}`,
      })
    }
  }

  return issues
}

/**
 * Check for duplicate token values
 */
function validateDuplicates(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!tokens.primitives) return issues

  const primitiveTokens = flattenTokens(tokens.primitives)
  const valueToPath = new Map<string, string[]>()

  for (const [path, token] of primitiveTokens) {
    const value = String(token.$value)

    if (!valueToPath.has(value)) {
      valueToPath.set(value, [])
    }
    valueToPath.get(value)!.push(path)
  }

  for (const [value, paths] of valueToPath) {
    if (paths.length > 1 && !isTokenReference(value)) {
      // Only warn for color duplicates (they're more likely to be intentional consolidation opportunities)
      const isColor = paths.some(p => p.includes('color'))
      if (isColor && paths.length > 3) {
        issues.push({
          type: 'info',
          category: 'duplicates',
          message: `Value "${value}" is used by ${paths.length} tokens`,
          suggestion: `Consider consolidating: ${paths.slice(0, 3).join(', ')}${paths.length > 3 ? '...' : ''}`,
        })
      }
    }
  }

  return issues
}

/**
 * Validate token references resolve correctly
 */
function validateReferences(tokens: TokensData): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Collect all token paths
  const allPaths = new Set<string>()

  if (tokens.primitives) {
    for (const path of flattenTokens(tokens.primitives).keys()) {
      // Add variations of the path for matching
      allPaths.add(path)
      allPaths.add(path.replace('primitives.', ''))
      allPaths.add(path.replace('primitives.colors.', ''))
    }
  }

  // Check semantic token references
  const checkReferences = (obj: TokenGroup, prefix: string) => {
    const flat = flattenTokens(obj, prefix)

    for (const [path, token] of flat) {
      if (typeof token.$value === 'string' && isTokenReference(token.$value)) {
        // Extract reference path: {Zinc.500} -> zinc.500
        const refPath = token.$value
          .replace(/[{}]/g, '')
          .split('.')
          .map(p => p.toLowerCase())
          .join('.')

        // Check if reference exists (simplified check)
        const refExists = Array.from(allPaths).some(
          p =>
            p.toLowerCase().includes(refPath) ||
            refPath.includes(p.toLowerCase().split('.').pop() || '')
        )

        if (!refExists) {
          issues.push({
            type: 'error',
            category: 'references',
            message: `Unresolved reference: ${token.$value}`,
            path: path,
            suggestion: 'Ensure the referenced token exists in primitives',
          })
        }
      }
    }
  }

  if (tokens.semantic?.light) {
    checkReferences(tokens.semantic.light, 'semantic.light')
  }

  if (tokens.semantic?.dark) {
    checkReferences(tokens.semantic.dark, 'semantic.dark')
  }

  return issues
}

/**
 * Run all validations
 */
async function validateTokens(): Promise<ValidationReport> {
  const report: ValidationReport = {
    valid: true,
    errors: 0,
    warnings: 0,
    info: 0,
    issues: [],
    timestamp: new Date().toISOString(),
  }

  // Check if tokens file exists
  if (!fs.existsSync(TOKENS_FILE)) {
    report.valid = false
    report.errors = 1
    report.issues.push({
      type: 'error',
      category: 'file',
      message: 'Tokens file not found',
      path: TOKENS_FILE,
      suggestion: 'Run `npm run sync-figma` or `npm run convert-tokens` first',
    })
    return report
  }

  // Read and parse tokens
  let tokens: TokensData

  try {
    tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
  } catch (error) {
    report.valid = false
    report.errors = 1
    report.issues.push({
      type: 'error',
      category: 'parse',
      message: `Failed to parse tokens file: ${(error as Error).message}`,
      path: TOKENS_FILE,
    })
    return report
  }

  // Run validations
  const spinner = ora('Running token validations...').start()

  const validations = [
    { name: 'Schema', fn: () => validateSchema(tokens) },
    { name: 'Naming', fn: () => validateNaming(tokens) },
    { name: 'Contrast', fn: () => validateContrast(tokens) },
    { name: 'Mode Parity', fn: () => validateModeParity(tokens) },
    { name: 'Duplicates', fn: () => validateDuplicates(tokens) },
    { name: 'References', fn: () => validateReferences(tokens) },
  ]

  for (const validation of validations) {
    try {
      const issues = validation.fn()
      report.issues.push(...issues)
    } catch (error) {
      report.issues.push({
        type: 'error',
        category: 'validation',
        message: `${validation.name} validation failed: ${(error as Error).message}`,
      })
    }
  }

  spinner.succeed('Validations complete')

  // Count issues by type
  for (const issue of report.issues) {
    if (issue.type === 'error') report.errors++
    if (issue.type === 'warning') report.warnings++
    if (issue.type === 'info') report.info++
  }

  report.valid = report.errors === 0

  return report
}

/**
 * Print validation report
 */
function printReport(report: ValidationReport): void {
  console.log('')

  if (report.issues.length === 0) {
    console.log(chalk.green('✓ All token validations passed'))
    return
  }

  // Group issues by category
  const byCategory = new Map<string, ValidationIssue[]>()

  for (const issue of report.issues) {
    if (!byCategory.has(issue.category)) {
      byCategory.set(issue.category, [])
    }
    byCategory.get(issue.category)!.push(issue)
  }

  for (const [category, issues] of byCategory) {
    console.log(chalk.cyan(`\n${category.toUpperCase()}`))

    for (const issue of issues) {
      const icon =
        issue.type === 'error'
          ? chalk.red('✗')
          : issue.type === 'warning'
            ? chalk.yellow('⚠')
            : chalk.blue('ℹ')

      const pathInfo = issue.path ? chalk.gray(` [${issue.path}]`) : ''
      console.log(`  ${icon} ${issue.message}${pathInfo}`)

      if (issue.suggestion) {
        console.log(chalk.gray(`    → ${issue.suggestion}`))
      }
    }
  }

  console.log(chalk.gray('\n─────────────────────────────────'))
  console.log('Summary:')
  console.log(chalk.red(`  • ${report.errors} errors`))
  console.log(chalk.yellow(`  • ${report.warnings} warnings`))
  console.log(chalk.blue(`  • ${report.info} info`))
  console.log('')
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log(chalk.blue('\n🔍 Validating design tokens...\n'))

  const report = await validateTokens()
  printReport(report)

  // Save report
  const reportsDir = path.join(process.cwd(), 'tokens', '.reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  const reportFile = path.join(reportsDir, `validation-${Date.now()}.json`)
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))

  // Exit with error code if validation failed
  if (!report.valid) {
    process.exit(1)
  }
}

// Run if executed directly
main().catch(error => {
  console.error(chalk.red('\nError:'), error.message)
  process.exit(1)
})

export { validateTokens, ValidationReport, ValidationIssue }
