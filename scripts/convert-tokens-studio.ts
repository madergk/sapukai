#!/usr/bin/env tsx
/**
 * Convert Tokens Studio JSON to internal figma-tokens.json format
 * Use this when you export tokens from Tokens Studio plugin
 */

import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'
import ora from 'ora'

const TOKENS_STUDIO_FILE = path.join(process.cwd(), 'tokens', 'tokens.json')
const OUTPUT_FILE = path.join(process.cwd(), 'tokens', 'figma-tokens.json')
const BACKUP_FILE = path.join(process.cwd(), 'tokens', '.figma-tokens.prev.json')

interface TokensStudioToken {
  value: string | number
  type: string
  description?: string
}

interface TokensStudioGroup {
  [key: string]: TokensStudioToken | TokensStudioGroup
}

/**
 * Check if value is a token (has value and type)
 */
function isToken(obj: any): obj is TokensStudioToken {
  return obj && typeof obj === 'object' && 'value' in obj && 'type' in obj
}

/**
 * Resolve token references like {Zinc.500} to actual values
 */
function resolveReference(ref: string, primitives: Record<string, any>): string | null {
  // Remove curly braces: {Zinc.500} -> Zinc.500
  const path = ref.replace(/[{}]/g, '').split('.')
  
  let current: any = primitives
  for (const part of path) {
    if (current && typeof current === 'object') {
      // Try exact match first
      if (current[part]) {
        current = current[part]
      } else {
        // Try lowercase match
        const lowerPart = part.toLowerCase()
        const key = Object.keys(current).find(k => k.toLowerCase() === lowerPart)
        if (key) {
          current = current[key]
        } else {
          return null
        }
      }
    } else {
      return null
    }
  }
  
  if (current && current.$value) {
    return current.$value
  }
  
  return null
}

/**
 * Convert Tokens Studio format to DTCG format
 */
function convertToken(token: TokensStudioToken): { $value: string | number; $type: string; $description?: string } {
  const result: { $value: string | number; $type: string; $description?: string } = {
    $value: token.value,
    $type: token.type === 'color' ? 'color' : token.type === 'number' ? 'number' : 'dimension',
  }
  
  if (token.description) {
    result.$description = token.description
  }
  
  return result
}

/**
 * Process a group of tokens recursively
 */
function processGroup(group: TokensStudioGroup, primitives?: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(group)) {
    // Skip metadata keys
    if (key.startsWith('$')) continue
    
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '')
    
    if (isToken(value)) {
      let tokenValue = value.value
      
      // Resolve references if we have primitives
      if (typeof tokenValue === 'string' && tokenValue.startsWith('{') && primitives) {
        const resolved = resolveReference(tokenValue, primitives)
        if (resolved) {
          tokenValue = resolved
        }
      }
      
      result[normalizedKey] = {
        $value: tokenValue,
        $type: value.type === 'color' ? 'color' : value.type === 'number' ? 'dimension' : 'string',
      }
      
      if (value.description) {
        result[normalizedKey].$description = value.description
      }
    } else if (typeof value === 'object') {
      result[normalizedKey] = processGroup(value as TokensStudioGroup, primitives)
    }
  }
  
  return result
}

/**
 * Main conversion function
 */
async function convertTokensStudio(): Promise<void> {
  console.log(chalk.blue('\n🔄 Converting Tokens Studio format...\n'))

  // Check if source file exists
  if (!fs.existsSync(TOKENS_STUDIO_FILE)) {
    console.error(chalk.red('Error: tokens/tokens.json not found'))
    console.error(chalk.yellow('Export your tokens from Tokens Studio plugin first'))
    process.exit(1)
  }

  const spinner = ora('Reading Tokens Studio file...').start()

  // Read source file
  const sourceData = JSON.parse(fs.readFileSync(TOKENS_STUDIO_FILE, 'utf-8'))
  spinner.succeed('Read Tokens Studio file')

  // Backup existing output if it exists
  if (fs.existsSync(OUTPUT_FILE)) {
    const backupSpinner = ora('Backing up existing tokens...').start()
    fs.copyFileSync(OUTPUT_FILE, BACKUP_FILE)
    backupSpinner.succeed('Backed up existing tokens')
  }

  // Process primitives first (Tailwind Colors)
  const processSpinner = ora('Processing tokens...').start()
  
  const primitivesKey = Object.keys(sourceData).find(k => k.includes('Primitives'))
  const lightKey = Object.keys(sourceData).find(k => k.includes('Light'))
  const darkKey = Object.keys(sourceData).find(k => k.includes('Dark'))
  const dimensionsKey = Object.keys(sourceData).find(k => k.includes('Dimensions'))

  // Build primitives
  const primitives: Record<string, any> = {
    colors: {},
    borderRadius: {},
    spacing: {},
    screens: {},
  }

  if (primitivesKey && sourceData[primitivesKey]) {
    const primData = sourceData[primitivesKey]
    for (const [colorName, colorShades] of Object.entries(primData)) {
      if (colorName === 'White' || colorName === 'Black') {
        primitives.colors[colorName.toLowerCase()] = convertToken(colorShades as TokensStudioToken)
      } else if (typeof colorShades === 'object' && !isToken(colorShades)) {
        primitives.colors[colorName.toLowerCase()] = processGroup(colorShades as TokensStudioGroup)
      }
    }
  }

  if (dimensionsKey && sourceData[dimensionsKey]) {
    const dimData = sourceData[dimensionsKey]
    
    // Border Radius
    if (dimData['Border Radius']) {
      for (const [key, value] of Object.entries(dimData['Border Radius'])) {
        if (isToken(value)) {
          const normalizedKey = key.replace('rounded-', '').replace('rounded', 'DEFAULT')
          primitives.borderRadius[normalizedKey] = {
            $value: `${value.value}px`,
            $type: 'dimension',
          }
        }
      }
    }
    
    // Spacing
    if (dimData['Spacing (Margin & Padding)']) {
      for (const [key, value] of Object.entries(dimData['Spacing (Margin & Padding)'])) {
        if (isToken(value)) {
          // Normalize key: replace special chars
          const normalizedKey = key.replace('․', '.')
          primitives.spacing[normalizedKey] = {
            $value: `${value.value}px`,
            $type: 'dimension',
          }
        }
      }
    }
    
    // Screens
    if (dimData['Screens']) {
      for (const [key, value] of Object.entries(dimData['Screens'])) {
        if (isToken(value)) {
          primitives.screens[key] = {
            $value: `${value.value}px`,
            $type: 'dimension',
            ...(value.description && { $description: value.description }),
          }
        }
      }
    }
  }

  // Build semantic tokens (light and dark)
  const semantic: Record<string, any> = {
    light: {},
    dark: {},
  }

  // Process light mode
  if (lightKey && sourceData[lightKey]) {
    semantic.light = processSemanticTokens(sourceData[lightKey], primitives)
  }

  // Process dark mode
  if (darkKey && sourceData[darkKey]) {
    semantic.dark = processSemanticTokens(sourceData[darkKey], primitives)
  }

  processSpinner.succeed('Processed tokens')

  // Build output
  const output = {
    $schema: 'https://design-tokens.org/schema.json',
    $metadata: {
      source: 'Figma (Tokens Studio)',
      fileKey: 'rxkEYwOrbpifrqowduvVHM',
      extractedAt: new Date().toISOString(),
      version: '1.0.0',
    },
    primitives,
    semantic,
  }

  // Write output
  const writeSpinner = ora('Writing figma-tokens.json...').start()
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
  writeSpinner.succeed(`Written to ${chalk.cyan('tokens/figma-tokens.json')}`)

  console.log(chalk.green('\n✓ Conversion complete!\n'))
  console.log('Next steps:')
  console.log(chalk.gray('  1. Run: npm run build-tokens'))
  console.log(chalk.gray('  2. Or full sync: npm run sync-tokens -- --skip-figma'))
  console.log('')
}

/**
 * Process semantic tokens with reference resolution
 */
function processSemanticTokens(data: TokensStudioGroup, primitives: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  
  for (const [category, tokens] of Object.entries(data)) {
    const categoryKey = category.toLowerCase()
    result[categoryKey] = {}
    
    if (typeof tokens === 'object' && !isToken(tokens)) {
      for (const [tokenName, tokenValue] of Object.entries(tokens as TokensStudioGroup)) {
        const normalizedName = tokenName.replace(/^(content|border|background)/, '').toLowerCase() || tokenName.toLowerCase()
        
        if (isToken(tokenValue)) {
          let resolvedValue = tokenValue.value
          
          // Resolve references
          if (typeof resolvedValue === 'string' && resolvedValue.startsWith('{')) {
            const resolved = resolveReference(resolvedValue, primitives.colors)
            if (resolved) {
              resolvedValue = resolved
            }
          }
          
          result[categoryKey][normalizedName] = {
            $value: resolvedValue,
            $type: tokenValue.type,
          }
        } else if (typeof tokenValue === 'object') {
          // Handle nested groups like Extensions
          for (const [nestedName, nestedValue] of Object.entries(tokenValue as TokensStudioGroup)) {
            if (isToken(nestedValue)) {
              let resolvedValue = nestedValue.value
              
              if (typeof resolvedValue === 'string' && resolvedValue.startsWith('{')) {
                const resolved = resolveReference(resolvedValue, primitives.colors)
                if (resolved) {
                  resolvedValue = resolved
                }
              }
              
              // Remove prefix from nested names
              const cleanName = nestedName.replace(/^(content|border|background)/, '').toLowerCase()
              result[categoryKey][cleanName] = {
                $value: resolvedValue,
                $type: nestedValue.type,
              }
            }
          }
        }
      }
    }
  }
  
  return result
}

// Run
convertTokensStudio().catch((error) => {
  console.error(chalk.red('\nError:'), error.message)
  process.exit(1)
})
